// API Configuration and Utilities

export const API_URLS = {
  auth: 'http://localhost:3000/auth',
  games: 'http://localhost:8000/games',
  reviews: 'http://localhost:4000/reviews',
  likes: 'http://localhost:7060/likes',
  notifications: 'http://localhost:8030/notify',
  news: 'http://localhost:5000/news'
};

// Fetch wrapper that includes credentials for cookie handling (refresh tokens)
export const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    // Network error - service might not be running
    console.error(`Network error fetching ${url}:`, error);
    throw new Error(`Cannot connect to server. Please ensure the backend service is running.`);
  }
};

// Helper for GET requests
export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await apiFetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }
  return response.json();
};

// Helper for POST requests
export const apiPost = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }
  return response.json();
};

// Helper for PUT requests
export const apiPut = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }
  return response.json();
};

// Helper for DELETE requests
export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }
  return response.json();
};
