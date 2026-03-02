import { Sparkles, Zap, ArrowRight } from 'lucide-react';

export default function HeroSection({ stats }) {
    return (
        <>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 dark:from-red-500/5 dark:via-purple-500/5 dark:to-blue-500/5" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200 dark:border-blue-800 mb-6">
                    <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI-Powered YouTube Summaries
                    </span>
                </div>

                {/* Main headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                    <span className="block text-gray-900 dark:text-white">
                    Turn Hours of
                    </span>
                    <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    YouTube into Minutes
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                    AI-powered summaries that capture key insights, save time, and boost productivity.
                    Perfect for students, researchers, and professionals.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <a
                    href="/register"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-3xl"
                    >
                    <Zap className="mr-3 h-5 w-5" />
                    Start Summarizing Free
                    <ArrowRight className="ml-3 h-5 w-5" />
                    </a>
                    {/* <a
                    href="#demo"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold text-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                    >
                    <Play className="mr-3 h-5 w-5 text-blue-600" />
                    Watch Demo (1:30)
                    </a> */}
                </div>

                {/* Demo Video Preview */}
                {/* <div className="max-w-4xl mx-auto mb-16">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                        <div className="text-center">
                        <div className="mb-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer transform hover:scale-110">
                            <Play className="h-10 w-10 text-white ml-1" />
                            </div>
                        </div>
                        <p className="text-white text-lg font-medium">See how it works in 90 seconds</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-white">
                        <h3 className="text-xl font-bold mb-1">How YES Works</h3>
                        <p className="text-gray-300">Paste URL → AI analyzes → Get summary</p>
                        </div>
                    </div>
                    </div>
                </div> */}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stats.summaries.toLocaleString()}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-2">Videos Summarized</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stats.hoursSaved.toLocaleString()}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-2">Hours Saved</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stats.users.toLocaleString()}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-2">Happy Users</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stats.accuracy}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-2">Accuracy Rate</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
    );
}