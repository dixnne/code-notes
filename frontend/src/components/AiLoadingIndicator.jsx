import React from 'react';

const AiLoadingIndicator = ({ text = "La IA está pensando", className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center gap-1">
        {/* Puntos animados usando los colores de la marca: Primary -> Accent1 */}
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent1 animate-ai-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent1 animate-ai-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent1 animate-ai-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
      {/* Texto con efecto shimmer usando colores de marca */}
      <span className="text-sm font-medium bg-gradient-to-r from-primary via-accent1 to-primary bg-clip-text text-transparent animate-ai-shimmer bg-[length:200%_100%]">
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
      className={`relative overflow-hidden group transition-all duration-300 rounded-lg shadow-sm hover:shadow-md ${className} ${
        isLoading 
          ? 'animate-ai-shimmer bg-gradient-to-r from-primary via-accent2 to-accent1 bg-[length:200%_100%] cursor-wait' 
          : 'bg-gradient-to-r from-primary to-accent1 hover:opacity-90 active:scale-95'
      } text-white`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ai-shimmer bg-[length:200%_100%]"></div>
      )}
      <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-90' : ''}`}>
        {children}
      </span>
    </button>
  );
};

export const AiResponseBox = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-primary/10 bg-light-card dark:bg-dark-card p-6 shadow-sm animate-ai-fade-in ${className}`}>
      {/* Fondo sutil con gradiente de marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent1/5 pointer-events-none"></div>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent1/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ai-shimmer bg-[length:200%_100%] pointer-events-none"></div>
      
      <div className="relative z-10 text-light-text dark:text-dark-text font-sans">
        {children}
      </div>
    </div>
  );
};

export default AiLoadingIndicator;