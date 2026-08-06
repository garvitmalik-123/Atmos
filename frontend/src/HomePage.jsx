import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CloudSun } from "lucide-react";
import HomepageNews from "./HomepageNews";
import Weather from "./Weather";
import FeaturedNews from "./FeaturedNews";
import HeroDashboard from "./HeroDashboard";
import CategoryPills from "./CategoryPills";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HomePage = () => {
  return (
    <div className="w-full flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-16 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            {/* Left column */}
            <div>
              <motion.div initial="hidden" animate="show" variants={fadeUp}>
                <span className="badge-glass">
                  <Sparkles size={12} className="text-brand-cyan" />
                  AI Powered &middot; Real&#8209;Time
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-6xl font-bold text-ink-100 leading-[1.05] mt-6"
              >
                Stay ahead with
                <br />
                <span className="text-gradient-animated">AI-powered</span>
                <br />
                Global Intelligence
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="text-ink-500 text-base md:text-lg mt-6 max-w-xl leading-relaxed"
              >
                Real-time news, weather insights and intelligent summaries powered by AI &mdash;{" "}
                {today}.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 mt-9"
              >
                <Link to="/general" className="btn-primary flex items-center gap-1.5">
                  Explore News <ArrowRight size={15} />
                </Link>
                <Link to="/weather" className="btn-glass flex items-center gap-1.5">
                  <CloudSun size={15} /> View Weather
                </Link>
              </motion.div>
            </div>

            {/* Right column: floating glass dashboard */}
            <HeroDashboard />
          </div>

          {/* category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16"
          >
            <CategoryPills />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-24 flex flex-col gap-16">
        {/* Top Stories + Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div>
            <SectionHeader eyebrow="Developing" title="Top Stories" />
            <HomepageNews />
          </div>
          <div>
            <SectionHeader eyebrow="Conditions" title="Weather" />
            <Weather />
          </div>
        </div>

        {/* Featured carousel */}
        <div>
          <SectionHeader eyebrow="Across the desk" title="Latest Headlines" />
          <FeaturedNews />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title }) => (
  <div className="mb-5">
    <span className="eyebrow">{eyebrow}</span>
    <h2 className="font-display text-2xl font-bold text-ink-100 mt-1">{title}</h2>
  </div>
);

export default HomePage;
