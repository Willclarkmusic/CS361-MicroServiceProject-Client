import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import * as gameService from "../../services/gameService";
import type { Game } from "../../types/Game";

const SearchDropdown = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await gameService.searchGames(query, 5);
        setResults(searchResults);
        setIsOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (gameId: number) => {
    navigate(`/game/${gameId}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 max-w-md" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full px-4 py-2 pl-10 bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          size={18}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent animate-spin rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] z-50 max-h-80 overflow-y-auto">
          {results.map((game) => (
            <button
              key={game.id}
              onClick={() => handleSelect(game.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-[var(--accent-primary)] hover:text-black transition-all text-left border-b border-[var(--border-color)] last:border-b-0"
            >
              <img
                src={game.imageUrl || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100"}
                alt={game.title}
                className="w-12 h-12 object-cover border border-[var(--border-color)]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-[var(--text-primary)]">{game.title}</p>
                {game.genres && game.genres.length > 0 && (
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {game.genres.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
              {game.metacriticScore && (
                <span className="px-2 py-1 bg-[var(--accent-secondary)] text-black text-sm font-bold border border-black">
                  {game.metacriticScore}
                </span>
              )}
            </button>
          ))}

          {/* View All Results Button */}
          <button
            onClick={handleViewAll}
            className="w-full p-3 text-center font-bold text-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            View all results for "{query}"
          </button>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] z-50 p-4 text-center">
          <p className="text-[var(--text-secondary)]">No games found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
