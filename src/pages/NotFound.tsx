import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/not-found-hero.png"
          alt="Scenic road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in max-w-2xl mx-auto">
        <div className="bg-black/30 backdrop-blur-md border border-white/10 p-12 rounded-3xl shadow-2xl">
          <h1 className="mb-2 text-8xl font-display font-bold text-white tracking-widest">404</h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-8 rounded-full" />
          <h2 className="mb-6 text-3xl font-display font-bold text-white/90">Destination Not Found</h2>
          <p className="mb-10 text-lg text-white/80 max-w-md mx-auto leading-relaxed">
            It seems you've taken a detour off the map. Don't worry, every great journey has a few unexpected stops.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-white/90 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg group"
          >
            <span className="mr-2">Return to Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
