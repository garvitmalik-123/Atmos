import React, { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, PenLine, ArrowUpRight, Bookmark, Share2, Clock } from "lucide-react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=60";

const getTimeAgo = (dateString) => {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
};

const getReadingTime = (description) => {
  const words = (description || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 40) + 2); // rough estimate, min 1 min
};

export default function NewsItem({ title, description, url, imgUrl, author, publishedAt, source }) {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative glass glass-hover flex flex-col overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:p-px before:bg-brand-gradient before:opacity-0 before:group-hover:opacity-40 before:transition-opacity before:duration-300 before:-z-10"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={imgUrl || PLACEHOLDER}
          alt={title}
          loading="lazy"
          onError={(e) => (e.target.src = PLACEHOLDER)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />

        {source && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-gradient text-white text-[10px] font-mono uppercase tracking-wide font-semibold shadow-glow">
            {source}
          </span>
        )}

        {publishedAt && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-night/70 backdrop-blur-md text-[10px] font-mono text-ink-100 border border-white/10">
            {getTimeAgo(publishedAt)}
          </span>
        )}

        {/* bookmark + share, appear on hover */}
        <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleSave}
            aria-label="Bookmark"
            className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors ${
              saved ? "bg-brand-gradient text-white" : "bg-night/70 text-ink-100 hover:text-brand-cyan"
            }`}
          >
            <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share"
            className="w-8 h-8 rounded-full bg-night/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-ink-100 hover:text-brand-cyan transition-colors"
          >
            <Share2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wide text-brand-cyan">
          <span className="flex items-center gap-1.5 truncate">
            <Newspaper size={11} />
            <span className="truncate">{source || "News"}</span>
          </span>
          <span className="flex items-center gap-1 text-ink-700 normal-case shrink-0">
            <Clock size={11} /> {getReadingTime(description)} min
          </span>
        </div>

        <h3 className="text-[15px] font-semibold text-ink-100 leading-snug line-clamp-2">
          {title || "No title available"}
        </h3>

        <p className="text-[13px] text-ink-500 leading-relaxed line-clamp-2">
          {description || "No description available"}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          {author ? (
            <span className="flex items-center gap-1.5 text-[11px] text-ink-700 truncate max-w-[70%]">
              <PenLine size={11} /> {author}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-100 group-hover:text-brand-cyan transition-colors shrink-0">
            Read <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
