import React from "react";
import { Link } from "react-router-dom";
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    categories: [
      { name: "General", path: "/general" },
      { name: "Business", path: "/business" },
      { name: "Technology", path: "/technology" },
      { name: "Sports", path: "/sports" },
    ],
    about: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  };

  const socials = [
    { Icon: FaXTwitter, href: "https://twitter.com" },
    { Icon: FaFacebookF, href: "https://facebook.com" },
    { Icon: FaLinkedinIn, href: "https://linkedin.com" },
    { Icon: FaGithub, href: "https://github.com" },
  ];

  return (
    <footer className="mt-auto glass !rounded-none !border-x-0 !border-b-0">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10 pb-11">
          <div>
            <h3 className="font-display text-xl font-bold text-ink-100">
              ATMOS<span className="text-brand-purple">.</span>
            </h3>
            <p className="text-sm text-ink-500 mt-3.5 leading-relaxed max-w-xs">
              Real-time news and live conditions from around the world, gathered
              into one premium daily briefing.
            </p>
            <div className="flex gap-2.5 mt-5">
              {socials.map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn hover:!text-white hover:!bg-brand-gradient hover:!border-transparent"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-100 mb-4">Categories</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ink-500 hover:text-brand-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-100 mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ink-500 hover:text-brand-cyan transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-100 mb-4">Newsletter</h4>
            <p className="text-sm text-ink-500 mb-3.5 leading-relaxed">
              Get the daily briefing delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-line text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-purple/50"
              />
              <button className="px-4 py-2.5 rounded-lg bg-brand-gradient text-white text-xs font-semibold whitespace-nowrap hover:opacity-90 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-violet/50 to-transparent" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11.5px] font-mono text-ink-500">
            &copy; {currentYear} Atmos. All rights reserved.
          </p>
          <p className="text-[11.5px] font-mono text-ink-500">
            Powered by{" "}
            <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">
              NewsAPI
            </a>{" "}
            &amp;{" "}
            <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">
              OpenWeather
            </a>
          </p>
        </div>
        <div className="pb-6 text-center">
          <p className="text-[11px] font-mono text-ink-700">
            Made with <span className="text-red-400">&#10084;</span> using React + Vite + Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
