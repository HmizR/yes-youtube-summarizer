"use client";

import { useState, useEffect } from 'react';
import {
  Play,
  Zap,
  Clock,
  BarChart3,
  Shield,
  Users,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Star,
  ThumbsUp,
  ArrowRight,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const router = useRouter();

  // Demo video URL for the hero section
  const demoVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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
      description: "AI extracts key points, chapters, and sentiment analysis automatically.",
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
      icon: <Download className="h-8 w-8" />,
      title: "Export Anywhere",
      description: "Export summaries as PDF, Markdown, Text, or integrate with your favorite tools.",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Ready",
      description: "Collaborate with your team. Share summaries and build knowledge bases together.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Scientist",
      company: "TechCorp AI",
      content: "This tool has transformed how I consume educational content. I save 10+ hours weekly!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Manager",
      company: "StartupXYZ",
      content: "Our engineering team uses this daily for staying updated with tech talks. Game changer!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Product Manager",
      company: "GrowthLabs",
      content: "From 2-hour meetings to 5-minute summaries. Our productivity has skyrocketed.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 5
    }
  ];

  // Pricing plans
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "50 summaries per month",
        "Basic AI summarization",
        "Text export only",
        "Community support",
        "Up to 30 min videos"
      ],
      cta: "Get Started Free",
      popular: false,
      highlight: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "500 summaries per month",
        "Advanced AI (GPT-4 & Ollama)",
        "All export formats",
        "Priority support",
        "Up to 4 hour videos",
        "Batch processing (5 videos)",
        "Advanced analytics"
      ],
      cta: "Start Free Trial",
      popular: true,
      highlight: true
    },
    {
      name: "Business",
      price: "$29",
      period: "per month",
      features: [
        "5000 summaries per month",
        "Team collaboration",
        "Custom AI models",
        "API access",
        "Dedicated support",
        "No video length limit",
        "Batch processing (unlimited)",
        "Custom branding"
      ],
      cta: "Contact Sales",
      popular: false,
      highlight: false
    }
  ];

  // Stats counter animation
  const [stats, setStats] = useState({
    summaries: 0,
    hoursSaved: 0,
    users: 0,
    accuracy: 0
  });

  const handleSubmit = async () => {
    try {
      // API call to login
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "demo.acc@kubela.id",
          password: "admin1234"
        }),
        credentials: 'include' // For cookies if using JWT in cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Store user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      // setError(err.message || 'Invalid email or password');
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    // handleSubmit();
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const counters = {
      summaries: { target: 100, current: 0 },
      hoursSaved: { target: 5, current: 0 },
      users: { target: 5, current: 0 },
      accuracy: { target: 98, current: 0 }
    };

    const timer = setInterval(() => {
      let completed = true;

      Object.keys(counters).forEach(key => {
        const counter = counters[key];
        const increment = counter.target / steps;
        counter.current = Math.min(counter.current + increment, counter.target);

        if (counter.current < counter.target) completed = false;
      });

      setStats({
        summaries: Math.floor(counters.summaries.current),
        hoursSaved: Math.floor(counters.hoursSaved.current),
        users: Math.floor(counters.users.current),
        accuracy: counters.accuracy.current.toFixed(1)
      });

      if (completed) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscriptionStatus('success');
    setEmail('');
    setIsSubmitting(false);

    // Reset status after 5 seconds
    setTimeout(() => setSubscriptionStatus(''), 5000);
  };

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                {/* <div className="p-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg">
                  <Play className="h-6 w-6 text-white" />
                </div> */}
                {/* <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  Summarize<span className="text-gray-900 dark:text-white">Tube</span>
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                Testimonials
              </a>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Login */}
              <a
                href="/login"
                className="hidden md:inline-block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Sign In
              </a>

              {/* Get Started */}
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold text-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <Play className="mr-3 h-5 w-5 text-blue-600" />
                  Watch Demo (1:30)
                </a>
              </div>

              {/* Demo Video Preview */}
              <div className="max-w-4xl mx-auto mb-16">
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
              </div>

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
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
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
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
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
                    Receive a concise summary with key takeaways, chapters, and analysis.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Key points extracted</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Chapters identified</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Sentiment analyzed</span>
                    </div>
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
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Loved by</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Thousands of Users
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join students, researchers, and professionals who save hours every week.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:shadow-xl"
              >
                {/* Stars */}
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company logos */}
          <div className="mt-20">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Google</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Microsoft</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Stanford</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">MIT</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">GitHub</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Simple, Transparent</span>
              <span className="block bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'border-red-500 bg-gradient-to-b from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 shadow-2xl'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-purple-600 text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.name === 'Business' ? '/contact' : '/register'}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Free trial notice */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Need a custom plan?{' '}
              <a href="/contact" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 via-purple-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Start Saving Time Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who have already saved over 50,000 hours
              of video watching time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-red-600 font-bold text-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-2xl"
              >
                <Zap className="mr-3 h-5 w-5" />
                Get Started Free
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </a>
            </div>

            {/* Newsletter signup */}
            <div className="mt-16 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">
                  Stay Updated
                </h3>
                <p className="text-white/80 mb-6">
                  Get tips, updates, and exclusive content about AI summarization.
                </p>
                
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  
                  {subscriptionStatus === 'success' && (
                    <div className="text-green-300 text-sm">
                      Thanks for subscribing! Check your email for confirmation.
                    </div>
                  )}
                  
                  <p className="text-white/60 text-sm">
                    No spam, unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
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
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
                <li><a href="/changelog" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/tutorials" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/gdpr" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} YES. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="https://twitter.com" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;