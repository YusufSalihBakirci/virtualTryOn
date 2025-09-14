import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import CardSwap, { Card } from "./components/CardSwap";
import MobileMenu from "./components/MobileMenu";
import AnimatedContent from "./components/AnimatedContent";
import HowItWorks from "./components/HowItWorks";
import Particles from "./components/Particles";
import HeroSection from "./components/HeroSecion";
import ExploreCollection from "./components/ExploreCollection";
import Footer from "./components/Footer";
import ReadyToFind from "./components/ReadyToFind";
import Contact from "./components/Contact";


const App = () => {
  useEffect(() => {
    //  Sayfa ilk yüklendiğinde en üste kaydır
    if (typeof window !== "undefined") {
      const isInitialLoad = !window.hasLoadedBefore;

      if (isInitialLoad) {
        window.hasLoadedBefore = true;

        const setTop = () => {
          if (typeof document !== "undefined") {
            if (typeof document.documentElement.scrollTop !== "undefined") {
              document.documentElement.scrollTop = 0;
            }
            if (
              document.body &&
              typeof document.body.scrollTop !== "undefined"
            ) {
              document.body.scrollTop = 0;
            }
          }
          if (typeof window.scrollTo === "function") {
            window.scrollTo(0, 0);
          }
        };

        setTop();
        window.requestAnimationFrame(() => setTop());
        setTimeout(() => setTop(), 100);
      }
    }
  }, []);
  return (
    <div className="min-h-screen w-full relative ">
      {/* Particles Background - Tüm sayfa arka planı */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-900 to-black">
        <Particles
          particleCount={450}
          particleSpread={10}
          speed={0.1}
          alphaParticles={true}
          moveParticlesOnHover={false}
          sizeRandomness={1}
          particleBaseSize={100}
          disableRotation={false}
          particleColors={["#60a5fa", "#a78bfa", "#93c5fd", "#ffffff"]}
          className="w-full h-full"
        />
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:block relative z-10000">
        <Navbar />
      </div>

      {/* Mobile Menu */}
      <div className="block md:hidden relative z-50">
        <MobileMenu />
      </div>

      {/* Ana içerik container */}
      <div className="relative z-10 mb-20 ">
        {/* Hero Section */}
        <HeroSection />
        {/* How It Works Section */}
        <HowItWorks />
        {/* Explore Collection Section */}
        <ExploreCollection />
      </div>

      {/* Ready To Find */}
      <ReadyToFind />
      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
