import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, Briefcase, Clapperboard, HeartPulse, FlaskConical, Volleyball, Cpu } from "lucide-react";

const categories = [
  { path: "/general", label: "General", icon: Newspaper, from: "#7C3AED", to: "#4F46E5" },
  { path: "/business", label: "Business", icon: Briefcase, from: "#4F46E5", to: "#3B82F6" },
  { path: "/technology", label: "Technology", icon: Cpu, from: "#06B6D4", to: "#3B82F6" },
  { path: "/entertainment", label: "Entertainment", icon: Clapperboard, from: "#7C3AED", to: "#06B6D4" },
  { path: "/health", label: "Health", icon: HeartPulse, from: "#4F46E5", to: "#7C3AED" },
  { path: "/science", label: "Science", icon: FlaskConical, from: "#06B6D4", to: "#4F46E5" },
  { path: "/sports", label: "Sports", icon: Volleyball, from: "#3B82F6", to: "#7C3AED" },
];

const CategoryPills = () => {
  return (
    <div className="flex flex-wrap gap-2.5">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.path}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          <Link
            to={cat.path}
            style={{ "--from": cat.from, "--to": cat.to }}
            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full border border-line
                       bg-white/[0.03] text-ink-300 text-[13px] font-medium overflow-hidden
                       transition-all duration-300 hover:scale-105 hover:text-white hover:border-transparent"
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, var(--from), var(--to))" }}
            />
            <span
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-300 -z-10"
              style={{ background: "linear-gradient(135deg, var(--from), var(--to))" }}
            />
            <cat.icon size={14} className="relative z-10" />
            <span className="relative z-10">{cat.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryPills;
