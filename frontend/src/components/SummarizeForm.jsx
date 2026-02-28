// src/components/SummarizeForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRightIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { summaryAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const SummarizeForm = () => {
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [summaryId, setSummaryId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to summarize videos');
      return;
    }

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await summaryAPI.create({
        videoUrl: url,
        options: {
          length: 'medium',
          includeKeyPoints: true,
          includeChapters: true
        }
      });

      if (response.success) {
        setSuccess(true);
        setSummaryId(response.data.summaryId);
        setUrl('');
        
        // If using WebSocket for real-time updates
        if (response.data.summaryId) {
          // You can set up WebSocket listener here
          console.log('Summary processing started:', response.data.summaryId);
        }
      }
    } catch (err) {
      setError(err.error || 'Failed to summarize video');
    } finally {
      setLoading(false);
    }
  };

  // Poll for completion (optional - better with WebSocket)
  const checkStatus = async (id) => {
    try {
      const response = await summaryAPI.getById(id);
      if (response.success && response.data.status === 'completed') {
        // Navigate to summary detail page
        window.location.href = `/summary/${id}`;
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-4">
        Summarize YouTube Videos
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="youtube-url" className="mb-2 block text-sm font-medium">
              YouTube URL
            </Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              disabled={loading || !isAuthenticated}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ChevronRightIcon className="h-4 w-4 mr-2" />
                  Summarize
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">
              Video queued for processing!{' '}
              <button
                onClick={() => summaryId && checkStatus(summaryId)}
                className="underline hover:no-underline"
              >
                Check status
              </button>
            </span>
          </div>
        )}

        {!isAuthenticated && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
            You need to <a href="/login" className="underline font-semibold">login</a> to summarize videos
          </div>
        )}
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Supports: Regular videos, shorts, playlists (first video)</p>
          <p className="mt-1">Processing time: 30-60 seconds depending on video length</p>
        </div>
      </form>
    </div>
  );
};

export default SummarizeForm;