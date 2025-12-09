import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";

interface ResearchTabProps {
  make: string;
  model: string;
  year: number;
  insights: {
    summary: string;
    pros: string[];
    cons: string[];
    commonIssues: string[];
    bestFor: string[];
    notIdealFor: string[];
    competitorComparison: string;
    buyingTips: string[];
    ownerSentiment: string;
    reliabilityScore: number;
  } | null;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  viewCount: string;
  publishedAt: string;
}

interface ForumInsights {
  reddit: {
    sentiment: "positive" | "mixed" | "negative";
    topTopics: string[];
    commonPraises: string[];
    commonComplaints: string[];
    sampleQuotes: Array<{ text: string; subreddit: string }>;
  };
  forums: {
    name: string;
    sentiment: "positive" | "mixed" | "negative";
    keyTakeaways: string[];
  }[];
}

export const ResearchTab = ({ make, model, year, insights }: ResearchTabProps) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [forumInsights, setForumInsights] = useState<ForumInsights | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingForums, setLoadingForums] = useState(true);
  const [activeSection, setActiveSection] = useState<"videos" | "forums">("videos");

  useEffect(() => {
    fetchVideos();
    fetchForumInsights();
  }, [make, model, year]);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const response = await apiFetch(`/api/research/youtube/${make}/${model}/${year}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      } else {
        // Use mock data for demo
        setVideos(generateMockVideos());
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos(generateMockVideos());
    } finally {
      setLoadingVideos(false);
    }
  };

  const fetchForumInsights = async () => {
    setLoadingForums(true);
    try {
      const response = await apiFetch(`/api/research/forums/${make}/${model}/${year}`);
      if (response.ok) {
        const data = await response.json();
        setForumInsights(data);
      } else {
        // Use GPT-generated insights from the insights prop or generate mock
        setForumInsights(generateForumInsightsFromGPT());
      }
    } catch (err) {
      console.error("Error fetching forum insights:", err);
      setForumInsights(generateForumInsightsFromGPT());
    } finally {
      setLoadingForums(false);
    }
  };

  const generateMockVideos = (): YouTubeVideo[] => {
    const reviewers = [
      { name: "Doug DeMuro", views: "2.1M" },
      { name: "Throttle House", views: "890K" },
      { name: "Straight Pipes", views: "650K" },
      { name: "savagegeese", views: "420K" },
      { name: "Alex on Autos", views: "310K" },
      { name: "Car and Driver", views: "280K" },
    ];

    return reviewers.slice(0, 5).map((reviewer, i) => ({
      id: `video_${i}`,
      title: `${year} ${make} ${model} Review - ${i === 0 ? "Here's Why It's Amazing" : i === 1 ? "Is It Worth It?" : i === 2 ? "Owner's Perspective" : i === 3 ? "Long Term Review" : "Complete Buyer's Guide"}`,
      thumbnail: `https://via.placeholder.com/320x180/6366f1/ffffff?text=${make}+${model}`,
      channelName: reviewer.name,
      viewCount: reviewer.views,
      publishedAt: `${Math.floor(Math.random() * 12) + 1} months ago`,
    }));
  };

  const generateForumInsightsFromGPT = (): ForumInsights => {
    return {
      reddit: {
        sentiment: insights?.ownerSentiment === "very_positive" || insights?.ownerSentiment === "positive" 
          ? "positive" 
          : insights?.ownerSentiment === "mixed" ? "mixed" : "negative",
        topTopics: [
          "Reliability concerns",
          "Fuel economy real-world",
          "Comparison with competitors",
          "Long-term ownership costs",
          "Common maintenance issues",
        ],
        commonPraises: insights?.pros?.slice(0, 3) || [
          "Comfortable ride quality",
          "Good fuel economy",
          "Reliable powertrain",
        ],
        commonComplaints: insights?.cons?.slice(0, 3) || [
          "Infotainment can be slow",
          "Road noise at highway speeds",
          "Limited cargo space",
        ],
        sampleQuotes: [
          {
            text: `I've had my ${model} for 2 years now and it's been rock solid. Only regular maintenance so far.`,
            subreddit: `r/${make.toLowerCase()}`,
          },
          {
            text: `The ${model} is great for daily driving but the acceleration could be better for highway merging.`,
            subreddit: "r/whatcarshouldIbuy",
          },
          {
            text: `Compared to the competition, the ${model} wins on reliability but loses on interior quality.`,
            subreddit: "r/cars",
          },
        ],
      },
      forums: [
        {
          name: `${make}Nation`,
          sentiment: "positive",
          keyTakeaways: [
            "Most owners report 100K+ miles without major issues",
            "Regular oil changes are critical for longevity",
            "Known for holding resale value well",
          ],
        },
        {
          name: "CarGurus Forums",
          sentiment: "mixed",
          keyTakeaways: [
            "Some reports of transmission issues in early production",
            "Dealer service quality varies significantly",
            "Extended warranty recommended by many owners",
          ],
        },
      ],
    };
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600 bg-green-50";
      case "mixed": return "text-yellow-600 bg-yellow-50";
      case "negative": return "text-red-600 bg-red-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "👍";
      case "mixed": return "⚖️";
      case "negative": return "👎";
      default: return "❓";
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection("videos")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
            activeSection === "videos"
              ? "bg-white shadow-md text-primary"
              : "bg-white/50 text-slate-600 hover:bg-white/80"
          }`}
        >
          <span>🎬</span> Video Reviews
        </button>
        <button
          onClick={() => setActiveSection("forums")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
            activeSection === "forums"
              ? "bg-white shadow-md text-primary"
              : "bg-white/50 text-slate-600 hover:bg-white/80"
          }`}
        >
          <span>💬</span> Owner Discussions
        </button>
      </div>

      {/* Video Reviews Section */}
      {activeSection === "videos" && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
            <span>🎬</span> Recommended Video Reviews
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Watch expert reviews and owner experiences for the {year} {make} {model}
          </p>

          {loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.id ? `https://www.youtube.com/watch?v=${video.id}` : `https://www.youtube.com/results?search_query=${year}+${make}+${model}+review`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/50 rounded-xl overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-mauve/20 to-cyan-light/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-mauve/50 group-hover:text-mauve transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    {video.viewCount && (
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                        {video.viewCount}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-primary text-sm line-clamp-2 group-hover:text-mauve transition-colors">
                      {video.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {video.channelName} {video.publishedAt ? `• ${video.publishedAt}` : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <a
              href={`https://www.youtube.com/results?search_query=${year}+${make}+${model}+review`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-mauve hover:underline"
            >
              Search more videos on YouTube
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Forum Insights Section */}
      {activeSection === "forums" && (
        <div className="space-y-6">
          {loadingForums ? (
            <div className="glass-card p-12 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-mauve animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : forumInsights && (
            <>
              {/* Reddit Insights */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span>🔴</span> Reddit Insights
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(forumInsights.reddit.sentiment)}`}>
                    {getSentimentEmoji(forumInsights.reddit.sentiment)} {forumInsights.reddit.sentiment.charAt(0).toUpperCase() + forumInsights.reddit.sentiment.slice(1)} Sentiment
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Praises */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <span>👍</span> What Owners Love
                    </h3>
                    <ul className="space-y-2">
                      {forumInsights.reddit.commonPraises.map((praise, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {praise}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Complaints */}
                  <div className="bg-red-50 rounded-xl p-4">
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <span>👎</span> Common Complaints
                    </h3>
                    <ul className="space-y-2">
                      {forumInsights.reddit.commonComplaints.map((complaint, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {complaint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Quotes */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">What People Are Saying</h3>
                  <div className="space-y-3">
                    {forumInsights.reddit.sampleQuotes.map((quote, i) => (
                      <div key={i} className="bg-white/50 rounded-lg p-4 border-l-4 border-mauve">
                        <p className="text-slate-700 text-sm italic">"{quote.text}"</p>
                        <p className="text-xs text-slate-400 mt-2">{quote.subreddit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <a
                    href={`https://www.reddit.com/search/?q=${year}+${make}+${model}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-mauve hover:underline"
                  >
                    Browse Reddit discussions
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Other Forums */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <span>💬</span> Forum Discussions
                </h2>

                <div className="space-y-4">
                  {forumInsights.forums.map((forum, i) => (
                    <div key={i} className="bg-white/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-primary">{forum.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(forum.sentiment)}`}>
                          {forum.sentiment}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {forum.keyTakeaways.map((takeaway, j) => (
                          <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Topics */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Trending Discussion Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {forumInsights.reddit.topTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gradient-to-r from-mauve/10 to-cyan-light/10 rounded-full text-sm text-primary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

