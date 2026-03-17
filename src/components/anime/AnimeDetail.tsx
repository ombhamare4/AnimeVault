"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Play, Users, Calendar, Clock, Tv, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Anime, AnimeCharacterStaff } from "@/lib/types";

interface AnimeDetailProps {
  anime: Anime | null;
  characters: AnimeCharacterStaff[];
  loading: boolean;
  onClose: () => void;
}

export function AnimeDetail({ anime, characters, loading, onClose }: AnimeDetailProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  if (!anime && !loading) return null;
  
  const animeId = anime?.mal_id || 'loading';
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <motion.div
          key={animeId}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden glass"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <ScrollArea className="max-h-[90vh]">
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse">
                  <div className="w-3/4 h-8 bg-slate-700/50 rounded mb-4" />
                  <div className="w-1/2 h-4 bg-slate-700/50 rounded mb-8" />
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="aspect-[3/4] bg-slate-700/50 rounded-xl" />
                    <div className="md:col-span-2 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-full h-4 bg-slate-700/50 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : anime ? (
              <>
                {/* Banner */}
                <div className="relative h-48 md:h-64">
                  <Image
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/60 to-transparent" />
                </div>
                
                <div className="relative px-6 md:px-8 pb-8 -mt-24 md:-mt-32">
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {/* Poster */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-purple-500/20"
                    >
                      <Image
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </motion.div>
                    
                    {/* Info */}
                    <div className="md:col-span-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Title */}
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                          {anime.title}
                        </h2>
                        {anime.title_english && anime.title_english !== anime.title && (
                          <p className="text-slate-400 mb-4">{anime.title_english}</p>
                        )}
                        
                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {anime.genres?.map((genre) => (
                            <Badge
                              key={genre.mal_id}
                              className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                            >
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                          {anime.score && (
                            <div className="flex items-center gap-1.5 text-yellow-400">
                              <Star className="w-5 h-5 fill-yellow-400" />
                              <span className="font-bold text-lg">{anime.score.toFixed(1)}</span>
                              <span className="text-slate-400 text-xs">({anime.scored_by?.toLocaleString()} users)</span>
                            </div>
                          )}
                          {anime.rank && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-purple-400">#</span>
                              <span className="font-semibold">{anime.rank}</span>
                              <span className="text-slate-400">ranked</span>
                            </div>
                          )}
                          {anime.popularity && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-pink-400">#</span>
                              <span className="font-semibold">{anime.popularity}</span>
                              <span className="text-slate-400">popular</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <MetaItem icon={<Tv className="w-4 h-4" />} label="Type" value={anime.type || "Unknown"} />
                          <MetaItem icon={<Clock className="w-4 h-4" />} label="Duration" value={anime.duration || "Unknown"} />
                          <MetaItem icon={<Calendar className="w-4 h-4" />} label="Status" value={anime.status || "Unknown"} />
                          <MetaItem icon={<Users className="w-4 h-4" />} label="Members" value={anime.members?.toLocaleString() || "0"} />
                        </div>
                        
                        {/* Synopsis */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                          <div className="relative">
                            <p className={`text-slate-300 leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>
                              {anime.synopsis || "No synopsis available."}
                            </p>
                            {anime.synopsis && anime.synopsis.length > 300 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(!expanded)}
                                className="mt-2 p-0 h-auto text-purple-400 hover:text-purple-300"
                              >
                                {expanded ? (
                                  <>
                                    Show less <ChevronUp className="w-4 h-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Read more <ChevronDown className="w-4 h-4 ml-1" />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Studios */}
                        {anime.studios && anime.studios.length > 0 && (
                          <div className="mb-4">
                            <span className="text-slate-400 text-sm">Studio: </span>
                            <span className="text-white font-medium">
                              {anime.studios.map((s) => s.name).join(", ")}
                            </span>
                          </div>
                        )}
                        
                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                          {anime.trailer?.youtube_id && (
                            <Button
                              onClick={() => setShowTrailer(true)}
                              className="btn-gradient rounded-full text-white"
                            >
                              <Play className="w-4 h-4 mr-2 fill-current" />
                              Watch Trailer
                            </Button>
                          )}
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-purple-500/30 hover:bg-purple-500/10"
                          >
                            <a
                              href={anime.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              MyAnimeList
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Characters */}
                  {characters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">Characters & Voice Actors</h3>
                      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                        {characters.slice(0, 8).map((char, index) => (
                          <div
                            key={`${char.character.mal_id}-${index}`}
                            className="flex-shrink-0 w-40"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                              <Image
                                src={char.character.images?.jpg?.image_url || "/placeholder.jpg"}
                                alt={char.character.name}
                                fill
                                className="object-cover"
                                sizes="160px"
                              />
                            </div>
                            <p className="text-sm font-medium text-white line-clamp-2">
                              {char.character.name}
                            </p>
                            {char.voice_actors[0] && (
                              <p className="text-xs text-slate-400 mt-1">
                                {char.voice_actors[0].person.name}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : null}
          </ScrollArea>
        </motion.div>
      </motion.div>
      
      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && anime?.trailer?.youtube_id && (
          <motion.div
            key="trailer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <span className="text-purple-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}
