import { Github, Linkedin } from 'lucide-react';
import Image from "next/image";

export default function FooterSection() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* <div className="p-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Summarize<span className="text-red-500">Tube</span>
                </span> */}
                <>
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
                    width={150}
                    height={40}
                  />
                </>
              </div>
              <p className="text-gray-400">
                AI-powered YouTube summaries that save you time and boost productivity.
              </p>
            </div>

            {/* Product */}
            {/* <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
                <li><a href="/changelog" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div> */}

            {/* Resources */}
            {/* <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/tutorials" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div> */}

            {/* Legal */}
            {/* <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/gdpr" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div> */}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} YES. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* <a href="https://twitter.com" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a> */}
              <a href="https://github.com/HmizR" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/hamizan-rifqi-afandi/" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              {/* <a href="https://youtube.com" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a> */}
            </div>
          </div>
        </div>
    );
}