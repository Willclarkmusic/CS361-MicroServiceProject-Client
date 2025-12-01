// Game Catalogue Service - Game API calls

import { API_URLS, apiGet } from "./api";
import type { Game, Genre, BackendGame } from "../types/Game";
import { transformGame } from "../types/Game";

// Backend response types
interface BackendGamesListResponse {
  trendingGames?: BackendGame[];
  featured?: BackendGame[];
  topGames?: BackendGame[];
  staffPicks?: BackendGame[];
}

interface BackendSearchResponse {
  searched: BackendGame[];
}

interface BackendGenresResponse {
  genres: string[];
}

interface BackendGenreGamesResponse {
  genre: string;
  games: BackendGame[];
  total: number;
  skip: number;
  limit: number;
}

// Frontend response type for genre games
export interface GenreGamesResponse {
  genre: string;
  games: Game[];
  total: number;
  skip: number;
  limit: number;
}

// Get a single game by ID
export const getGameById = async (gameId: number | string): Promise<Game> => {
  const game = await apiGet<BackendGame>(`${API_URLS.games}/id/${gameId}`);
  return transformGame(game);
};

// Search games by title (returns up to 8 results)
export const searchGames = async (title: string, limit?: number): Promise<Game[]> => {
  const response = await apiGet<BackendSearchResponse>(
    `${API_URLS.games}/search/${encodeURIComponent(title || ' ')}`
  );
  const games = response.searched.map(transformGame);
  return limit ? games.slice(0, limit) : games;
};

// Get trending games (top 10)
export const getTrendingGames = async (): Promise<Game[]> => {
  const response = await apiGet<BackendGamesListResponse>(
    `${API_URLS.games}/lists/trending`
  );
  return (response.trendingGames || []).map(transformGame);
};

// Get featured games (5 curated)
export const getFeaturedGames = async (): Promise<Game[]> => {
  const response = await apiGet<BackendGamesListResponse>(
    `${API_URLS.games}/lists/featured`
  );
  return (response.featured || []).map(transformGame);
};

// Get top games by Metacritic (top 10)
export const getTopGames = async (): Promise<Game[]> => {
  const response = await apiGet<BackendGamesListResponse>(
    `${API_URLS.games}/lists/top`
  );
  return (response.topGames || []).map(transformGame);
};

// Get staff picks (8 games)
export const getStaffPicks = async (): Promise<Game[]> => {
  const response = await apiGet<BackendGamesListResponse>(
    `${API_URLS.games}/lists/staff-picks`
  );
  return (response.staffPicks || []).map(transformGame);
};

// Get all unique genres - transforms string[] to Genre[] for UI compatibility
export const getAllGenres = async (): Promise<Genre[]> => {
  const response = await apiGet<BackendGenresResponse>(`${API_URLS.games}/genres`);
  // Transform string array to Genre objects for UI compatibility
  // Note: slug is used for URL params, but we use 'name' for API calls since backend expects exact genre names
  return response.genres.map((genre, index) => ({
    id: index + 1,
    name: genre,
    slug: genre.toLowerCase().replace(/\s+/g, '-'),
  }));
};

// Get games by genre with pagination
export const getGamesByGenre = async (
  genre: string,
  skip: number = 0,
  limit: number = 50
): Promise<Game[]> => {
  const response = await apiGet<BackendGenreGamesResponse>(
    `${API_URLS.games}/genres/${encodeURIComponent(genre)}?skip=${skip}&limit=${limit}`
  );
  return response.games.map(transformGame);
};
