const axios = require('axios');
const { parse } = require('tough-cookie');

class OllamaService {
  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.defaultModel = process.env.OLLAMA_MODEL || 'llama2';
    this.summaryModel = process.env.OLLAMA_MODEL_SUMMARY || 'llama2:13b';
    this.fastModel = process.env.OLLAMA_MODEL_FAST || 'llama2:7b';
    this.timeout = parseInt(process.env.OLLAMA_TIMEOUT) || 300000;
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.host}/api/tags`, {
        timeout: 5000
      });
      return {
        available: true,
        models: response.data.models || [],
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }

  async generateSummary(transcript, options = {}) {
    const startTime = Date.now();
    
    try {
      const {
        model = this.summaryModel,
        length = 'long',
        language = 'english',
        includeKeyPoints = true,
        includeChapters = false
      } = options;

      // Prepare transcript text (truncate if too long)
      const transcriptText = transcript.map(item => item.text).join(' ');
      const maxTokens = this.getMaxTokens(length);
      const truncatedText = this.truncateText(transcriptText, maxTokens * 3); // Approximate character limit

      // Create prompt for Ollama
      const prompt = this.createSummaryPrompt(truncatedText, {
        length,
        language,
        includeKeyPoints,
        includeChapters
      });

      // Generate summary using Ollama
      const summaryResult = await this.generateCompletion(prompt, {
        model,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: maxTokens
        }
      });

      console.log(summaryResult);

      // Parse the response
      const parsedResult = this.parseSummaryResponse(summaryResult, {
        includeKeyPoints,
        includeChapters
      });

      console.log(parsedResult);

      // Generate additional metadata in parallel
      const [sentiment, tags] = await Promise.all([
        this.analyzeSentiment(parsedResult.summary),
        this.extractTags(parsedResult.summary, transcriptText)
      ]);

      const processingTime = Date.now() - startTime;

      return {
        ...parsedResult,
        sentiment,
        tags,
        processingTime,
        aiModel: model,
        modelProvider: 'ollama'
      };
    } catch (error) {
      console.error('Ollama summary generation failed:', error);
      throw error;
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  async generateCompletion(prompt, options = {}) {
    try {
      const response = await axios.post(`${this.host}/api/generate`, {
        model: options.model || this.defaultModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.options?.temperature || 0.7,
          top_p: options.options?.top_p || 0.9,
          top_k: options.options?.top_k || 40,
          num_predict: options.options?.num_predict || 512,
          repeat_penalty: options.options?.repeat_penalty || 1.1,
          stop: options.options?.stop || ['###', 'Human:', 'Assistant:']
        }
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async analyzeSentiment(text) {
    try {
      const prompt = `Analyze the sentiment of this text. Respond with ONLY one word: "positive", "negative", or "neutral".

Text: ${text.substring(0, 500)}

Sentiment:`;

      const response = await this.generateCompletion(prompt, {
        model: this.fastModel,
        options: {
          temperature: 0.3,
          num_predict: 10
        }
      });

      const sentiment = response.trim().toLowerCase();
      return ['positive', 'negative', 'neutral'].includes(sentiment) 
        ? sentiment 
        : 'neutral';
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return 'neutral';
    }
  }

  async extractTags(summary, fullText) {
    try {
      const prompt = `Extract 3-5 relevant tags/categories from this text. Return ONLY a JSON array of strings.

Text: ${summary.substring(0, 800)}

