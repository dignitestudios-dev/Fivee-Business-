import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function formatTo12HourTime(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // convert '0' to '12'
  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Converts a date string (e.g. "2012-06-26T00:00:00.000Z")
 * into the format "YYYY-MM-DD" for <input type="date" /> fields.
 */
export function formatDateForInput(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

// Get case Id from localstorage
export const getCaseId = () => storage.get<string>("caseId");

// Set case Id in localstorage
export const setCaseId = (caseId: string) => {
  storage.set("caseId", caseId);
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const getBase64FromUrl = async (
  url: string
): Promise<string | ArrayBuffer | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

export const getError = (error: any) => {
  const errorMessage = error?.response?.data?.data?.message
    ? error?.response?.data?.data?.message
    : error.message;

  return errorMessage || "Something went wrong, Please try again!";
};
