import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Inbox, AlertTriangle } from "lucide-react";
import NewsItem from "./NewsItem";
import { cachedFetchJson } from "./newsCache";

const HomepageNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const country = useSelector((state) => state.country);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.com";

  const getNews = async (attempt = 0) => {
    setLoading(true);
    setRateLimited(false);
    try {
      const url = `${BACKEND_URL}/api/news?country=${country}&pageSize=3`;
      const { data } = await cachedFetchJson(url);
      setArticles(data.articles || []);
    } catch (err) {
      if (err.status === 429 && attempt < 1) {
        await new Promise((r) => setTimeout(r, 1000));
        return getNews(attempt + 1);
      }
      if (err.status === 429) setRateLimited(true);
      console.error("Error fetching news:", err);
      setArticles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass overflow-hidden">
            <div className="skeleton h-44 w-full" />
            <div className="p-4 flex flex-col gap-3">
              <div className="skeleton h-3 w-1/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
        {rateLimited ? (
          <>
            <AlertTriangle size={26} className="text-ink-700" />
            <p className="text-sm text-ink-500">
              The news API is rate-limited right now &mdash; likely the daily quota on your NewsAPI
              key is used up. Check your NewsAPI dashboard, or try again later.
            </p>
          </>
        ) : (
          <>
            <Inbox size={28} className="text-ink-700" />
            <p className="text-sm text-ink-500">No top stories right now &mdash; try another country.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <NewsItem
            title={article.title}
            description={article.description}
            url={article.url}
            imgUrl={article.urlToImage}
            author={article.author}
            publishedAt={article.publishedAt}
            source={article.source?.name}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default HomepageNews;
