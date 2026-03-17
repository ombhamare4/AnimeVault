"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X, Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AnimeSearchResult, JikanMultipleResponse } from "@/lib/types";

interface SearchResultsProps {
  query: string;
  data: JikanMultipleResponse<AnimeSearchResult> | null;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

export function SearchResults({ query, data, loading, onQueryChange, onClose }: SearchResultsProps) {
  // Prevent background scroll when search is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0F172A]/98 backdrop-blur-lg"
    >
      <div className="flex flex-col h-full pt-20">
        {/* Search Header - Fixed */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for anime..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="h-14 pl-12 pr-4 text-lg bg-white/5 border-purple-500/20 focus:border-purple-500/50 rounded-2xl"
                autoFocus
              />
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Results - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {query.trim() === "" ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Start typing to search for anime</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800/50 shimmer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
                  </div>
                ))}
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <>
                <p className="text-slate-400 mb-4">
                  Found {data.pagination?.items?.total || data.data.length} results for &quot;{query}&quot;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {data.data.map((anime, index) => (
                    <motion.div
                      key={anime.mal_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="group relative"
                    >
                      <Link 
                        href={`/anime/${anime.mal_id}`}
                        onClick={onClose}
                        className="block cursor-pointer"
                      >
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800/50 anime-card-hover cursor-pointer">
                          {/* Poster Image */}
                          <img
                            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                          
                          {/* Rating Badge */}
                          {anime.score && anime.score > 0 && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-semibold text-white">{anime.score.toFixed(1)}</span>
                            </div>
                          )}
                          
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
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No results found for &quot;{query}&quot;</p>
                <p className="text-slate-500 mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state animation
export function SearchEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Search className="w-20 h-20 text-slate-600" />
      </motion.div>
      <p className="text-slate-400 mt-6 text-lg">No anime found</p>
    </motion.div>
  );
}
