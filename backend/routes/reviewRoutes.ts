import express, { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();
const CACHE_FILE = path.join(__dirname, "../cache/reviews-cache.json");

interface CachedData {
  data: any;
  timestamp: string;
  expiresAt: string;
}

// Ensure cache directory exists
const cacheDir = path.dirname(CACHE_FILE);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Helper: Check if cache is valid (less than 24 hours old)
const isCacheValid = (cachedData: CachedData): boolean => {
  const now = new Date();
  const expiresAt = new Date(cachedData.expiresAt);
  return now < expiresAt;
};

// Helper: Get next midnight (24 hours from now)
const getNextMidnight = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

// Helper: Read cache from file
const readCache = (): CachedData | null => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading cache:", error);
  }
  return null;
};

// Helper: Write cache to file
const writeCache = (data: any): void => {
  try {
    const cacheData: CachedData = {
      data,
      timestamp: new Date().toISOString(),
      expiresAt: getNextMidnight().toISOString(),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error("Error writing cache:", error);
  }
};

router.get("/", async (req: Request, res: Response) => {
  try {
    // Check if we have valid cached data
    const cachedData = readCache();
    if (cachedData && isCacheValid(cachedData)) {
      console.log("Serving cached reviews (expires at:", cachedData.expiresAt, ")");
      return res.json(cachedData.data);
    }

    // Cache expired or doesn't exist - fetch fresh data
    console.log("Fetching fresh reviews from Google API...");

    const apiKey = process.env.GOOGLE_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return res.status(500).json({
        error: "Server configuration error",
        message: "Missing API credentials",
      });
    }

    // Fetch from Google API
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "name,rating,reviews,user_ratings_total",
          key: apiKey,
        },
        timeout: 10000,
      }
    );

    // Handle Google API errors
    if (response.data.status !== "OK") {
      const errorMessages: Record<string, string> = {
        ZERO_RESULTS: "No place found with this Place ID",
        INVALID_REQUEST: "Invalid request parameters",
        OVER_QUERY_LIMIT: "API quota exceeded",
        REQUEST_DENIED: "API key is invalid or request was denied",
        UNKNOWN_ERROR: "Server error, please try again",
      };

      return res.status(400).json({
        error: "Google API Error",
        message: errorMessages[response.data.status] || response.data.status,
        status: response.data.status,
      });
    }

    const result = response.data.result;
    const reviewData = {
      name: result.name || "Unknown",
      rating: result.rating || 0,
      total: result.user_ratings_total || 0,
      reviews: result.reviews || [],
      lastUpdated: new Date().toISOString(),
      nextUpdate: getNextMidnight().toISOString(),
    };

    // Save to cache file
    writeCache(reviewData);

    res.json(reviewData);
  } catch (error: any) {
    console.error("Error fetching reviews:", error.message);

    // If API fails, try to serve stale cache as fallback
    const cachedData = readCache();
    if (cachedData) {
      console.log("API failed, serving stale cache as fallback");
      return res.json({
        ...cachedData.data,
        stale: true,
        message: "Showing cached data due to API error",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        error: "Request timeout",
        message: "Google API took too long to respond",
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: "API request failed",
        message: error.response.data?.error_message || "Unknown error",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch Google Reviews",
    });
  }
});

// Optional: Endpoint to manually clear cache
router.delete("/cache", (req: Request, res: Response) => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      res.json({ message: "Cache cleared successfully" });
    } else {
      res.json({ message: "No cache to clear" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cache" });
  }
});

export default router;