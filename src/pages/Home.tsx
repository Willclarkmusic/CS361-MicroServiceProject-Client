import { useState, useEffect } from "react";
import HeroSlider from "../components/common/HeroSlider";
import CategorySection from "../components/common/CategorySection";
import NewsSection from "../components/common/NewsSection";
import type { Game } from "../types/Game";
import type { NewsArticle } from "../services/newsService";
import * as gameService from "../services/gameService";
import * as newsService from "../services/newsService";

const Home = () => {
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [staffPicks, setStaffPicks] = useState<Game[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [top, trending, featured, picks, news] = await Promise.all([
          gameService.getTopGames(),
          gameService.getTrendingGames(),
          gameService.getFeaturedGames(),
          gameService.getStaffPicks(),
          newsService.getArticles(10, 0),
        ]);

        setTopGames(top);
        setTrendingGames(trending);
        setFeaturedGames(featured);
        setStaffPicks(picks);
        setNewsArticles(news.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching home page data:", err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            Error
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--accent-primary)] text-black px-6 py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section - Top Games */}
      <section className="container mx-auto md:px-4 py-8">
        <HeroSlider games={topGames.slice(0, 5)} />
      </section>

      {/* Latest News Section */}
      {newsArticles.length > 0 && (
        <section className="container mx-auto md:px-4">
          <NewsSection title="Latest News" articles={newsArticles} />
        </section>
      )}

      {/* Game Categories Section */}
      <section className="container mx-auto md:px-4 py-8">
        {trendingGames.length > 0 && (
          <CategorySection title="Trending Now" games={trendingGames} />
        )}
        {featuredGames.length > 0 && (
          <CategorySection title="Featured" games={featuredGames} />
        )}
        {staffPicks.length > 0 && (
          <CategorySection title="Staff Picks" games={staffPicks} />
        )}
      </section>
    </div>
  );
};

export default Home;
