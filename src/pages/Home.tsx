import HeroSlider from '../components/common/HeroSlider';
import CategorySection from '../components/common/CategorySection';
import {
  getFeaturedGames,
  getTrendingGames,
  getActionGames,
  getTopRatedGames,
} from '../data/mockGames';

const Home = () => {
  const featuredGames = getFeaturedGames();
  const trendingGames = getTrendingGames();
  const actionGames = getActionGames();
  const topRatedGames = getTopRatedGames();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider games={featuredGames} />
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <CategorySection title="Trending Now" games={trendingGames} />
        <CategorySection title="Action Games" games={actionGames} />
        <CategorySection title="Top Rated" games={topRatedGames} />
      </section>
    </div>
  );
};

export default Home;
