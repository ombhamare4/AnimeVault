"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Anime } from "@/lib/types";

interface HeroSectionProps {
  animes: Anime[];
}

export function HeroSection({ animes }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const featuredAnime = animes[currentIndex];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [animes.length]);
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };
  
  if (!featuredAnime) return null;
  
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden">
      {/* Background Image with Blur */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={featuredAnime.images.jpg.large_image_url}
            alt={featuredAnime.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/50" />
          {/* Blur overlay for background */}
          <div className="absolute inset-0 backdrop-blur-[2px] md:backdrop-blur-none" />
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[85vh] md:min-h-[90vh] flex items-center">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full pt-20 md:pt-0">
          {/* Left Content */}
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {featuredAnime.genres?.slice(0, 4).map((genre) => (
                <Badge
                  key={genre.mal_id}
                  variant="outline"
                  className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
              {featuredAnime.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6 text-slate-300">
              {featuredAnime.score && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{featuredAnime.score.toFixed(1)}</span>
                </div>
              )}
              {featuredAnime.type && (
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                  {featuredAnime.type}
                </Badge>
              )}
              {featuredAnime.episodes && (
                <span>{featuredAnime.episodes} Episodes</span>
              )}
              {featuredAnime.year && (
                <span>{featuredAnime.year}</span>
              )}
            </div>
            
            {/* Synopsis */}
            <p className="text-slate-300 text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
              {featuredAnime.synopsis || "No synopsis available."}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              {featuredAnime.trailer?.youtube_id && (
                <Button
                  asChild
                  size="lg"
                  className="btn-gradient rounded-full px-8 text-white font-semibold"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${featuredAnime.trailer.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Watch Trailer
                  </a>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-purple-500/30 bg-white/5 hover:bg-white/10 text-white"
              >
                <Link href={`/anime/${featuredAnime.mal_id}`}>
                  <Info className="w-5 h-5 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right Side - Mini Carousel (Desktop only) */}
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="flex gap-4 justify-center">
                {animes.slice(0, 5).map((anime, idx) => (
                  <Link
                    key={anime.mal_id}
                    href={`/anime/${anime.mal_id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`relative w-36 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      idx === currentIndex
                        ? "ring-2 ring-purple-500 scale-110 shadow-xl shadow-purple-500/20 z-10"
                        : "opacity-60 hover:opacity-80 scale-100"
                    }`}
                  >
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {animes.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? "w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// Skeleton variant
export function HeroSectionSkeleton() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-slate-800 shimmer" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[85vh] flex items-center">
        <div className="max-w-2xl w-full">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-6 rounded-full bg-slate-700/50 shimmer" />
            ))}
          </div>
          <div className="w-3/4 h-12 rounded-lg bg-slate-700/50 shimmer mb-4" />
          <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-6 rounded bg-slate-700/50 shimmer" />
            ))}
          </div>
          <div className="space-y-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-4 rounded bg-slate-700/50 shimmer" />
            ))}
          </div>
          <div className="flex gap-4">
            <div className="w-36 h-12 rounded-full bg-slate-700/50 shimmer" />
            <div className="w-32 h-12 rounded-full bg-slate-700/50 shimmer" />
          </div>
        </div>
      </div>
    </section>
  );
}
