import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as newsService from "../services/newsService";
import type { NewsArticle as NewsArticleType } from "../services/newsService";
import {
  FiCalendar,
  FiUser,
  FiExternalLink,
  FiArrowLeft,
} from "react-icons/fi";

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await newsService.getArticleById(id);
        setArticle(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            Article Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            {error || "Could not find the requested article."}
          </p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-black px-6 py-3 border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
          >
            <FiArrowLeft size={18} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] my-8">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={
            article.image_url ||
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200"
          }
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        {/* Back Button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 mb-6 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all font-semibold"
        >
          <FiArrowLeft size={18} />
          Back to News
        </Link>

        <article className="neo-card p-8 max-w-4xl mx-auto">
          {/* Source Badge */}
          {article.source && (
            <div className="inline-flex items-center gap-2 bg-[var(--accent-secondary)] text-black px-3 py-1 border-2 border-black font-bold text-sm mb-4">
              <FiExternalLink size={14} />
              <span>{article.source}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-[var(--text-secondary)] mb-8 pb-6 border-b-2 border-[var(--border-color)]">
            {article.author && (
              <div className="flex items-center gap-2">
                <FiUser size={18} />
                <span>By {article.author}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FiCalendar size={18} />
              <span>{formatDate(article.published_date)}</span>
            </div>
          </div>

          {/* Summary */}
          {article.summary && (
            <p className="text-lg text-[var(--text-secondary)] mb-6 italic">
              {article.summary}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
            {article.content ? (
              <div
                className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap"
                style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
              >
                {article.content}
              </div>
            ) : (
              <p className="text-[var(--text-secondary)]">
                Full article content not available. Visit the source for the
                complete story.
              </p>
            )}
          </div>

          {/* Original Article Link */}
          {article.url && (
            <div className="mt-8 pt-6 border-t-2 border-[var(--border-color)]">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-black border-2 border-black font-bold hover:bg-[var(--accent-secondary)] transition-all"
              >
                <FiExternalLink size={18} />
                Read Original Article
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default NewsArticle;
