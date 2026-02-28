import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { icons } from 'lucide-react';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: 'YouTube Summarizer',
  description: 'AI-powered YouTube video summarization tool',
  icons: {
    icon: '/images/logo/logo-kubela2-icon.svg',
    apple: '/images/logo/logo-kubela2-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
