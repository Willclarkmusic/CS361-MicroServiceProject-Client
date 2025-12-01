import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as newsService from "../services/newsService";
import type { NewsArticle } from "../services/newsService";
import {
  FiCalendar,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const ARTICLES_PER_PAGE = 12;

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [pageInput, setPageInput] = useState("");

  // Fetch sources on mount
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const sourceList = await newsService.getSources();
        setSources(sourceList);
      } catch (err) {
        console.error("Error fetching sources:", err);
      }
    };

    fetchSources();
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

        let result;
        if (selectedSource) {
          result = await newsService.getArticlesBySource(
            selectedSource,
            ARTICLES_PER_PAGE,
            offset
          );
        } else {
          result = await newsService.getArticles(ARTICLES_PER_PAGE, offset);
        }

        setArticles(result.data);
        setTotalArticles(result.total);
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load news articles");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, selectedSource]);

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
    setPageInput("");
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput("");
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setPageInput("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            Gaming News
          </h1>
          <p className="text-[var(--text-secondary)]">
            Stay up to date with the latest gaming news and updates
          </p>
        </div>

        {/* Source Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleSourceChange("")}
            className={`px-4 py-2 border-2 font-semibold transition-all ${
              !selectedSource
                ? "bg-[var(--accent-primary)] text-black border-black"
                : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            All Sources
          </button>
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              className={`px-4 py-2 border-2 font-semibold transition-all ${
                selectedSource === source
                  ? "bg-[var(--accent-primary)] text-black border-black"
                  : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4 mx-auto"></div>
              <p className="text-[var(--text-secondary)]">
                Loading articles...
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
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="neo-card neo-card-hover overflow-hidden block"
                >
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
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
                      <div className="absolute top-3 right-3 bg-[var(--accent-secondary)] text-black px-3 py-1 border-2 border-black flex items-center gap-1 font-bold text-sm">
                        <FiExternalLink size={14} />
                        <span>{article.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="p-5 bg-[var(--card-bg)]">
                    <h2 className="font-bold text-xl mb-3 text-[var(--text-primary)] line-clamp-2">
                      {article.title}
                    </h2>

                    {article.summary && (
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                      {/* Author */}
                      {article.author && (
                        <span className="truncate max-w-[150px]">
                          By {article.author}
                        </span>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <FiCalendar size={14} />
                        <span>{formatDate(article.published_date)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* First Page */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="First page"
                    title="First page"
                  >
                    <FiChevronsLeft size={20} />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        );
                      })
                      .map((page, index, array) => {
                        // Check if we need to show ellipsis before this page
                        const showEllipsisBefore =
                          index > 0 && page - array[index - 1] > 1;

                        return (
                          <span key={page} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-2 text-[var(--text-secondary)]">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => goToPage(page)}
                              className={`min-w-[40px] px-3 py-2 border-2 font-semibold transition-all ${
                                currentPage === page
                                  ? "bg-[var(--accent-primary)] text-black border-black"
                                  : "bg-[var(--button-bg)] border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:text-black hover:border-black"
                              }`}
                            >
                              {page}
                            </button>
                          </span>
                        );
                      })}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                    title="Next page"
                  >
                    <FiChevronRight size={20} />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Last page"
                    title="Last page"
                  >
                    <FiChevronsRight size={20} />
                  </button>
                </div>

                {/* Page Info and Manual Input */}
                <div className="flex items-center gap-4 text-[var(--text-secondary)]">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages} ({totalArticles} articles)
                  </span>

                  {/* Manual Page Input */}
                  <form
                    onSubmit={handlePageInputSubmit}
                    className="flex items-center gap-2"
                  >
                    <label htmlFor="pageInput" className="text-sm">
                      Go to:
                    </label>
                    <input
                      id="pageInput"
                      type="text"
                      value={pageInput}
                      onChange={handlePageInputChange}
                      placeholder="#"
                      className="w-16 px-2 py-1 text-center bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)]"
                    />
                    <button
                      type="submit"
                      disabled={
                        !pageInput ||
                        parseInt(pageInput, 10) < 1 ||
                        parseInt(pageInput, 10) > totalPages
                      }
                      className="px-3 py-1 bg-[var(--button-bg)] border-2 border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="neo-card p-8 text-center">
            <p className="text-lg text-[var(--text-secondary)]">
              No news articles found
              {selectedSource && ` from ${selectedSource}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
