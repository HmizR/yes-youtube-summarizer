"use client";

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  Download,
  Copy,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Trash2,
  Share2,
  BarChart3,
  Tag,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const VideoSummariesPage = () => {
  // Mock data for video summaries
  // const [summaries, setSummaries] = useState([
  //   {
  //     id: '1',
  //     videoId: 'dQw4w9WgXcQ',
  //     title: 'AI Explained: Transformers in 5 Minutes - Complete Guide',
  //     channel: 'Tech Insights',
  //     duration: '5:24',
  //     views: '2.3M',
  //     likes: '125K',
  //     thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  //     summaryLength: '250 words',
  //     originalLength: '3250 words',
  //     reductionPercent: 92,
  //     dateProcessed: '2024-03-10 14:30',
  //     status: 'completed',
  //     tags: ['AI', 'Machine Learning', 'NLP'],
  //     category: 'Technology'
  //   },
  //   {
  //     id: '2',
  //     videoId: 'abc123def',
  //     title: 'React 19 New Features and Updates',
  //     channel: 'React Mastery',
  //     duration: '18:42',
  //     views: '850K',
  //     likes: '45K',
  //     thumbnail: 'https://img.youtube.com/vi/abc123def/hqdefault.jpg',
  //     summaryLength: '420 words',
  //     originalLength: '5600 words',
  //     reductionPercent: 92.5,
  //     dateProcessed: '2024-03-09 11:15',
  //     status: 'completed',
  //     tags: ['React', 'JavaScript', 'Frontend'],
  //     category: 'Programming'
  //   },
  //   {
  //     id: '3',
  //     videoId: 'xyz789ghi',
  //     title: 'Python Async Complete Tutorial for Beginners',
  //     channel: 'Python Pro',
  //     duration: '25:30',
  //     views: '1.2M',
  //     likes: '68K',
  //     thumbnail: 'https://img.youtube.com/vi/xyz789ghi/hqdefault.jpg',
  //     summaryLength: '380 words',
  //     originalLength: '4800 words',
  //     reductionPercent: 92.1,
  //     dateProcessed: '2024-03-08 16:45',
  //     status: 'completed',
  //     tags: ['Python', 'Async', 'Backend'],
  //     category: 'Programming'
  //   },
  //   {
  //     id: '4',
  //     videoId: 'jkl456mno',
  //     title: 'Building a SaaS in 30 Days - Day 15 Progress',
  //     channel: 'SaaS Builders',
  //     duration: '15:18',
  //     views: '420K',
  //     likes: '32K',
  //     thumbnail: 'https://img.youtube.com/vi/jkl456mno/hqdefault.jpg',
  //     summaryLength: '310 words',
  //     originalLength: '4100 words',
  //     reductionPercent: 92.4,
  //     dateProcessed: '2024-03-07 09:20',
  //     status: 'processing',
  //     tags: ['SaaS', 'Startup', 'Business'],
  //     category: 'Business'
  //   },
  //   {
  //     id: '5',
  //     videoId: 'pqr123stu',
  //     title: 'Tailwind CSS v4: What\'s New and Exciting',
  //     channel: 'CSS Wizards',
  //     duration: '12:45',
  //     views: '750K',
  //     likes: '38K',
  //     thumbnail: 'https://img.youtube.com/vi/pqr123stu/hqdefault.jpg',
  //     summaryLength: '290 words',
  //     originalLength: '3800 words',
  //     reductionPercent: 92.4,
  //     dateProcessed: '2024-03-06 13:10',
  //     status: 'completed',
  //     tags: ['CSS', 'Tailwind', 'Design'],
  //     category: 'Design'
  //   },
  //   {
  //     id: '6',
  //     videoId: 'vwx456yza',
  //     title: 'Docker & Kubernetes for Microservices',
  //     channel: 'DevOps Daily',
  //     duration: '32:15',
  //     views: '950K',
  //     likes: '52K',
  //     thumbnail: 'https://img.youtube.com/vi/vwx456yza/hqdefault.jpg',
  //     summaryLength: '510 words',
  //     originalLength: '6800 words',
  //     reductionPercent: 92.5,
  //     dateProcessed: '2024-03-05 17:30',
  //     status: 'completed',
  //     tags: ['Docker', 'Kubernetes', 'DevOps'],
  //     category: 'DevOps'
  //   },
  //   {
  //     id: '7',
  //     videoId: 'bcd789efg',
  //     title: 'Next.js 14 App Router Deep Dive',
  //     channel: 'NextJS Academy',
  //     duration: '28:40',
  //     views: '1.1M',
  //     likes: '61K',
  //     thumbnail: 'https://img.youtube.com/vi/bcd789efg/hqdefault.jpg',
  //     summaryLength: '470 words',
  //     originalLength: '6200 words',
  //     reductionPercent: 92.4,
  //     dateProcessed: '2024-03-04 10:45',
  //     status: 'completed',
  //     tags: ['Next.js', 'React', 'Fullstack'],
  //     category: 'Programming'
  //   },
  //   {
  //     id: '8',
  //     videoId: 'hij012klm',
  //     title: 'Machine Learning Math Fundamentals',
  //     channel: 'ML Mathematics',
  //     duration: '42:20',
  //     views: '680K',
  //     likes: '41K',
  //     thumbnail: 'https://img.youtube.com/vi/hij012klm/hqdefault.jpg',
  //     summaryLength: '620 words',
  //     originalLength: '8200 words',
  //     reductionPercent: 92.4,
  //     dateProcessed: '2024-03-03 15:20',
  //     status: 'failed',
  //     tags: ['Math', 'ML', 'Data Science'],
  //     category: 'Education'
  //   }
  // ]);
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [stats, setStats] = useState({
    totalSummaries: 0,
    avgReduction: 0,
    processing: 0
  });
  const [loading, setLoading] = useState(true);


  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories and statuses for filters
  const categories = ['all', 'Technology', 'Programming', 'Business', 'Design', 'DevOps', 'Education'];
  const statuses = ['all', 'completed', 'processing', 'failed'];
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  // Get auth token from local storage
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

  useEffect(() => {
    document.title = 'Summaries - YouTube Summarizer';

    const fetchSummaries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/summaries?limit=50`, {
          method: 'GET',
          headers: getAuthHeaders()
        });

        const result = await response.json();

        if (result.success) {
          setSummaries(result.data);
          setStats(result.stats);
        }
      } catch (error) {
        console.error('Failed to fetch summaries', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  // Filter summaries based on search and filters
  const normalizedSummaries = summaries.map(s => ({
    id: s.id,
    videoId: s.video_id,
    title: s.video_title,
    channel: s.channel_name,
    duration: s.duration,
    views: s.views,
    likes: s.likes,
    thumbnail: s.thumbnail_url,
    summaryLength: `${s.summary_word_count} words`,
    originalLength: `${s.original_word_count} words`,
    reductionPercent: Math.round(s.reduction_percentage),
    dateProcessed: new Date(s.created_at).toLocaleString(),
    status: s.status,
    tags: s.tags || [],
    category: s.category
  }));

  const filteredSummaries = normalizedSummaries.filter(summary => {
    // Search query filter
    const matchesSearch = 
      searchQuery === '' ||
      summary.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.channel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.tags.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
      summary.category === selectedCategory;
    
    // Status filter
    const matchesStatus = 
      selectedStatus === 'all' || 
      summary.status === selectedStatus;
    
    // Date range filter (simplified)
    const matchesDate = true; // Implement date filtering logic as needed
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSummaries = filteredSummaries.slice(startIndex, endIndex);

  // Action handlers
  const handleViewSummary = (id) => {
    // Navigate to summary detail page
    router.push(`/summary/${id}`);
    // console.log(`View summary ${id}`);
  };

  const handleCopySummary = (id) => {
    // Copy summary to clipboard
    console.log(`Copy summary ${id}`);
  };

  const handleExportSummary = (id, format) => {
    // Export summary
    console.log(`Export summary ${id} as ${format}`);
  };

  const handleDeleteSummary = (id) => {
    // Delete summary
    setSummaries(prev => prev.filter(summary => summary.id !== id));
  };

  const handleShareSummary = (id) => {
    // Share summary
    console.log(`Share summary ${id}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setDateRange('all');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Video Summaries
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Browse and manage all your summarized videos
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Summaries</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">{stats.totalSummaries}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Reduction</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">{stats.avgReduction}%</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Processing</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {stats.processing}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <Loader2 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">4.2h</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search summaries by title, channel, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                <Filter className="h-5 w-5" />
                Filters
                {showFilters ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Reset Filters */}
              {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {dateRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredSummaries.length)} of {filteredSummaries.length} summaries
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            
            {/* Sort Options */}
            <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration">Duration (Long to Short)</option>
              <option value="reduction">Reduction % (High to Low)</option>
            </select>
          </div>

          {/* Summaries Table/Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Video
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Duration
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Summary Stats
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date Processed
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentSummaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      {/* Video Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={summary.thumbnail || `https://img.youtube.com/vi/${summary.videoId}/hqdefault.jpg`}
                              alt={summary.title}
                              className="h-16 w-28 rounded object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {summary.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {summary.channel}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {summary.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                >
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                              {summary.tags.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{summary.tags.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Duration & Stats */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {summary.duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            {Number(summary.views).toLocaleString()} views
                          </div>
                        </div>
                      </td>

                      {/* Summary Stats */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">{summary.summaryLength}</span>
                            <span className="text-gray-500"> / {summary.originalLength}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${summary.reductionPercent}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {summary.reductionPercent}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {summary.status === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {summary.status === 'processing' && (
                            <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                          )}
                          {summary.status === 'failed' && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className={`text-sm font-medium capitalize ${
                            summary.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                            summary.status === 'processing' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {summary.status}
                          </span>
                        </div>
                      </td>

                      {/* Date Processed */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {summary.dateProcessed}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewSummary(summary.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="View Summary"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleCopySummary(summary.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Copy Summary"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          {/* More Actions Dropdown */}
                          <div className="relative group">
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleExportSummary(summary.id, 'pdf')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 dark:text-white"
                                >
                                  <Download className="h-4 w-4" />
                                  Export as PDF
                                </button>
                                <button
                                  onClick={() => handleShareSummary(summary.id)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 dark:text-white"
                                >
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                <button
                                  onClick={() => handleDeleteSummary(summary.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentSummaries.map((summary) => (
                  <div key={summary.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={summary.thumbnail}
                          alt={summary.title}
                          className="h-20 w-32 rounded object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                              {summary.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {summary.channel}
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center gap-1 ml-2">
                            {summary.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {summary.status === 'processing' && (
                              <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                            )}
                            {summary.status === 'failed' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-sm">
                            <div className="text-gray-500">Duration</div>
                            <div className="font-medium">{summary.duration}</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">Reduction</div>
                            <div className="font-medium text-green-600 dark:text-green-400">
                              {summary.reductionPercent}%
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>{summary.summaryLength}</span>
                            <span>{summary.originalLength}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${summary.reductionPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewSummary(summary.id)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              title="View"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCopySummary(summary.id)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="Copy"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {summary.dateProcessed.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* No Results */}
            {currentSummaries.length === 0 && (
              <div className="py-16 text-center">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No summaries found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try different search terms' : 'No videos have been summarized yet'}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredSummaries.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg border ${
                          currentPage === pageNum
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    // In a real app, you'd update itemsPerPage state
                    console.log(`Changed items per page to ${e.target.value}`);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoSummariesPage;