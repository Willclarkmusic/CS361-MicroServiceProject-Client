import { useNavigate } from "react-router-dom";
import type { NewsArticle } from "../../services/newsService";
import { FiCalendar, FiExternalLink } from "react-icons/fi";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${article.id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="neo-card neo-card-hover min-w-[250px] max-w-[250px] cursor-pointer overflow-hidden flex-shrink-0"
    >
      {/* Article Image */}
      <div className="relative h-[150px] overflow-hidden">
        <img
          src={
            article.image_url ||
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800"
          }
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800";
          }}
        />

        {/* Source Badge */}
        {article.source && (
          <div className="absolute top-2 right-2 bg-[var(--accent-secondary)] text-black px-2 py-1 border-2 border-black flex items-center gap-1 font-bold text-xs">
            <FiExternalLink size={12} />
            <span>{article.source}</span>
          </div>
        )}
      </div>

      {/* Article Info */}
      <div className="p-4 bg-[var(--card-bg)]">
        <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)] line-clamp-2">
          {article.title}
        </h3>

        {/* Summary Preview */}
        {article.summary && (
          <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-1">
            {article.summary.length > 50
              ? article.summary.substring(0, 50) + "..."
              : article.summary}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-1">
            By {article.author}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <FiCalendar size={14} />
          <span>{formatDate(article.published_date)}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
