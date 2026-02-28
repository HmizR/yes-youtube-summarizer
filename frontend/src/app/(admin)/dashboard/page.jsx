// components/dashboard/MainContent.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  Calendar,
  Users,
  Tag,
  MoreVertical,
  Play,
  Copy,
  Share2,
  CheckCircle,
  Loader2,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const WEBSOCKET_URL = process.env.NEXT_WEBSOCKET_URL || 'http://192.168.1.30:5000';

const MainContent = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [summaries, setSummaries] = useState([]);
  const [stats, setStats] = useState({
    totalSummaries: 0,
    timeSaved: 0,
    thisMonth: 0,
    reductionRate: 0
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/stats`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      if (data.success) {
        setStats({
          totalSummaries: data.data.user.summaries_created || 0,
          timeSaved: Math.round((data.data.user.total_time_saved || 0) / 60), // Convert minutes to hours
          thisMonth: data.data.statistics?.monthly_usage || 0,
          reductionRate: 0 // Default, you can calculate from summaries
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch summaries
  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries?limit=50&sortBy=created_at&sortOrder=DESC`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summaries');
      }

      const data = await response.json();
      if (data.success) {
        setSummaries(data.data);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
      setError('Failed to load summaries');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new summary
  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsSummarizing(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          options: {
            length: 'long',
            includeKeyPoints: true,
            includeChapters: true
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create summary');
      }

      if (data.success) {
        // Show success message
        // alert('Summary processing started! You will be notified when it\'s ready.');
        
        // Clear input
        setVideoUrl('');
        
        // Refresh summaries after a delay
        setTimeout(() => {
          fetchSummaries();
          fetchUserStats();
        }, 3000);
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setError(error.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Copy summary to clipboard
  const handleCopySummary = async (summaryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries/${summaryId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      if (data.success && data.data.summary) {
        await navigator.clipboard.writeText(data.data.summary);
        alert('Summary copied to clipboard!');
      }
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy summary');
    }
  };

  // Export summary
  const handleExportSummary = async (summaryId, format = 'txt') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries/${summaryId}/export/${format}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to export summary');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${summaryId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export summary');
    }
  };

  // Delete summary
  const handleDeleteSummary = async (summaryId) => {
    if (!confirm('Are you sure you want to delete this summary?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries/${summaryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete summary');
      }

      // Remove from local state
      setSummaries(prev => prev.filter(s => s.id !== summaryId));
      
      // Refresh stats
      fetchUserStats();
      
      alert('Summary deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete summary');
    }
  };

  // Bookmark summary
  const handleToggleBookmark = async (summaryId, currentlyBookmarked) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/summaries/${summaryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          isBookmarked: !currentlyBookmarked
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      // Update local state
      setSummaries(prev => prev.map(summary => 
        summary.id === summaryId 
          ? { ...summary, is_bookmarked: !currentlyBookmarked }
          : summary
      ));
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    document.title = 'Dashboard - YouTube Summarizer';

    fetchSummaries();
    fetchUserStats();

    // Set up WebSocket for real-time updates (optional)
    const setupWebSocket = () => {
      const token = getAuthToken();
      if (!token) return;

      const socket = io(WEBSOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket']
      });

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('summary-completed', (data) => {
        fetchSummaries();
        fetchUserStats();
        router.push(`/summary/${data.summaryId}`);
        // alert(`Summary completed: ${data.videoTitle}`);
      });

      socket.on('summary-failed', (data) => {
        alert(`Summary failed: ${data.error}`);
      });

      socket.on('summary-exists', (data) => {
        alert(`Summary already exists: ${data.videoTitle}`);
      });

      socket.on('summary-already-processing', (data) => {
        alert(`Summary already processing: ${data.videoTitle}`);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => socket.disconnect();
    };

    const cleanup = setupWebSocket();
    return cleanup;
  }, []);

  // Filter summaries based on active tab
  const filteredSummaries = summaries.filter(summary => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return summary.status === 'completed';
    if (activeTab === 'processing') return summary.status === 'processing';
    if (activeTab === 'bookmarked') return summary.is_bookmarked;
    return true;
  });

  // Calculate stats from summaries (fallback if API stats fail)
  const calculateDerivedStats = () => {
    if (summaries.length > 0) {
      const completedSummaries = summaries.filter(s => s.status === 'completed');
      const totalReduction = completedSummaries.reduce((acc, s) => acc + (s.reduction_percentage || 0), 0);
      const avgReduction = completedSummaries.length > 0 ? totalReduction / completedSummaries.length : 0;
      
      return {
        totalSummaries: summaries.length,
        timeSaved: Math.round(summaries.reduce((acc, s) => {
          // Parse time saved from string like "42 minutes" or "1.5 hours"
          if (s.time_saved) {
            if (s.time_saved.includes('hour')) {
              const hours = parseFloat(s.time_saved);
              return acc + (isNaN(hours) ? 0 : hours);
            } else if (s.time_saved.includes('minute')) {
              const minutes = parseFloat(s.time_saved);
              return acc + (isNaN(minutes) ? 0 : minutes / 60);
            }
          }
          return acc;
        }, 0)),
        thisMonth: summaries.filter(s => {
          const summaryDate = new Date(s.created_at);
          const now = new Date();
          return summaryDate.getMonth() === now.getMonth() && 
                 summaryDate.getFullYear() === now.getFullYear();
        }).length,
        reductionRate: Math.round(avgReduction)
      };
    }
    return stats;
  };

  const derivedStats = calculateDerivedStats();

  const tabs = [
    { id: 'all', label: 'All Summaries', count: summaries.length },
    { id: 'completed', label: 'Completed', count: summaries.filter(s => s.status === 'completed').length },
    { id: 'processing', label: 'Processing', count: summaries.filter(s => s.status === 'processing').length },
    { id: 'bookmarked', label: 'Bookmarked', count: summaries.filter(s => s.is_bookmarked).length }
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-900/10 dark:to-purple-900/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                You&apos;ve saved <span className="font-semibold text-red-600 dark:text-red-400">
                  {derivedStats.timeSaved} hour{derivedStats.timeSaved !== 1 ? 's' : ''}
                </span> by summarizing {derivedStats.totalSummaries} videos
              </p>
            </div>
            <div className="hidden md:block">
              <Sparkles className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Quick Summarize Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Summarize YouTube Video
            </h2>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSummarize();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Summarize
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: YouTube videos, shorts, playlists (first video)
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Summaries</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {derivedStats.totalSummaries}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +{Math.round(derivedStats.totalSummaries * 0.12)} this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {derivedStats.timeSaved}h
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  ≈ {Math.round(derivedStats.timeSaved * 60 / 45)} full videos
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {derivedStats.thisMonth}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +3 vs last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reduction Rate</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {derivedStats.reductionRate}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Avg. content reduced
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search summaries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchSummaries}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 dark:text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Summaries List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading summaries...</p>
              </div>
            ) : filteredSummaries.length > 0 ? (
              filteredSummaries.map((summary) => (
                <div key={summary.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="lg:w-48 flex-shrink-0">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={summary.thumbnail_url || `https://img.youtube.com/vi/${summary.video_id}/hqdefault.jpg`}
                          alt={summary.video_title}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <div className="text-white text-xs font-medium">
                            {summary.duration}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            summary.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : summary.status === 'processing'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {summary.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {summary.video_title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {summary.channel_name} • {Number(summary.views).toLocaleString()} views • {formatDate(summary.created_at)}
                          </p>
                        </div>
                        
                        {/* Status icon */}
                        <div className="ml-4">
                          {summary.status === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {summary.status === 'processing' && (
                            <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                          )}
                          {summary.status === 'failed' && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {summary.reduction_percentage || '0'}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Reduced</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {summary.summary_word_count || '0'} words
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Summary</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {summary.original_word_count || '0'} words
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Original</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {summary.category || 'Uncategorized'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(summary.tags) && summary.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Content Reduction</span>
                          <span>{summary.reduction_percentage || '0'}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                            style={{ width: `${summary.reduction_percentage || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/summary/${summary.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <BarChart3 className="h-4 w-4" />
                            View Summary
                          </a>
                          <button
                            onClick={() => handleCopySummary(summary.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                          <button
                            onClick={() => handleExportSummary(summary.id, 'txt')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </button>
                          <a
                            href={`https://youtube.com/watch?v=${summary.video_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Watch
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBookmark(summary.id, summary.is_bookmarked)}
                            className={`p-2 rounded-lg ${summary.is_bookmarked ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                          >
                            {summary.is_bookmarked ? '★' : '☆'}
                          </button>
                          <div className="relative">
                            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleExportSummary(summary.id, 'pdf')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Export as PDF
                                </button>
                                <button
                                  onClick={() => handleExportSummary(summary.id, 'json')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Export as JSON
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                <button
                                  onClick={() => handleDeleteSummary(summary.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  Delete Summary
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No summaries yet
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Get started by summarizing your first YouTube video. Paste a URL above and click &quot;Summarize&quot;.
                </p>
                <button
                  onClick={() => {
                    setVideoUrl('https://www.youtube.com/watch?v=kqtD5dpn9C8');
                    setTimeout(() => handleSummarize(), 100);
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold hover:from-red-700 hover:to-purple-700 transition-all"
                >
                  <Sparkles className="h-5 w-5" />
                  Try Example Video
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredSummaries.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredSummaries.length} of {summaries.length} summaries
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Pro Tips for Better Summaries
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Use educational or tutorial videos for best results
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Videos with clear speech and captions work best
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Bookmark important summaries for quick access
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Export summaries to PDF for offline reading
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;