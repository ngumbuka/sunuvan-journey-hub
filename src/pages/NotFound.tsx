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
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="mb-4 text-9xl font-display font-bold text-white opacity-90">404</h1>
        <h2 className="mb-6 text-4xl font-display font-bold text-white">Destination Not Found</h2>
        <p className="mb-8 text-xl text-white/90 max-w-md mx-auto">
          It seems you've taken a detour. Don't worry, even the best journeys have unexpected stops.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary bg-white hover:bg-white/90 rounded-md transition-colors duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
