// to check client side
export const isBrowser = typeof window !== "undefined";

// Local storage utilities
export const storage = {
  get<T = unknown>(key: string, defaultValue: T | null = null): T | null {
    if (!isBrowser) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T = unknown>(key: string, value: T): void {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

export const toTitleCase = (str: string): string => {
  if (!str) return "";
  const formatted = str.replace(/-/g, " "); // replace - with space
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const getInitials = (str: string): string => {
  if (!str) return "";

  return str
    .trim()
    .split(/\s+/) // split by spaces
    .map((word) => word.charAt(0).toUpperCase()) // take first letter of each word
    .join("");
};

// Date formatting utilities
export const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateWithName = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// Formats a date string to relative time (now, secs/mins/hours ago, or mm/dd/yyyy)
export const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return formatDate(dateStr); // Future date fallback

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 1) return "Just now";
  if (diffSec < 60) return `${diffSec} secs ago`;
  if (diffMin < 60) return `${diffMin} mins ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  // After 23:59, show date in mm/dd/yyyy
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateTime = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US");
};
