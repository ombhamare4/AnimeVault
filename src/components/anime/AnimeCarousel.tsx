"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";
import type { Anime } from "@/lib/types";

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
  loading?: boolean;
  showRank?: boolean;
}

export function AnimeCarousel({ title, animes, loading = false, showRank = false }: AnimeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  
  return (
    <section className="relative py-8">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-white section-title-underline"
        >
          {title}
        </motion.h2>
        
        {/* Navigation Buttons */}
        <div className="hidden sm:flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white border border-purple-500/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white border border-purple-500/20"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Carousel Container */}
      <div className="relative">
        {/* Left Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
        
        {/* Right Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />
        
        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Padding for alignment */}
          <div className="w-0 md:w-[calc((100vw-1280px)/2)]" />
          
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 md:w-48">
                  <AnimeCardSkeleton />
                </div>
              ))
            : animes.map((anime, index) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="flex-shrink-0 w-40 md:w-48"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <AnimeCard 
                    anime={anime} 
                    index={index} 
                    showRank={showRank} 
                    rank={index + 1}
                  />
                </motion.div>
              ))}
          
          {/* Padding for alignment */}
          <div className="w-4 md:w-[calc((100vw-1280px)/2)]" />
        </div>
      </div>
    </section>
  );
}

// Vertical grid variant
interface AnimeGridProps {
  title: string;
  animes: Anime[];
  loading?: boolean;
  showRank?: boolean;
}

export function AnimeGrid({ title, animes, loading = false, showRank = false }: AnimeGridProps) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-white section-title-underline mb-6"
      >
        {title}
      </motion.h2>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))
          : animes.map((anime, index) => (
              <AnimeCard 
                key={anime.mal_id} 
                anime={anime} 
                index={index} 
                showRank={showRank} 
                rank={index + 1}
              />
            ))}
      </div>
    </section>
  );
}
