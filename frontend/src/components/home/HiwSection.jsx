import { CheckCircle, Zap } from 'lucide-react';

export default function HiwSection() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">How It Works in</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              {/* <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 transform -translate-y-1/2" /> */}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-2xl font-bold mb-6 lg:mx-0 mx-auto">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Paste YouTube URL
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Copy any YouTube video link and paste it into our platform.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <code className="text-sm text-gray-700 dark:text-gray-300">
                      https://youtube.com/watch?v=...
                    </code>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-2xl font-bold mb-6 lg:mx-0 mx-auto">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AI Magic Happens
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our AI analyzes the video, extracts transcript, and identifies key points.
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-75" />
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                    <span className="text-sm text-gray-500 ml-2">Processing...</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl font-bold mb-6 lg:mx-0 mx-auto">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Get Your Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Receive a concise summary with key takeaways, timestamps, and more.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Key points extracted</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Timestamps included</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Discuss with AI</span>
                    </div>
                    {/* <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Chapters identified</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Sentiment analyzed</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Demo CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 dark:from-red-500/5 dark:via-purple-500/5 dark:to-blue-500/5 rounded-2xl border border-red-200 dark:border-red-800">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Try it yourself - No signup required!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Paste any YouTube URL and see the magic happen instantly.
                </p>
              </div>
              <a
                href="/demo"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold hover:from-red-700 hover:to-purple-700 transition-all whitespace-nowrap"
              >
                <Zap className="mr-2 h-4 w-4" />
                Try Live Demo
              </a>
            </div>
          </div>
        </div>
    );
}