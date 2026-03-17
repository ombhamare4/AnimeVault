"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Calendar, Users, Globe, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonFull } from "@/hooks/useAnime";
import type { Person, PersonAnime, PersonManga, PersonVoiceActing } from "@/lib/types";

interface CharacterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const [personId, setPersonId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setPersonId(parseInt(p.id, 10));
    });
  }, [params]);

  const { data: personDetail, loading } = usePersonFull(personId || 0);
  
  const person = personDetail?.data;

  if (loading || !person) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#020617]">
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Skeleton className="w-24 h-10 mb-6 rounded-full" />
          <div className="animate-pulse">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-square bg-slate-700/50 rounded-xl" />
              <div className="md:col-span-2 space-y-4">
                <div className="w-2/3 h-10 bg-slate-700/50 rounded" />
                <div className="w-1/2 h-4 bg-slate-700/50 rounded" />
                <div className="w-full h-4 bg-slate-700/50 rounded" />
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
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
        
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
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-32">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-purple-500/20 anime-card-hover">
                <Image
                  src={person.images.jpg.large_image_url || person.images.jpg.image_url}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              
              {/* Favorites */}
              <div className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/30 border border-purple-500/10">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                <span className="text-white font-semibold">{person.favorites?.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">Favorites</span>
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
              {/* Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                {person.name}
              </h1>
              
              {/* Given & Family Name */}
              {(person.given_name || person.family_name) && (
                <p className="text-slate-400 text-lg mb-4">
                  {[person.given_name, person.family_name].filter(Boolean).join(" ")}
                </p>
              )}

              {/* Alternate Names */}
              {person.alternate_names && person.alternate_names.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {person.alternate_names.slice(0, 5).map((name, idx) => (
                    <Badge
                      key={idx}
                      className="bg-slate-700/50 text-slate-300 border-slate-600/30"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-slate-800/30 border border-purple-500/10">
                {person.birthday && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-500">Birthday</p>
                      <p className="font-medium text-sm">{new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                )}
                {person.website_url && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-slate-500">Website</p>
                      <a href={person.website_url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-blue-400 hover:underline">
                        Visit
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* About */}
              {person.about && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">About</h2>
                  <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
                    {person.about}
                  </p>
                </div>
              )}

              {/* External Link */}
              <Button
                asChild
                variant="outline"
                className="rounded-full border-purple-500/30 hover:bg-purple-500/10 mb-8"
              >
                <a
                  href={person.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on MyAnimeList
                </a>
              </Button>

              {/* Voice Acting Roles */}
              {person.voices && person.voices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Voice Acting Roles
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {person.voices.length}
                    </Badge>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {person.voices.slice(0, 12).map((voice, index) => (
                      <VoiceRoleCard key={`${voice.anime.mal_id}-${voice.character.mal_id}-${index}`} voice={voice} />
                    ))}
                  </div>
                  {person.voices.length > 12 && (
                    <p className="text-slate-400 text-sm mt-4">
                      And {person.voices.length - 12} more roles...
                    </p>
                  )}
                </motion.div>
              )}

              {/* Anime Staff Positions */}
              {person.anime && person.anime.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Anime Staff Positions
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      {person.anime.length}
                    </Badge>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {person.anime.slice(0, 8).map((anime, index) => (
                      <StaffAnimeCard key={`${anime.anime.mal_id}-${index}`} anime={anime} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Published Manga */}
              {person.manga && person.manga.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Published Manga
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {person.manga.length}
                    </Badge>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {person.manga.slice(0, 8).map((manga, index) => (
                      <MangaCard key={`${manga.manga.mal_id}-${index}`} manga={manga} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceRoleCard({ voice }: { voice: PersonVoiceActing }) {
  return (
    <Link
      href={`/anime/${voice.anime.mal_id}`}
      className="group flex gap-3 p-3 rounded-xl bg-slate-800/30 border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer"
    >
      {/* Anime Image */}
      <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={voice.anime.images.jpg.small_image_url || voice.anime.images.jpg.image_url}
          alt={voice.anime.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
          {voice.anime.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {voice.character.name}
        </p>
        <Badge className="mt-1 text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
          {voice.role}
        </Badge>
      </div>
      
      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

function StaffAnimeCard({ anime }: { anime: PersonAnime }) {
  return (
    <Link
      href={`/anime/${anime.anime.mal_id}`}
      className="group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800/30 border border-purple-500/10 hover:border-purple-500/30 transition-all">
        <Image
          src={anime.anime.images.jpg.large_image_url || anime.anime.images.jpg.image_url}
          alt={anime.anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <p className="text-sm font-medium text-white line-clamp-2 mt-2 group-hover:text-purple-400 transition-colors">
        {anime.anime.title}
      </p>
      <p className="text-xs text-slate-400">{anime.position}</p>
    </Link>
  );
}

function MangaCard({ manga }: { manga: PersonManga }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800/30 border border-purple-500/10 hover:border-purple-500/30 transition-all">
        <Image
          src={manga.manga.images.jpg.large_image_url || manga.manga.images.jpg.image_url}
          alt={manga.manga.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <p className="text-sm font-medium text-white line-clamp-2 mt-2 group-hover:text-purple-400 transition-colors">
        {manga.manga.title}
      </p>
      <p className="text-xs text-slate-400">{manga.position}</p>
    </div>
  );
}
