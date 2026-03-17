"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import type { Anime, AnimeSearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime | AnimeSearchResult;
  index?: number;
  showRank?: boolean;
  rank?: number;
}

export function AnimeCard({ anime, index = 0, showRank = false, rank }: AnimeCardProps) {
  const score = anime.score ?? 0;
  const displayRank = rank ?? anime.rank ?? index + 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link 
        href={`/anime/${anime.mal_id}`} 
        className="block cursor-pointer"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800/50 anime-card-hover cursor-pointer">
          {/* Poster Image */}
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          {score > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{score.toFixed(1)}</span>
            </div>
          )}
          
          {/* Rank Badge */}
          {showRank && (
            <div className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <span className="text-sm font-bold text-white">{displayRank}</span>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
            >
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </motion.div>
          </div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1 tracking-wide">
              {anime.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              {anime.type && (
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {anime.type}
                </span>
              )}
              {anime.episodes && (
                <span>{anime.episodes} eps</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton variant
export function AnimeCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800/50 shimmer">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
    </div>
  );
}

// Featured card for hero section
interface FeaturedCardProps {
  anime: Anime;
  isActive?: boolean;
}

export function FeaturedCard({ anime, isActive = false }: FeaturedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
        isActive ? "ring-2 ring-purple-500/50" : ""
      )}
    >
      <Image
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        fill
        sizes="200px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-semibold text-sm line-clamp-2">{anime.title}</h4>
      </div>
    </motion.div>
  );
}
