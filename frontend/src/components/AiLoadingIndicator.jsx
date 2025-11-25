import React from 'react';

const AiLoadingIndicator = ({ text = "La IA está pensando", className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-ai-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-ai-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-ai-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent animate-ai-shimmer bg-[length:200%_100%]">
        {text}
      </span>
    </div>
  );
};

export const AiButton = ({ onClick, disabled, children, isLoading, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative overflow-hidden group transition-all duration-300 ${className} ${
        isLoading ? 'animate-ai-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_100%]' : ''
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ai-shimmer bg-[length:200%_100%]"></div>
      )}
      <span className={isLoading ? 'opacity-90' : ''}>{children}</span>
    </button>
  );
};

export const AiResponseBox = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 p-4 animate-ai-fade-in ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ai-shimmer bg-[length:200%_100%]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AiLoadingIndicator;
