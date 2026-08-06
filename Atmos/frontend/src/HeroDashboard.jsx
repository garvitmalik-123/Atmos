import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sun, TrendingUp, Radio, Cloud } from "lucide-react";
import { cachedFetchJson } from "./newsCache";

const TREND_CATEGORIES = ["Technology", "Business", "Sports", "Science"];

const HeroDashboard = () => {
  const [clock, setClock] = useState(new Date());
  const [headline, setHeadline] = useState(null);
  const country = useSelector((state) => state.country);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.com";

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = `${BACKEND_URL}/api/news?country=${country}&pageSize=1`;
        const { data } = await cachedFetchJson(url);
        if (!cancelled) setHeadline(data.articles?.[0]?.title || null);
      } catch {
        if (!cancelled) setHeadline(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [country]);

  const graphPoints = "0,32 12,24 24,28 36,16 48,20 60,8 72,14 84,4 96,10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      {/* floating blurred circles behind the dashboard */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-violet/30 blur-[70px] animate-floatSlow" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-brand-cyan/25 blur-[60px] animate-float" />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative glass !rounded-3xl p-5 sm:p-6 w-full max-w-md mx-auto glow-purple"
      >
        {/* top row: breaking badge + live clock */}
        <div className="flex items-center justify-between mb-5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono uppercase tracking-wide font-semibold">
            <Radio size={11} className="animate-pulse" /> Breaking
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>

        {/* top headline */}
        <div className="mb-5">
          <p className="eyebrow mb-2">Today&apos;s Top Headline</p>
          <p className="text-sm text-ink-100 font-medium leading-snug line-clamp-2">
            {headline || "AI models are reshaping how the world reads the news, live"}
          </p>
        </div>

        {/* weather + trending mini cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl bg-white/[0.03] border border-line p-3.5">
            <div className="flex items-center justify-between">
              <Cloud size={22} className="text-brand-cyan" />
              <span className="text-lg font-display font-bold text-ink-100">21&deg;</span>
            </div>
            <p className="text-[11px] text-ink-500 mt-2">Partly cloudy</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-line p-3.5">
            <div className="flex items-center justify-between">
              <TrendingUp size={22} className="text-brand-violet" />
              <span className="text-[10px] font-mono text-ink-500">LIVE</span>
            </div>
            <p className="text-[11px] text-ink-100 mt-2 font-medium">{TREND_CATEGORIES[clock.getSeconds() % TREND_CATEGORIES.length]}</p>
          </div>
        </div>

        {/* animated sparkline graph */}
        <div className="rounded-2xl bg-white/[0.03] border border-line p-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-ink-500">Story volume, 24h</p>
            <Sun size={13} className="text-brand-cyan" />
          </div>
          <svg viewBox="0 0 96 36" className="w-full h-10">
            <defs>
              <linearGradient id="sparkline" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <motion.polyline
              points={graphPoints}
              fill="none"
              stroke="url(#sparkline)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroDashboard;
