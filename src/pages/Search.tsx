import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as gameService from "../services/gameService";
import type { Game, Genre } from "../types/Game";
import GameCard from "../components/common/GameCard";
import { FiFilter, FiX } from "react-icons/fi";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const genreParam = searchParams.get("genre") || "";

  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await gameService.getAllGenres();
        setGenres(genreList);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  // Fetch games based on query and genre
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        let results: Game[];

        if (selectedGenre) {
          // Find the genre name from the slug (backend expects exact genre name like "Action", not "action")
          const genreObj = genres.find((g) => g.slug === selectedGenre);
          const genreName = genreObj?.name || selectedGenre;

          // Filter by genre
          results = await gameService.getGamesByGenre(genreName);
          // If there's also a query, filter client-side
          if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(
              (game) =>
                game.title.toLowerCase().includes(lowerQuery) ||
                game.description?.toLowerCase().includes(lowerQuery)
            );
          }
        } else if (query) {
          // Search by query
          results = await gameService.searchGames(query, 50);
        } else {
          // Show all games - use getTrendingGames + getTopGames for a better selection
          const [trending, top, staffPicks] = await Promise.all([
            gameService.getTrendingGames(),
            gameService.getTopGames(),
            gameService.getStaffPicks(),
          ]);
          // Combine and deduplicate by id
          const allGames = [...trending, ...top, ...staffPicks];
          const uniqueGames = allGames.filter(
            (game, index, self) =>
              self.findIndex((g) => g.id === game.id) === index
          );
          results = uniqueGames;
        }

        setGames(results);
        setError(null);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query, selectedGenre, genres]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    const newParams = new URLSearchParams(searchParams);
    if (genre) {
      newParams.set("genre", genre);
    } else {
      newParams.delete("genre");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedGenre("");
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            {query ? `Search: "${query}"` : "All Games"}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {loading ? "Searching..." : `${games.length} games found`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] font-bold"
          >
            <FiFilter size={18} />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`w-full md:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="neo-card p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Filters
                </h2>
                {selectedGenre && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[var(--accent-primary)] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">
                  Genre
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto px-3">
                  <button
                    onClick={() => handleGenreChange("")}
                    className={`w-full text-left px-3 py-2 border-2 transition-all text-sm ${
                      !selectedGenre
                        ? "bg-[var(--accent-primary)] text-black border-black font-bold"
                        : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    All Genres
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreChange(genre.slug)}
                      className={`w-full text-left px-3 py-2 border-2 transition-all text-sm ${
                        selectedGenre === genre.slug
                          ? "bg-[var(--accent-primary)] text-black border-black font-bold"
                          : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
                  <p className="text-[var(--text-secondary)]">
                    Loading games...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="neo-card p-8 text-center">
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
                >
                  Retry
                </button>
              </div>
            ) : games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="neo-card p-8 text-center">
                <p className="text-lg text-[var(--text-secondary)] mb-4">
                  No games found
                  {query && ` for "${query}"`}
                  {selectedGenre &&
                    ` in ${
                      genres.find((g) => g.slug === selectedGenre)?.name ||
                      selectedGenre
                    }`}
                </p>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-[var(--button-bg)] border-2 border-[var(--border-color)] font-bold hover:bg-[var(--accent-primary)] hover:border-black hover:text-black transition-all"
                >
                  <FiX size={18} />
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Search;
