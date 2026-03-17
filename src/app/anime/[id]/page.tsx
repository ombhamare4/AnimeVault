"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Play, Users, Calendar, Clock, Tv, ExternalLink, ChevronDown, ChevronUp, Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimeById, useAnimeCharacters } from "@/hooks/useAnime";
import type { Anime, AnimeCharacterStaff } from "@/lib/types";

interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const [animeId, setAnimeId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setAnimeId(parseInt(p.id, 10));
    });
  }, [params]);

  const { data: animeDetail, loading: detailLoading } = useAnimeById(animeId || 0);
  const { data: charactersData, loading: charactersLoading } = useAnimeCharacters(animeId || 0);
  
  const anime = animeDetail?.data;
  const characters = charactersData?.data || [];
  const loading = detailLoading || charactersLoading;

  if (loading || !anime) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#020617]">
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Skeleton className="w-24 h-10 mb-6 rounded-full" />
          <div className="animate-pulse">
            <div className="w-3/4 h-10 bg-slate-700/50 rounded mb-4" />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#020617]">
      {/* Banner */}
      <div className="relative h-64 md:h-96">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-20 left-4 sm:left-6 lg:left-8 z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-48 md:-mt-64">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-purple-500/20 anime-card-hover">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                {anime.trailer?.youtube_id && (
                  <Button
                    onClick={() => setShowTrailer(true)}
                    className="w-full btn-gradient rounded-full text-white font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Watch Trailer
                  </Button>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="rounded-full border-purple-500/30 hover:bg-purple-500/10">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full border-purple-500/30 hover:bg-purple-500/10">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full border-purple-500/30 hover:bg-purple-500/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="md:col-span-2 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-slate-400 text-lg mb-4">{anime.title_english}</p>
              )}
              {anime.title_japanese && (
                <p className="text-slate-500 text-sm mb-4">{anime.title_japanese}</p>
              )}

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres?.map((genre) => (
                  <Badge
                    key={genre.mal_id}
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 text-sm px-3 py-1"
                  >
                    {genre.name}
                  </Badge>
                ))}
                {anime.themes?.map((theme) => (
                  <Badge
                    key={theme.mal_id}
                    className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-sm px-3 py-1"
                  >
                    {theme.name}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                {anime.score && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{anime.score.toFixed(1)}</p>
                      <p className="text-xs text-slate-400">{anime.scored_by?.toLocaleString()} users</p>
                    </div>
                  </div>
                )}
                {anime.rank && (
                  <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl">
                    <span className="text-purple-400 text-2xl font-bold">#{anime.rank}</span>
                    <p className="text-xs text-slate-400">Ranked</p>
                  </div>
                )}
                {anime.popularity && (
                  <div className="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-xl">
                    <span className="text-pink-400 text-2xl font-bold">#{anime.popularity}</span>
                    <p className="text-xs text-slate-400">Popularity</p>
                  </div>
                )}
                {anime.members && (
                  <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold">{anime.members.toLocaleString()}</span>
                    <p className="text-xs text-slate-400">Members</p>
                  </div>
                )}
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 rounded-xl bg-slate-800/30 border border-purple-500/10">
                <MetaItem icon={<Tv className="w-5 h-5" />} label="Type" value={anime.type || "Unknown"} />
                <MetaItem icon={<Clock className="w-5 h-5" />} label="Duration" value={anime.duration || "Unknown"} />
                <MetaItem icon={<Calendar className="w-5 h-5" />} label="Status" value={anime.status || "Unknown"} />
                <MetaItem icon={<Star className="w-5 h-5" />} label="Rating" value={anime.rating || "Unknown"} />
                <MetaItem icon={<Calendar className="w-5 h-5" />} label="Premiered" value={anime.season && anime.year ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : "Unknown"} />
                <MetaItem icon={<Tv className="w-5 h-5" />} label="Episodes" value={anime.episodes?.toString() || "Unknown"} />
                <MetaItem icon={<Tv className="w-5 h-5" />} label="Source" value={anime.source || "Unknown"} />
                {anime.aired?.string && <MetaItem icon={<Calendar className="w-5 h-5" />} label="Aired" value={anime.aired.string} />}
              </div>

              {/* Studios & Producers */}
              {anime.studios && anime.studios.length > 0 && (
                <div className="mb-6">
                  <span className="text-slate-400 text-sm">Studio: </span>
                  <span className="text-white font-medium">
                    {anime.studios.map((s) => s.name).join(", ")}
                  </span>
                </div>
              )}

              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-3">Synopsis</h2>
                <div className="relative">
                  <p className={`text-slate-300 leading-relaxed text-base ${expanded ? "" : "line-clamp-5"}`}>
                    {anime.synopsis || "No synopsis available."}
                  </p>
                  {anime.synopsis && anime.synopsis.length > 300 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(!expanded)}
                      className="mt-3 p-0 h-auto text-purple-400 hover:text-purple-300"
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

              {/* Background */}
              {anime.background && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">Background</h2>
                  <p className="text-slate-300 leading-relaxed text-base">{anime.background}</p>
                </div>
              )}

              {/* External Link */}
              <Button
                asChild
                variant="outline"
                className="rounded-full border-purple-500/30 hover:bg-purple-500/10 mb-8"
              >
                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on MyAnimeList
                </a>
              </Button>

              {/* Characters */}
              {characters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4">Characters & Voice Actors</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {characters.slice(0, 8).map((char, index) => (
                      <CharacterCard key={`${char.character.mal_id}-${index}`} char={char} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && anime.trailer?.youtube_id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setShowTrailer(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl aspect-video mx-4"
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
              <span className="text-xl">×</span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
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

function CharacterCard({ char }: { char: AnimeCharacterStaff }) {
  return (
    <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 transition-colors">
      <div className="relative aspect-square">
        <Image
          src={char.character.images?.jpg?.image_url || "/placeholder.jpg"}
          alt={char.character.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-white line-clamp-2">
          {char.character.name}
        </p>
        {char.voice_actors[0] && (
          <Link 
            href={`/character/${char.voice_actors[0].person.mal_id}`}
            className="text-xs text-purple-400 hover:text-purple-300 mt-1 line-clamp-1 cursor-pointer hover:underline block"
          >
            VA: {char.voice_actors[0].person.name}
          </Link>
        )}
      </div>
    </div>
  );
}
