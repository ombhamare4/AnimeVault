"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navbar,
  HeroSection,
  HeroSectionSkeleton,
  AnimeCarousel,
  AnimeGrid,
  SearchResults,
  Footer,
} from "@/components/anime";
import { useTopAnime, useTrendingAnime, useSeasonalAnime, useSearchAnime } from "@/hooks/useAnime";
import type { Anime } from "@/lib/types";

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch data
  const { data: topAnimeData, loading: topLoading } = useTopAnime();
  const { data: trendingData, loading: trendingLoading } = useTrendingAnime(15);
  const { data: seasonalData, loading: seasonalLoading } = useSeasonalAnime();
  const { data: searchData, loading: searchLoading } = useSearchAnime(searchQuery);
  
  // Get featured anime for hero (top 5 from trending)
  const featuredAnime: Anime[] = trendingData?.data?.slice(0, 5) || [];
  const trendingAnime: Anime[] = trendingData?.data || [];
  const topAnime: Anime[] = topAnimeData?.data || [];
  const seasonalAnime: Anime[] = seasonalData?.data || [];
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSearchOpen(true);
  }, []);
  
  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        {trendingLoading ? (
          <HeroSectionSkeleton />
        ) : featuredAnime.length > 0 ? (
          <HeroSection animes={featuredAnime} />
        ) : null}
        
        {/* Trending Section */}
        <section id="trending" className="scroll-mt-20">
          <AnimeCarousel
            title="🔥 Trending Now"
            animes={trendingAnime}
            loading={trendingLoading}
          />
        </section>
        
        {/* Top Anime Section */}
        <section id="top" className="scroll-mt-20">
          <AnimeGrid
            title="⭐ Top Rated Anime"
            animes={topAnime.slice(0, 12)}
            loading={topLoading}
            showRank
          />
        </section>
        
        {/* Seasonal Anime Section */}
        <section id="seasonal" className="scroll-mt-20">
          <AnimeCarousel
            title="🌸 This Season"
            animes={seasonalAnime}
            loading={seasonalLoading}
          />
        </section>
        
        {/* Extra Section - Top Anime Extended */}
        {topAnime.length > 12 && (
          <AnimeCarousel
            title="🏆 More Top Anime"
            animes={topAnime.slice(12)}
            loading={topLoading}
            showRank
          />
        )}
        
        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20" />
            <div className="absolute inset-0 glass" />
            
            <div className="relative px-8 py-12 md:py-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Ready to Explore?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-lg max-w-2xl mx-auto mb-8"
              >
                Search from thousands of anime titles to find your next favorite series.
                Discover hidden gems, classic masterpieces, and the latest releases.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="btn-gradient px-8 py-3 rounded-full text-white font-semibold"
              >
                Start Searching
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchResults
            query={searchQuery}
            data={searchData}
            loading={searchLoading}
            onQueryChange={setSearchQuery}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
