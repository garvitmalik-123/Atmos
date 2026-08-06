import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Newspaper, Briefcase, Clapperboard, HeartPulse, FlaskConical, Volleyball, Cpu, Inbox, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import NewsItem from "./NewsItem";
import { cachedFetchJson } from "./newsCache";

const categoryIcons = {
  general: Newspaper,
  business: Briefcase,
  entertainment: Clapperboard,
  health: HeartPulse,
  science: FlaskConical,
  sports: Volleyball,
  technology: Cpu,
};

export default function NewsBar(props) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const country = useSelector((state) => state.country);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.com";
  const pageSize = 12;

  const fetchNews = async (pageNumber = page, attempt = 0) => {
    setLoading(true);
    setRateLimited(false);
    try {
      const url = `${BACKEND_URL}/api/news?country=${country}&category=${props.category}&pageSize=${pageSize}&page=${pageNumber}`;
      const { data } = await cachedFetchJson(url);
      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      if (err.status === 429 && attempt < 1) {
        await new Promise((r) => setTimeout(r, 1000));
        return fetchNews(pageNumber, attempt + 1);
      }
      if (err.status === 429) setRateLimited(true);
      console.error("Error fetching news:", err);
      setArticles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category, country]);

  const handlePreviousClick = () => {
    const newPage = page - 1;
    setPage(newPage);
    fetchNews(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextClick = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchNews(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const CategoryIcon = categoryIcons[props.category] || Newspaper;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-2xl bg-brand-gradient-soft border border-line flex items-center justify-center text-brand-cyan">
            <CategoryIcon size={20} strokeWidth={1.75} />
          </span>
          <div>
            <p className="eyebrow">Section</p>
            <h1 className="font-display text-2xl font-bold text-ink-100 capitalize">
              {props.category}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="pill !cursor-default">{totalResults} articles</span>
          <span className="pill !cursor-default">Page {page} of {totalPages}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
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
      ) : articles.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
          {rateLimited ? (
            <>
              <AlertTriangle size={32} strokeWidth={1.5} className="text-ink-700" />
              <h3 className="text-ink-100 font-semibold">Rate limited</h3>
              <p className="text-sm text-ink-500">
                The news API's daily quota is likely used up. Check your NewsAPI dashboard, or try again later.
              </p>
            </>
          ) : (
            <>
              <Inbox size={32} strokeWidth={1.5} className="text-ink-700" />
              <h3 className="text-ink-100 font-semibold">No articles found</h3>
              <p className="text-sm text-ink-500">Try selecting a different country or check back later.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % pageSize) * 0.05, duration: 0.35 }}
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

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={handlePreviousClick}
              disabled={page <= 1}
              className="btn-ghost flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <span className="font-mono text-xs text-ink-500">
              {page} <span className="text-ink-700">/</span> {totalPages}
            </span>
            <button
              onClick={handleNextClick}
              disabled={page >= totalPages}
              className="btn-ghost flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
