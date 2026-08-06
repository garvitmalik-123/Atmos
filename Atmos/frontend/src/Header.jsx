import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { actionCreator } from "./Store";
import Logo from "./assets/Atmos_Logo-removebg-preview.png";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/general", label: "General" },
  { path: "/business", label: "Business" },
  { path: "/entertainment", label: "Entertainment" },
  { path: "/health", label: "Health" },
  { path: "/science", label: "Science" },
  { path: "/sports", label: "Sports" },
  { path: "/technology", label: "Technology" },
  { path: "/weather", label: "Weather" },
];

const countries = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "in", name: "India" },
  { code: "ca", name: "Canada" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const country = useSelector((state) => state.country);
  const dispatch = useDispatch();
  const { countryChange } = bindActionCreators(actionCreator, dispatch);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-4">
      <div
        className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-night/70 backdrop-blur-2xl border border-line shadow-card"
            : "bg-white/[0.03] backdrop-blur-xl border border-line/70"
        }`}
      >
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="relative">
                <img src={Logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <span className="absolute inset-0 rounded-lg bg-brand-gradient blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
              </span>
              <span className="font-display text-lg font-bold text-ink-100 tracking-tight">
                ATMOS<span className="text-brand-violet">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-3.5 py-2 text-[13px] font-medium text-ink-500 hover:text-ink-100 transition-colors"
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] bg-brand-gradient rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] bg-white/20 rounded-full scale-x-0 hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Country selector (segmented pill) + mobile toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-0.5 bg-black/30 border border-line !rounded-full px-1 py-1">
                <Globe size={13} className="text-ink-500 ml-1.5 mr-0.5" />
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => countryChange(c.code)}
                    title={c.name}
                    className={`relative px-2.5 py-1 rounded-full text-[11px] font-mono uppercase font-semibold transition-colors ${
                      country === c.code ? "text-white" : "text-ink-500 hover:text-ink-100"
                    }`}
                  >
                    {country === c.code && (
                      <motion.span
                        layoutId="country-pill"
                        className="absolute inset-0 bg-brand-gradient rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {c.code}
                  </button>
                ))}
              </div>

              <button
                className="icon-btn lg:hidden"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden max-w-6xl mx-auto mt-2 rounded-3xl bg-night/95 backdrop-blur-2xl border border-line"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-brand-gradient-soft text-ink-100"
                      : "text-ink-500 hover:text-ink-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => countryChange(c.code)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase font-semibold ${
                      country === c.code ? "bg-brand-gradient text-white" : "border border-line text-ink-500"
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
