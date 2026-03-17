import type { Anime, AnimeCharacterStaff, AnimeSearchResult, JikanMultipleResponse, JikanResponse, Person } from "./types";

const BASE_URL = "https://api.jikan.moe";

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 400; // Jikan has a 3 requests per second limit

async function fetchWithRateLimit<T>(url: string): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  const response = await fetch(url, {
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      // Retry after a delay if rate limited
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRateLimit<T>(url);
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Get top anime
export async function getTopAnime(page = 1, limit = 25): Promise<JikanMultipleResponse<Anime>> {
  return fetchWithRateLimit<JikanMultipleResponse<Anime>>(
    `${BASE_URL}/v4/top/anime?page=${page}&limit=${limit}`
  );
}

// Get seasonal anime
export async function getSeasonalAnime(year?: number, season?: string): Promise<JikanMultipleResponse<Anime>> {
  const currentYear = year || new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  let currentSeason = season;
  if (!currentSeason) {
    if (currentMonth >= 0 && currentMonth <= 2) currentSeason = "winter";
    else if (currentMonth >= 3 && currentMonth <= 5) currentSeason = "spring";
    else if (currentMonth >= 6 && currentMonth <= 8) currentSeason = "summer";
    else currentSeason = "fall";
  }
  
  return fetchWithRateLimit<JikanMultipleResponse<Anime>>(
    `${BASE_URL}/v4/seasons/${currentYear}/${currentSeason}?limit=25`
  );
}

// Get anime by ID
export async function getAnimeById(id: number): Promise<JikanResponse<Anime>> {
  return fetchWithRateLimit<JikanResponse<Anime>>(
    `${BASE_URL}/v4/anime/${id}/full`
  );
}

// Get anime characters and staff
export async function getAnimeCharacters(id: number): Promise<JikanMultipleResponse<AnimeCharacterStaff>> {
  return fetchWithRateLimit<JikanMultipleResponse<AnimeCharacterStaff>>(
    `${BASE_URL}/v4/anime/${id}/characters`
  );
}

// Search anime
export async function searchAnime(query: string, page = 1, limit = 25): Promise<JikanMultipleResponse<AnimeSearchResult>> {
  return fetchWithRateLimit<JikanMultipleResponse<AnimeSearchResult>>(
    `${BASE_URL}/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true`
  );
}

// Get trending anime (using top airing)
export async function getTrendingAnime(limit = 10): Promise<JikanMultipleResponse<Anime>> {
  return fetchWithRateLimit<JikanMultipleResponse<Anime>>(
    `${BASE_URL}/v4/top/anime?filter=airing&limit=${limit}`
  );
}

// Get anime recommendations
export async function getAnimeRecommendations(id: number): Promise<JikanMultipleResponse<{ entry: { mal_id: number; url: string; images: { jpg: AnimeImage }; title: string }; votes: number }>> {
  return fetchWithRateLimit<JikanMultipleResponse<{ entry: { mal_id: number; url: string; images: { jpg: AnimeImage }; title: string }; votes: number }>>(
    `${BASE_URL}/v4/anime/${id}/recommendations`
  );
}

// Get random anime
export async function getRandomAnime(): Promise<JikanResponse<Anime>> {
  return fetchWithRateLimit<JikanResponse<Anime>>(
    `${BASE_URL}/v4/random/anime`
  );
}

// Get upcomming anime
export async function getUpcomingAnime(limit = 25): Promise<JikanMultipleResponse<Anime>> {
  return fetchWithRateLimit<JikanMultipleResponse<Anime>>(
    `${BASE_URL}/v4/seasons/upcoming?limit=${limit}`
  );
}

// Get person (character/voice actor) full details by ID
export async function getPersonFullById(id: number): Promise<JikanResponse<Person>> {
  return fetchWithRateLimit<JikanResponse<Person>>(
    `${BASE_URL}/v4/people/${id}/full`
  );
}
