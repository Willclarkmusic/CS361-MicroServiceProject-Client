import { useRef } from "react";
import type { NewsArticle } from "../../services/newsService";
import NewsCard from "./NewsCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface NewsSectionProps {
  title: string;
  articles: NewsArticle[];
}

const NewsSection = ({ title, articles }: NewsSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (articles.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          {title}
        </h2>

        {/* Scroll Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-secondary)] hover:border-black transition-all"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-secondary)] hover:border-black transition-all"
            aria-label="Scroll right"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Articles Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
