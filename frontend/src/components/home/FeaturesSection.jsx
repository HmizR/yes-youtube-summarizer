import { Zap, BarChart3, Clock, Shield, BubblesIcon, Globe } from 'lucide-react';

export default function FeaturesSection() {
    // Features data
    const features = [
    {
        icon: <Zap className="h-8 w-8" />,
        title: "Lightning Fast",
        description: "Get summaries in seconds, not hours. Process videos up to 10x faster than watching.",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10"
    },
    {
        icon: <BarChart3 className="h-8 w-8" />,
        title: "Smart Analysis",
        description: "AI extracts key points and summarizes the content automatically.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        icon: <Clock className="h-8 w-8" />,
        title: "Time Saver",
        description: "Save 90% of your viewing time. Convert hours of content into minutes of reading.",
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        icon: <Shield className="h-8 w-8" />,
        title: "Privacy First",
        description: "Your data stays private. No tracking, no ads, completely confidential.",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
    {
        icon: <BubblesIcon className="h-8 w-8" />,
        title: "AI Chat",
        description: "Ask questions about the video content and get AI-powered answers.",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10"
    },
    {
        icon: <Globe className="h-8 w-8" />,
        title: "Global Access",
        description: "Access summaries from anywhere in the world. No geographical restrictions.",
        color: "text-teal-500",
        bgColor: "bg-teal-500/10"
    }
    // {
    //   icon: <Download className="h-8 w-8" />,
    //   title: "Export Anywhere",
    //   description: "Export summaries as PDF, Markdown, Text, or integrate with your favorite tools.",
    //   color: "text-red-500",
    //   bgColor: "bg-red-500/10"
    // },
    // {
    //   icon: <Users className="h-8 w-8" />,
    //   title: "Team Ready",
    //   description: "Collaborate with your team. Share summaries and build knowledge bases together.",
    //   color: "text-indigo-500",
    //   bgColor: "bg-indigo-500/10"
    // }
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Everything You Need to</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Learn Faster & Save Time
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powered by advanced AI, our platform extracts the essence of any YouTube video in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
    );
}