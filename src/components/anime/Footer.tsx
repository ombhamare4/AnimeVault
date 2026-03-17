"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, Sparkles, Heart, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-purple-500/10 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Tv className="w-8 h-8 text-purple-500" />
              <Sparkles className="w-4 h-4 text-pink-500 -ml-2 mt-[-8px]" />
              <span className="text-xl font-bold gradient-text">AnimeVault</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Discover your next favorite anime with our premium discovery platform. 
              Explore trending, top-rated, and seasonal anime with a Netflix-like experience.
            </p>
            <div className="flex gap-4 mt-6">
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="https://instagram.com" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/#trending">Trending</FooterLink>
              <FooterLink href="/#top">Top Rated</FooterLink>
              <FooterLink href="/#seasonal">Seasonal</FooterLink>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="https://jikan.moe" external>API (Jikan)</FooterLink>
              <FooterLink href="https://myanimelist.net" external>MyAnimeList</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AnimeVault. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> using Next.js & Jikan API
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className = "text-slate-400 hover:text-purple-400 transition-colors text-sm";
  
  if (external) {
    return (
      <li>
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      </li>
    );
  }
  
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-500/20 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
    >
      {icon}
    </motion.a>
  );
}
