import React, { useRef, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import NewsBar from "./NewsBar";
import Weather from "./Weather";
import HomePage from "./HomePage";
import "./App.css";
import Footer from "./Footer";
import Background from "./Background";


//============================================================================
// LenisProvider: Wraps the app and enables smooth scrolling
//============================================================================
function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    function raf(time) {
      lenisRef.current?.lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}

//============================================================================
// Scroll helper for navigation links
//============================================================================
export function useScrollTo() {
  const lenis = useLenis();

  const scrollTo = (id) => {
    lenis?.scrollTo(`#${id}`, {
      offset: -80,
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return scrollTo;
}



function App() {
  return (
    <Router>
      <LenisProvider>
      <div className="app-container">
        <Background />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/general" element={<NewsBar key="general" category="general" />} />
          <Route path="/business" element={<NewsBar key="business" category="business" />} />
          <Route path="/entertainment" element={<NewsBar key="entertainment" category="entertainment" />} />
          <Route path="/health" element={<NewsBar key="health" category="health" />} />
          <Route path="/science" element={<NewsBar key="science" category="science" />} />
          <Route path="/sports" element={<NewsBar key="sports" category="sports" />} />
          <Route path="/technology" element={<NewsBar key="technology" category="technology" />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
        <Footer />
      </div>
      </LenisProvider>
    </Router>
  );
}

// Full-page weather component
const WeatherPage = () => {
  return (
    <div className="min-h-[70vh] px-5 py-16 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <Weather />
      </div>
    </div>
  );
};

export default App;