// TickEasy Logo Component
const TickEasyLogo = ({
  size = "small",
  showTagline = false,
  className = "",
}: {
  size?: "small" | "medium" | "large";
  showTagline?: boolean;
  className?: string;
}) => {
  const sizeClasses = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl",
  };

  const taglineSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Main Logo */}
      <div
        className={`${sizeClasses[size]} font-bold relative group cursor-pointer transition-all duration-300 hover:scale-105`}
      >
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-800 to-purple-900 rounded-lg blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>

        {/* Main text with gradient - enhanced for dark background */}
        <span className="relative bg-gradient-to-r from-blue-500 via-purple-700 to-purple-800 bg-clip-text text-transparent font-extrabold tracking-tight">
          Tick
        </span>
        <span className="relative bg-gradient-to-r from-purple-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent font-extrabold tracking-tight">
          Easy
        </span>

        {/* Sparkle effects */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1 left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-75"></div>
        <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* Tagline */}
      {showTagline && (
        <div
          className={`${taglineSizes[size]} text-gray-300 font-medium tracking-widest uppercase mt-2 relative`}
        >
          <div className="flex items-center justify-center space-x-1">
            <span className="opacity-80">Your Event</span>
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <span className="opacity-80">Our Responsibility</span>
          </div>

          {/* Subtle underline animation */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
        </div>
      )}
    </div>
  );
};

export default TickEasyLogo;
