import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Briefcase, Volleyball, HeartPulse, FlaskConical, Clapperboard,
  ChevronLeft, ChevronRight, ArrowUpRight, AlertTriangle,
} from "lucide-react";
import { cachedFetchJson } from "./newsCache";

const categories = ["technology", "business", "sports", "health", "science", "entertainment"];

const categoryIcons = {
  technology: Cpu,
  business: Briefcase,
  sports: Volleyball,
  health: HeartPulse,
  science: FlaskConical,
  entertainment: Clapperboard,
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=60";

const FeaturedNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [active, setActive] = useState(0);
  const country = useSelector((state) => state.country);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.com";
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchOneCategory = async (category, attempt = 0) => {
    const url = `${BACKEND_URL}/api/news?country=${country}&category=${category}&pageSize=1`;
    try {
      const { data } = await cachedFetchJson(url);
      return { ...(data.articles?.[0] || null), category };
    } catch (err) {
      if (err.status === 429 && attempt < 1) {
        await sleep(1000);
        return fetchOneCategory(category, attempt + 1);
      }
      if (err.status === 429) setRateLimited(true);
      return null;
    }
  };

  const fetchNews = async (cancelledRef) => {
    setLoading(true);
    setRateLimited(false);
    const results = [];
    for (const category of categories) {
      if (cancelledRef.current) return;
      const result = await fetchOneCategory(category);
      if (result) results.push(result);
      await sleep(120);
    }
    if (!cancelledRef.current) {
      setArticles(results.filter((a) => a && a.title));
      setActive(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    const cancelledRef = { current: false };
    // Let HomepageNews' single request land first before this one starts.
    const timer = setTimeout(() => fetchNews(cancelledRef), 400);
    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const next = useCallback(() => {
    setActive((a) => (articles.length ? (a + 1) % articles.length : 0));
  }, [articles.length]);

  const prev = () => setActive((a) => (articles.length ? (a - 1 + articles.length) % articles.length : 0));

  useEffect(() => {
    if (articles.length < 2) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, articles.length]);

  if (loading) {
    return <div className="skeleton h-[420px] w-full" />;
  }

  if (articles.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
        {rateLimited ? (
          <>
            <AlertTriangle size={26} className="text-ink-700" />
            <p className="text-sm text-ink-500">
              The news API is rate-limited right now. This usually means the daily quota on your
              NewsAPI key is used up &mdash; check your NewsAPI dashboard, or try again later.
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-500">No headlines available right now.</p>
        )}
      </div>
    );
  }

  const article = articles[active];
  const Icon = categoryIcons[article.category] || Cpu;

  return (
    <div className="relative h-[420px] rounded-3xl overflow-hidden border border-line group">
      <AnimatePresence mode="wait">
        <motion.a
          key={active}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 block"
        >
          <img
            src={article.urlToImage || PLACEHOLDER}
            alt={article.title}
            onError={(e) => (e.target.src = PLACEHOLDER)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3 max-w-2xl">
            <span className="flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full bg-brand-gradient text-white text-[11px] font-mono uppercase tracking-wide font-semibold">
              <Icon size={12} /> {article.category}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-100 leading-tight line-clamp-3">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 text-[12px] text-ink-500 font-mono">
              <span>{article.source?.name}</span>
              {article.author && (
                <>
                  <span className="w-1 h-1 rounded-full bg-ink-700" />
                  <span className="truncate max-w-[160px]">{article.author}</span>
                </>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-100 mt-1">
              Read more <ArrowUpRight size={15} />
            </span>
          </div>
        </motion.a>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 icon-btn bg-night/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 icon-btn bg-night/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute top-5 right-6 flex gap-1.5">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-brand-gradient" : "w-1.5 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedNews;
