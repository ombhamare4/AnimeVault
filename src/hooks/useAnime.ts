"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Anime, AnimeCharacterStaff, AnimeSearchResult, JikanMultipleResponse, Person } from "@/lib/types";
import * as api from "@/lib/api";

// Generic hook for API calls
function useApiCall<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}

// Hook for top anime
export function useTopAnime(page = 1) {
  return useApiCall<JikanMultipleResponse<Anime>>(
    () => api.getTopAnime(page),
    [page]
  );
}

// Hook for seasonal anime
export function useSeasonalAnime() {
  return useApiCall<JikanMultipleResponse<Anime>>(
    () => api.getSeasonalAnime(),
    []
  );
}

// Hook for trending anime
export function useTrendingAnime(limit = 10) {
  return useApiCall<JikanMultipleResponse<Anime>>(
    () => api.getTrendingAnime(limit),
    [limit]
  );
}

// Hook for anime by ID
export function useAnimeById(id: number) {
  return useApiCall<{ data: Anime }>(
    () => api.getAnimeById(id),
    [id]
  );
}

// Hook for anime characters
export function useAnimeCharacters(id: number) {
  return useApiCall<JikanMultipleResponse<AnimeCharacterStaff>>(
    () => api.getAnimeCharacters(id),
    [id]
  );
}

// Hook for search with debounce
export function useSearchAnime(query: string, debounceMs = 500) {
  const [data, setData] = useState<JikanMultipleResponse<AnimeSearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.searchAnime(searchQuery);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    timeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  return { data, loading, error };
}

// Hook for infinite scroll
export function useInfiniteAnime(
  fetchFn: (page: number) => Promise<JikanMultipleResponse<Anime>>,
  initialPage = 1
) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.pagination?.has_next_page ?? false);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  return { data, loading, error, hasMore, loadMore, reset };
}

// Hook for person (character/voice actor) full details
export function usePersonFull(id: number) {
  return useApiCall<{ data: Person }>(
    () => api.getPersonFullById(id),
    [id]
  );
}
