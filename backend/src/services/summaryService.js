const YouTubeService = require('./youtubeService');
const OllamaService = require('./ollamaService');
const CloudAIService = require('./cloudAIService'); // Optional fallback

class SummaryService {
  constructor() {
    this.youtube = YouTubeService;
    this.ollama = OllamaService;
    this.cloudAI = CloudAIService; // Optional fallback
  }

  async createSummary(videoUrl, options = {}, user = null) {
    const startTime = Date.now();

    try {
      const videoId = this.youtube.extractVideoId(videoUrl);
      if (!videoId) throw new Error('Invalid YouTube URL');

      console.log('Passed video ID extraction:', videoId);

      const ollamaHealth = await this.ollama.checkHealth();
      if (!ollamaHealth.available && process.env.ENABLE_AI_FALLBACK !== 'true') {
        throw new Error('No AI service available');
      }
      console.log('Passed Ollama health check:', ollamaHealth.available ? 'available' : 'unavailable');

      const videoInfo = await this.youtube.getVideoInfo(videoId);
      console.log('Passed video info retrieval:', videoInfo.title);

      let transcript = [];
      try {
        transcript = await this.youtube.getTranscript(videoId);
      } catch {
        transcript = [];
      }
      console.log('Passed transcript retrieval, length:', transcript.length);
      console.log('Transcript sample:', transcript.slice(-3)); // Log last 3 items

      let aiResult;
      if (ollamaHealth.available) {
        aiResult = await this.ollama.generateSummary(transcript, {
          ...options,
          model: process.env.OLLAMA_MODEL_SUMMARY
        });
      } else {
        aiResult = await this.cloudAI.generateSummary(transcript, options);
        aiResult.modelProvider = 'cloud_fallback';
      }

      const summaryWordCount = aiResult.summary.split(/\s+/).length;

      const originalWordCount = transcript.length
        ? transcript.reduce((c, i) => c + i.text.split(/\s+/).length, 0)
        : summaryWordCount;

      const reductionPercentage = originalWordCount > 0
        ? Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100)
        : 0;

      let videoDuration = 0;
      try {
        videoDuration = this.parseDuration(videoInfo.duration);
      } catch {}

      const timeSaved = this.formatTimeSaved(videoDuration, reductionPercentage);

      return {
        ...videoInfo,
        summary: aiResult.summary,
        key_points: aiResult.keyPoints || [],
        transcript,
        chapters: aiResult.chapters || [],
        tags: aiResult.tags || [],
        category: this.detectCategory(aiResult.tags, videoInfo.title),
        sentiment: aiResult.sentiment || 'neutral',
        complexity: aiResult.complexity || 'medium',
        original_word_count: originalWordCount,
        summary_word_count: summaryWordCount,
        reduction_percentage: reductionPercentage,
        time_saved: timeSaved,
        processing_time: Math.round((Date.now() - startTime) / 1000),
        ai_model: aiResult.aiModel || 'ollama',
        model_provider: aiResult.modelProvider || 'ollama',
        status: 'completed'
      };
    } catch (error) {
      console.error('createSummary FAILED:', error);
      throw error;
    }
  }


  // Helper methods (same as before)
  parseDuration(durationStr) {
    if (!durationStr) return 0;
    
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(durationStr) || 0;
  }

  formatTimeSaved(durationSeconds, reductionPercent) {
    const savedSeconds = durationSeconds * (reductionPercent / 100);
    
    if (savedSeconds < 60) {
      return `${Math.round(savedSeconds)} seconds`;
    } else if (savedSeconds < 3600) {
      const minutes = Math.round(savedSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = (savedSeconds / 3600).toFixed(1);
      return `${hours} hour${hours !== '1.0' ? 's' : ''}`;
    }
  }

  detectCategory(tags, title) {
    const techKeywords = ['programming', 'coding', 'tech', 'software', 'ai', 'machine learning', 'python', 'javascript'];
    const businessKeywords = ['business', 'startup', 'entrepreneur', 'marketing', 'finance'];
    const educationKeywords = ['education', 'learning', 'tutorial', 'course', 'lecture'];
    
    const text = (title + ' ' + tags.join(' ')).toLowerCase();
    
    if (techKeywords.some(keyword => text.includes(keyword))) return 'Technology';
    if (businessKeywords.some(keyword => text.includes(keyword))) return 'Business';
    if (educationKeywords.some(keyword => text.includes(keyword))) return 'Education';
    
    return 'Other';
  }
}

module.exports = new SummaryService();