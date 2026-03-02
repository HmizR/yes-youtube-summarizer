"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FooterSection from '@/components/home/FooterSection';
import HiwSection from '@/components/home/HiwSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HeroSection from '@/components/home/HeroSection';
import NavBarSection from '@/components/home/NavBarSection';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Stats counter animation
  const [stats, setStats] = useState({
    summaries: 0,
    hoursSaved: 0,
    users: 0,
    accuracy: 0
  });

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
        <NavBarSection isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroSection stats={stats} />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <HiwSection />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <FooterSection />
      </footer>
    </div>
  );
};

export default LandingPage;