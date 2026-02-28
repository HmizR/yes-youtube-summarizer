// services/cloudAIService.js - Optional fallback
const axios = require('axios');

class CloudAIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  async generateSummary(transcript, options = {}) {
    // Try OpenAI first
    if (this.openaiApiKey) {
      try {
        return await this.useOpenAI(transcript, options);
      } catch (error) {
        console.warn('OpenAI failed:', error.message);
      }
    }
    
    // Try Gemini
    if (this.geminiApiKey) {
      try {
        return await this.useGemini(transcript, options);
      } catch (error) {
        console.warn('Gemini failed:', error.message);
      }
    }
    
    throw new Error('No cloud AI service available');
  }

  async useOpenAI(transcript, options) {
    const transcriptText = transcript.map(item => item.text).join(' ');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a YouTube video summarizer. Create concise summaries.'
          },
          {
            role: 'user',
            content: `Summarize this video transcript: ${transcriptText.substring(0, 4000)}`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      summary: response.data.choices[0].message.content,
      keyPoints: [],
      tags: [],
      sentiment: 'neutral',
      complexity: 'medium',
      aiModel: 'gpt-3.5-turbo'
    };
  }

  async useGemini(transcript, options) {
    // Similar implementation for Gemini
    // ...
  }
}

module.exports = new CloudAIService();