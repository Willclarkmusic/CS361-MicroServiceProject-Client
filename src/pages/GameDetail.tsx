import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../data/mockGames';
import { FiStar, FiArrowLeft, FiCalendar, FiMonitor } from 'react-icons/fi';

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = id ? getGameById(id) : undefined;

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            Game Not Found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-[var(--accent-primary)] text-black px-6 py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all font-semibold"
        >
          <FiArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Game Image */}
          <div className="border-2 border-[var(--border-color)] shadow-[6px_6px_0_0_var(--shadow-color)] overflow-hidden">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-[600px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200';
              }}
            />
          </div>

          {/* Game Info */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
              {game.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1 bg-[var(--accent-primary)] text-black px-4 py-2 border-2 border-black font-bold text-xl">
                <FiStar size={24} fill="currentColor" />
                <span>{game.rating.toFixed(1)}/10</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                  <FiCalendar size={18} />
                  <span className="text-sm font-semibold">Release Year</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {game.releaseYear}
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                  <FiMonitor size={18} />
                  <span className="text-sm font-semibold">Platforms</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {game.platform.length}
                </p>
              </div>
            </div>

            {/* Developer */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                DEVELOPER
              </h3>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {game.developer}
              </p>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                GENRES
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 bg-[var(--card-bg)] border-2 border-[var(--border-color)] font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-all cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                AVAILABLE ON
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.platform.map((platform) => (
                  <span
                    key={platform}
                    className="px-4 py-2 bg-[var(--accent-primary)] text-black border-2 border-black font-semibold"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">
            About This Game
          </h2>
          <div className="p-6 bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--shadow-color)]">
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              {game.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
