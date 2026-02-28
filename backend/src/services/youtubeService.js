const axios = require('axios');
const ytdl = require('@distube/ytdl-core');
// const { YouTubeTranscript } = require('youtube-transcript');

class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
  }

  // Extract video ID from URL
  extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Get video metadata
  async getVideoInfo(videoId) {
    try {
      if (this.apiKey) {
        // Use YouTube API if key is available
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: 'snippet,contentDetails,statistics',
              id: videoId,
              key: this.apiKey
            }
          }
        );

        if (response.data.items.length === 0) {
          throw new Error('Video not found');
        }

        const video = response.data.items[0];
        return {
          videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          channelName: video.snippet.channelTitle,
          channelId: video.snippet.channelId,
          thumbnailUrl: video.snippet.thumbnails.maxres?.url || 
                       video.snippet.thumbnails.high?.url,
          publishedAt: video.snippet.publishedAt,
          duration: this.formatDuration(video.contentDetails.duration),
          views: video.statistics.viewCount,
          likes: video.statistics.likeCount,
          category: video.snippet.categoryId
        };
      } else {
        // Fallback to ytdl-core
        const info = await ytdl.getInfo(videoId, {
          cache: false
        });
        console.log('[DEBUG] Passed ytdl videoDetails:', info.videoDetails);
        return {
          videoId,
          video_title: info.videoDetails.title,
          description: info.videoDetails.description,
          channel_name: info.videoDetails.author.name,
          channel_id: info.videoDetails.author.id,
          thumbnail_url: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
          published_at: info.videoDetails.publishDate,
          duration: this.formatDuration(info.videoDetails.lengthSeconds),
          views: info.videoDetails.viewCount,
          likes: info.videoDetails.likes
        };
      }
    } catch (error) {
      console.error('Error fetching video info:', error.message);
      throw new Error('Failed to fetch video information');
    }
  }

  // Get video transcript
  async getTranscript(videoId) {
    try {
      const { fetchTranscript } = await import('youtube-transcript-plus');

      let transcript;

      // 1️⃣ Try English subtitles first
      try {
        transcript = await fetchTranscript(videoId, { lang: 'en' });
      } catch (e) {
        console.warn('[WARN] English subtitles not found, trying default...');
      }

      // 2️⃣ Fallback to default subtitles (no lang specified)
      if (!transcript) {
        transcript = await fetchTranscript(videoId);
      }

      console.log('[DEBUG] Fetched transcript items:', transcript.slice(-3));

      return transcript.map(item => ({
        timestamp: this.formatTime(item.offset),
        text: item.text,
        duration: item.duration
      }));

    } catch (error) {
      console.error('Error fetching transcript:', error.message);
      
      // 3️⃣ Final fallback: video description
      try {
        const info = await ytdl.getInfo(videoId);
        if (info.videoDetails.description) {
          return [{
            timestamp: '0:00',
            text: info.videoDetails.description.substring(0, 1000),
            duration: 0
          }];
        }
      } catch (e) {
        console.error('Fallback also failed:', e.message);
      }
      
      throw new Error('Failed to fetch transcript. This video might not have captions.');
    }
  }


  // Helper methods
  formatDuration(seconds) {
    const s = Number(seconds);
    if (!Number.isFinite(s) || s < 0) return '0:00';

    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  // formatDuration(seconds) {
  //   if (!seconds) return '0:00';
    
  //   if (typeof seconds === 'string') {
  //     // Parse ISO 8601 duration
  //     const match = seconds.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  //     if (!match) return '0:00';
      
  //     const hours = (match[1] || '').replace('H', '');
  //     const minutes = (match[2] || '').replace('M', '');
  //     const secs = (match[3] || '').replace('S', '');
      
  //     if (hours) {
  //       return `${hours}:${minutes.padStart(2, '0')}:${secs.padStart(2, '0')}`;
  //     }
  //     return `${minutes}:${secs.padStart(2, '0')}`;
  //   }
    
  //   // Convert seconds to MM:SS or HH:MM:SS
  //   const hrs = Math.floor(seconds / 3600);
  //   const mins = Math.floor((seconds % 3600) / 60);
  //   const secs = Math.floor(seconds % 60);
    
  //   if (hrs > 0) {
  //     return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  //   }
  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // }

  formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

module.exports = new YouTubeService();