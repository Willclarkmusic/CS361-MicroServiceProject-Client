import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiChevronDown } from 'react-icons/fi';
import { getAllGenres } from '../../data/mockGames';

const MenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const genres = getAllGenres();

  return (
    <div className="relative">
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-4">
        <Link
          to="/"
          className="px-4 py-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] font-semibold transition-colors"
        >
          All Games
        </Link>

        {/* Genres Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setGenresOpen(true)}
          onMouseLeave={() => setGenresOpen(false)}
        >
          <button className="flex items-center gap-1 px-4 py-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] font-semibold transition-colors">
            Genres
            <FiChevronDown size={16} />
          </button>

          {genresOpen && (
            <div className="absolute left-0 top-full mt-2 w-56 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-1 p-2">
                {genres.map((genre) => (
                  <Link
                    key={genre}
                    to={`/?genre=${genre.toLowerCase()}`}
                    className="px-3 py-2 hover:bg-[var(--accent-primary)] hover:text-black transition-colors text-[var(--text-primary)]"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all"
        aria-label="Menu"
      >
        <FiMenu size={20} className="text-[var(--text-primary)]" />
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)] lg:hidden">
          <div className="flex flex-col">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 hover:bg-[var(--accent-primary)] hover:text-black transition-colors text-[var(--text-primary)] border-b border-[var(--border-color)]"
            >
              All Games
            </Link>

            {/* Mobile Genres Section */}
            <div className="border-b border-[var(--border-color)]">
              <button
                onClick={() => setGenresOpen(!genresOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--accent-primary)] hover:text-black transition-colors text-[var(--text-primary)]"
              >
                <span>Genres</span>
                <FiChevronDown
                  size={16}
                  className={`transition-transform ${genresOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {genresOpen && (
                <div className="bg-[var(--bg-secondary)] max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/?genre=${genre.toLowerCase()}`}
                      onClick={() => {
                        setIsOpen(false);
                        setGenresOpen(false);
                      }}
                      className="block px-6 py-2 hover:bg-[var(--accent-primary)] hover:text-black transition-colors text-[var(--text-primary)] text-sm"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
