// app/(auth)/layout.jsx
import { Sparkles } from 'lucide-react';
import Image from "next/image";

export const metadata = {
  title: 'Authentication - SummarizeTube',
  description: 'Sign in or create an account for SummarizeTube',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex items-center justify-center space-x-2 mb-8">
              {/* <div className="p-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                SummarizeTube
              </span> */}
              <Image
                className="dark:hidden"
                src="/images/logo/logo-kubela2.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-kubela2-dark.svg"
                alt="Logo"
                width={200}
                height={40}
              />
            </div>
            {children}
          </div>
        </div>

        {/* Right side - Preview/Info */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-gradient-to-br from-red-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-l border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto">
            <div className="space-y-8">
              {/* Testimonial */}
              {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "This tool has saved me hundreds of hours. As a researcher, I can now consume educational content 10x faster."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    SC
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Research Scientist</p>
                  </div>
                </div>
              </div> */}

              {/* Features list */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What you&apos;ll get with a free account:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">50 free summaries per month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">AI-powered video analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Ask questions and chat with AI </span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Export as text & markdown</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">No credit card required</span>
                  </li>
                </ul>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">12K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Time Saved</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}