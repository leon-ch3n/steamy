/**
 * Research API Routes
 * YouTube video recommendations and forum insights
 */

import { Router, Request, Response } from "express";
import { generateForumInsights } from "../services/forumInsights.js";

export const researchRouter = Router();

/**
 * GET /api/research/youtube/:make/:model/:year
 * Get YouTube video recommendations for a car
 */
researchRouter.get("/youtube/:make/:model/:year", async (req: Request, res: Response) => {
  try {
    const { make, model, year } = req.params;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeApiKey) {
      return res.status(500).json({ error: "YOUTUBE_API_KEY is not configured on the backend." });
    }

    try {
      const videos = await fetchYoutubeVideos(youtubeApiKey, make, model, year);
      if (videos.length === 0) {
        return res.status(404).json({ error: "No videos found for this query." });
      }
      return res.json({ videos });
    } catch (err: any) {
      console.error("YouTube fetch error:", err);
      return res.status(502).json({ error: "Failed to fetch YouTube videos", detail: String(err) });
    }
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    res.status(500).json({ error: "Failed to fetch video recommendations" });
  }
});

/**
 * GET /api/research/forums/:make/:model/:year
 * Get GPT-synthesized forum insights for a car
 */
researchRouter.get("/forums/:make/:model/:year", async (req: Request, res: Response) => {
  try {
    const { make, model, year } = req.params;
    
    const insights = await generateForumInsights(make, model, parseInt(year));
    res.json(insights);
    
  } catch (error) {
    console.error("Error generating forum insights:", error);
    res.status(500).json({ error: "Failed to generate forum insights" });
  }
});

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function generateMockVideos(make: string, model: string, year: number) {
  const reviewers = [
    { name: "Doug DeMuro", views: "2.1M views" },
    { name: "Throttle House", views: "890K views" },
    { name: "Straight Pipes", views: "650K views" },
    { name: "savagegeese", views: "420K views" },
    { name: "Alex on Autos", views: "310K views" },
  ];

  const titles = [
    `${year} ${make} ${model} Review - Here's Why Everyone Loves It`,
    `Is the ${year} ${make} ${model} Worth It? Complete Review`,
    `${year} ${make} ${model} - Owner's Review After 1 Year`,
    `${make} ${model} Long Term Review - The Good, Bad & Ugly`,
    `${year} ${make} ${model} vs Competition - Which Should You Buy?`,
  ];

  return reviewers.map((reviewer, i) => ({
    id: `mock_video_${i}`,
    title: titles[i],
    thumbnail: `https://via.placeholder.com/320x180/6366f1/ffffff?text=${make}+${model}`,
    channelName: reviewer.name,
    viewCount: reviewer.views,
    publishedAt: `${Math.floor(Math.random() * 12) + 1} months ago`,
  }));
}

async function fetchYoutubeVideos(
  apiKey: string,
  make: string,
  model: string,
  year: string
) {
  const searchQuery = `${year} ${make} ${model} review`;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery
  )}&type=video&maxResults=6&key=${apiKey}`;

  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) throw new Error(`YouTube search failed: ${searchResp.statusText}`);

  const searchData = await searchResp.json();
  const videoIds: string[] = searchData.items?.map((item: any) => item.id.videoId).filter(Boolean) || [];

  if (videoIds.length === 0) return [];

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(
    ","
  )}&key=${apiKey}`;
  const detailsResp = await fetch(detailsUrl);
  if (!detailsResp.ok) throw new Error(`YouTube details failed: ${detailsResp.statusText}`);

  const detailsData = await detailsResp.json();

  return detailsData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    channelName: item.snippet.channelTitle,
    publishedAt: formatTimeAgo(new Date(item.snippet.publishedAt)),
    viewCount: item.statistics?.viewCount
      ? `${Number(item.statistics.viewCount).toLocaleString()} views`
      : "N/A",
  }));
}

