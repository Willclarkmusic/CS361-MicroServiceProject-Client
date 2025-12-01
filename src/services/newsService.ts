// News Service - News article operations

import { API_URLS, apiGet } from './api';

// Backend article structure for list endpoints (getAllArticles, search, etc.)
// Returns: id, title, author, published_date, url, image_url, platform, summary
interface BackendArticleList {
  id: number;
  title: string;
  author: string | null;
  published_date: string;
  url: string;
  image_url: string | null;
  platform: string; // source name from list endpoints
  summary: string | null;
}

// Backend article structure for single article (getArticleById with SELECT *)
interface BackendArticleFull {
  id: number;
  title: string;
  url: string;
  url_hash: string;
  source: string;
  platform: string;
  author: string | null;
  published_date: string;
  summary: string | null;
  full_content: string | null;
  image_url: string | null;
  categories?: string[];
}

// Frontend article structure (what our components expect)
export interface NewsArticle {
  id: number;
  title: string;
  author: string | null;
  published_date: string;
  url: string;
  image_url: string | null;
  source: string;
  summary?: string;
  content?: string;
}

interface BackendArticlesResponse {
  success: boolean;
  data: BackendArticleList[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface BackendSingleArticleResponse {
  success: boolean;
  data: BackendArticleFull;
}

interface BackendSourcesResponse {
  success: boolean;
  sources: string[];
}

interface BackendSearchResponse {
  success: boolean;
  data: BackendArticleList[];
  query: string;
  count: number;
}

export interface ArticlesResponse {
  data: NewsArticle[];
  total: number;
}

// Transform backend list article to frontend format
const transformListArticle = (article: BackendArticleList): NewsArticle => ({
  id: article.id,
  title: article.title,
  author: article.author || null,
  published_date: article.published_date,
  url: article.url,
  image_url: article.image_url || null,
  source: article.platform, // list endpoints return 'platform' as source
  summary: article.summary || undefined,
});

// Transform backend full article to frontend format
const transformFullArticle = (article: BackendArticleFull): NewsArticle => ({
  id: article.id,
  title: article.title,
  author: article.author || null,
  published_date: article.published_date,
  url: article.url,
  image_url: article.image_url || null,
  source: article.source || article.platform,
  summary: article.summary || undefined,
  content: article.full_content || undefined,
});

// Get paginated articles
export const getArticles = async (
  limit: number = 10,
  offset: number = 0
): Promise<ArticlesResponse> => {
  const response = await apiGet<BackendArticlesResponse>(
    `${API_URLS.news}/articles?limit=${limit}&offset=${offset}`
  );
  return {
    data: response.data.map(transformListArticle),
    total: response.pagination.total,
  };
};

// Get single article by ID
export const getArticleById = async (
  articleId: string
): Promise<NewsArticle> => {
  const response = await apiGet<BackendSingleArticleResponse>(
    `${API_URLS.news}/articles/${articleId}`
  );
  return transformFullArticle(response.data);
};

// Get articles by source with pagination
export const getArticlesBySource = async (
  source: string,
  limit: number = 10,
  offset: number = 0
): Promise<ArticlesResponse> => {
  const response = await apiGet<BackendArticlesResponse>(
    `${API_URLS.news}/articles/source/${encodeURIComponent(source)}?limit=${limit}&offset=${offset}`
  );
  return {
    data: response.data.map(transformListArticle),
    total: response.pagination.total,
  };
};

// Search articles by title/content
export const searchArticles = async (
  query: string,
  limit: number = 50
): Promise<NewsArticle[]> => {
  const response = await apiGet<BackendSearchResponse>(
    `${API_URLS.news}/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data.map(transformListArticle);
};

// Get list of all news sources
export const getSources = async (): Promise<string[]> => {
  const response = await apiGet<BackendSourcesResponse>(`${API_URLS.news}/sources`);
  return response.sources;
};