Tags:`;

      const response = await this.generateCompletion(prompt, {
        model: this.fastModel,
        options: {
          temperature: 0.5,
          num_predict: 100
        }
      });

      try {
        // Try to parse as JSON
        const tags = JSON.parse(response.trim());
        if (Array.isArray(tags)) {
          return tags.slice(0, 5).map(tag => 
            tag.replace(/[^a-zA-Z0-9\s]/g, '').trim()
          ).filter(tag => tag.length > 0);
        }
      } catch (e) {
        // If not JSON, extract comma-separated tags
        const tagMatch = response.match(/\[(.*?)\]/) || response.split(',');
        if (Array.isArray(tagMatch)) {
          return tagMatch
            .map(tag => tag.replace(/[\[\]"]/g, '').trim())
            .filter(tag => tag.length > 0 && tag.length < 30)
            .slice(0, 5);
        }
      }

      return [];
    } catch (error) {
      console.error('Tag extraction failed:', error);
      return [];
    }
  }

  async batchSummarize(texts, options = {}) {
    const results = [];
    
    for (const [index, text] of texts.entries()) {
      try {
        const summary = await this.generateSummary([{ text }], options);
        results.push({
          index,
          success: true,
          data: summary
        });
      } catch (error) {
        results.push({
          index,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Helper methods
  createSummaryPrompt(text, options) {
    const { length, language, includeKeyPoints, includeChapters } = options;

    const lengthInstructions = {
      short: '2–3 sentences',
      medium: '1 concise paragraph',
      long: '2 to 3 detailed paragraphs'
    }[length] || '1 concise paragraph';

    let prompt = `
  You are an expert YouTube video summarizer.

  Your task:
  - Clean and normalize the transcript (remove filler words, repetitions, and transcription errors).
  - Preserve the original meaning.
  - Write the output entirely in ${language}. Do NOT mix languages.

  Transcript:
  ${text}

  Output requirements:
  - Summary length: ${lengthInstructions}
  - Be clear, neutral, and informative.
  - point out important things and explains why they are important.
  - give a breakdown of complex concepts in simple terms.
  - Do NOT mention the transcript or the summarization process.

  Return the result in the EXACT format below.
  Do NOT add extra text.

  SUMMARY:
  [Write the summary here ]
  `;

    if (includeKeyPoints) {
      prompt += `
  KEY POINTS:
  1. [Key point one]
  2. [Key point two]
  3. [Key point three]
  `;
    }

    if (includeChapters) {
      prompt += `
  CHAPTERS:
  - Use timestamps only if clear topic changes exist.
  - If not applicable, write: None
  Example:
  [0:00] Introduction
  [2:15] Main idea
  `;
    }

    prompt += `
  COMPLEXITY:
  [low | medium | high]
  `;

  console.log(prompt);

    return prompt.trim();
  }


  parseSummaryResponse(response, options) {
    const result = {
      summary: '',
      keyPoints: [],
      chapters: [],
      complexity: 'medium'
    };

    // Extract summary
    const summaryMatch = response.match(/SUMMARY:\s*(.*?)(?=KEY POINTS:|CHAPTERS:|COMPLEXITY:|$)/s);
    if (summaryMatch) {
      result.summary = summaryMatch[1]
        .trim()
        .replace(/\n\s*\n+/g, '\n\n'); 
    } else {
      // Fallback: take first paragraph
      result.summary = response
        .split(/KEY POINTS:|CHAPTERS:|COMPLEXITY:/)[0]
        .replace(/^SUMMARY:/, '')
        .trim();
      // result.summary = response.split('\n\n')[0] || response.substring(0, 500);
    }

    // Extract key points
    if (options.includeKeyPoints) {
      const keyPointsMatch = response.match(/KEY POINTS:\s*(.*?)(?=CHAPTERS:|COMPLEXITY:|$)/s);
      if (keyPointsMatch) {
        const points = keyPointsMatch[1]
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(point => point.length > 0);
        result.keyPoints = points.slice(0, 5);
      }
    }

    // Extract chapters
    if (options.includeChapters) {
      const chaptersMatch = response.match(/CHAPTERS:\s*(.*?)(?=COMPLEXITY:|$)/s);
      if (chaptersMatch) {
        const chapters = chaptersMatch[1]
          .split('\n')
          .map(line => {
            const match = line.match(/\[(.*?)\]\s*(.*)/);
            return match ? { timestamp: match[1], title: match[2].trim() } : null;
          })
          .filter(chapter => chapter);
        result.chapters = chapters;
      }
    }

    // Extract complexity
    const complexityMatch = response.match(/COMPLEXITY:\s*(low|medium|high)/i);
    if (complexityMatch) {
      result.complexity = complexityMatch[1].toLowerCase();
    }

    return result;
  }

  getMaxTokens(length) {
    const tokenMap = {
      short: 3000,
      medium: 4000,
      long: 5000
    };
    return tokenMap[length] || 2000;
  }

  truncateText(text, maxChars) {
    if (text.length <= maxChars) return text;
    
    // Try to truncate at sentence boundary
    const truncated = text.substring(0, maxChars);
    const lastPeriod = truncated.lastIndexOf('. ');
    
    if (lastPeriod > maxChars * 0.8) {
      return truncated.substring(0, lastPeriod + 1);
    }
    
    return truncated + '...';
  }

  // Model management
  async listModels() {
    try {
      const response = await axios.get(`${this.host}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  async pullModel(modelName) {
    try {
      const response = await axios.post(`${this.host}/api/pull`, {
        name: modelName,
        stream: false
      });
      return response.data;
    } catch (error) {
      console.error('Failed to pull model:', error);
      throw error;
    }
  }

  // ========== NEW DISCUSSION/CHAT FUNCTIONS ==========

  async getAvailableModels() {
    try {
      const response = await axios.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      console.error('Error fetching Ollama models:', error.message);
      return [];
    }
  }

  // Check if model supports chat format
  supportsChat(modelName = '') {
    const models = Array.isArray(this.supportedChatModels)
      ? this.supportedChatModels
      : [];

    return models.some(model => modelName.includes(model));
  }

  async generateResponse({ 
    model = 'gemma-2-2b-it', 
    summary, 
    conversation, 
    userMessage,
    temperature = 0.7,
    maxTokens = 10000 
  }) {
    try {
      // Build system prompt with video context
      const systemPrompt = this.buildSystemPrompt(summary);

      console.log('System Prompt:', systemPrompt);
      
      // Prepare messages array for chat API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.formatConversationMessages(conversation),
        { role: 'user', content: userMessage }
      ];

      // Optimize context length
      const optimizedMessages = this.optimizeContext(messages, model);
      
      // Check if model supports chat API
      if (this.supportsChat(model)) {
        return await this.generateChatResponse(model, optimizedMessages, temperature, maxTokens);
      } else {
        // Fallback to generate API for models that don't support chat
        return await this.generateLegacyResponse(model, optimizedMessages, temperature, maxTokens);
      }
    } catch (error) {
      console.error('Error generating Ollama response:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  async generateChatResponse(model, messages, temperature, maxTokens) {
    const response = await axios.post(`${this.host}/api/chat`, {
      model,
      messages,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      }
    });

    return {
      content: response.data.message.content,
      model: model,
      tokenCount: response.data.eval_count || 0,
      totalDuration: response.data.total_duration || 0,
      loadDuration: response.data.load_duration || 0,
      promptTokens: response.data.prompt_eval_count || 0
    };
  }

  async generateLegacyResponse(model, messages, temperature, maxTokens) {
    // Fallback for models that don't support chat format
    const prompt = this.messagesToPrompt(messages);
    
    const response = await axios.post(`${this.host}/api/generate`, {
      model,
      prompt,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
        stop: ['</s>', 'User:', 'Assistant:', 'System:']
      }
    });

    return {
      content: response.data.response,
      model: model,
      tokenCount: response.data.eval_count || 0,
      totalDuration: response.data.total_duration || 0,
      loadDuration: response.data.load_duration || 0,
      promptTokens: 0 // Not available in generate API
    };
  }

  // Optimize context to prevent hitting token limits
  optimizeContext(messages, model) {
    const MAX_MESSAGES = 20; // Keep reasonable history
    const MAX_SYSTEM_TOKENS = 500;
    
    // Limit conversation history
    if (messages.length > MAX_MESSAGES) {
      // Keep system message, remove oldest conversation messages
      const systemMessage = messages[0];
      const recentMessages = messages.slice(-(MAX_MESSAGES - 1));
      return [systemMessage, ...recentMessages];
    }
    
    // Truncate system message if too long
    if (messages[0].content.length > MAX_SYSTEM_TOKENS * 4) { // Rough estimate: 4 chars per token
      messages[0].content = messages[0].content.substring(0, MAX_SYSTEM_TOKENS * 4) + '...';
    }
    
    return messages;
  }

  formatConversationMessages(conversation) {
    return conversation.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));
  }

  buildSystemPrompt(summary) {
    return `You are a helpful AI assistant that helps users understand YouTube videos.
    
Current Video Context:
Title: ${summary.video_title}
Channel: ${summary.channel_name}
Duration: ${summary.duration}
Published: ${summary.published_at ? new Date(summary.published_at).toLocaleDateString() : 'Unknown'}

${/* Video Summary: */ ''}
${/* summary.summary */ '' /* || 'No summary available.' */}

${/* Key Points: */ ''}
${/*summary.key_points?.map(point => `• ${point}`).join('\n') || 'None' */ ''}

Transcript Excerpts ${''/*(first 5 lines)*/}:
${summary.transcript?.map(t => `${t.timestamp}: ${t.text}`).join('\n') || 'None' /* .slice(0, 5) */}

Instructions:
1. Answer questions based ONLY on the video content above
2. Be concise but helpful
3. If you don't know something, say so politely
4. Format your responses with clear paragraphs
5. Use bullet points when listing multiple items
6. Don't make up information not in the video
7. If asked about something not covered, suggest what parts of the video might be relevant
8. Keep responses under 500 words unless specifically asked for detailed explanation`;
  }

  messagesToPrompt(messages) {
    return messages.map(msg => {
      const role = msg.role === 'system' ? 'System' : 
                   msg.role === 'assistant' ? 'Assistant' : 'User';
      return `${role}: ${msg.content}\n`;
    }).join('') + 'Assistant:';
  }

  // Generate suggested questions (unchanged)
  async generateQuestions(summary, count = 5) {
    try {
      const prompt = `Based on this video summary, generate ${count} interesting questions that viewers might ask:
      
Video Title: ${summary.video_title}
Summary: ${summary.summary}

Key Points:
${summary.key_points?.map(point => `• ${point}`).join('\n') || 'None'}

Generate ${count} diverse questions covering:
1. Clarification questions
2. Deep dive questions
3. Application questions
4. Comparison questions
5. General questions

Format each question as a single line.`;

      const response = await axios.post(`${this.host}/api/generate`, {
        model: 'llama2',
        prompt,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 500
        }
      });

      const questions = response.data.response
        .split('\n')
        .filter(line => line.trim() && !line.match(/^(Format|Generate|Video|Key Points|Summary)/i))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, count);

      return questions.map((question, index) => ({
        id: `temp-${index}`,
        question,
        category: this.categorizeQuestion(question),
        difficulty: 'medium'
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.getDefaultQuestions();
    }
  }

  categorizeQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('what is') || lowerQuestion.includes('explain') || lowerQuestion.includes('define')) {
      return 'clarification';
    } else if (lowerQuestion.includes('how') || lowerQuestion.includes('why') || lowerQuestion.includes('deep')) {
      return 'deep_dive';
    } else if (lowerQuestion.includes('use') || lowerQuestion.includes('apply') || lowerQuestion.includes('practical')) {
      return 'application';
    } else if (lowerQuestion.includes('compare') || lowerQuestion.includes('difference') || lowerQuestion.includes('vs')) {
      return 'comparison';
    }
    return 'general';
  }

  getDefaultQuestions() {
    return [
      { id: '1', question: 'What are the main takeaways from this video?', category: 'general', difficulty: 'easy' },
      { id: '2', question: 'Can you explain the key concepts in simpler terms?', category: 'clarification', difficulty: 'easy' },
      { id: '3', question: 'How can I apply what I learned from this video?', category: 'application', difficulty: 'medium' },
      { id: '4', question: 'What prerequisites should I know before watching this?', category: 'clarification', difficulty: 'medium' },
      { id: '5', question: 'Are there any limitations or criticisms of the approach discussed?', category: 'deep_dive', difficulty: 'hard' }
    ];
  }
}

module.exports = new OllamaService();