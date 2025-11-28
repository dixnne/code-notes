import React, { useState } from 'react';
import { generateText } from '../services/api';
import { FiCpu, FiZap } from 'react-icons/fi';
import AiLoadingIndicator from './AiLoadingIndicator';

const AiGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const response = await generateText(prompt);
      setResult(response.data);
    } catch (error) {
      console.error('Error generating text:', error);
      setResult('Error al generar texto. Por favor verifica tu API key en configuración.');
    }
    setIsLoading(false);
  };

  return (
    <div className="my-6 w-full max-w-4xl mx-auto">
      {/* Encabezado con Identidad de Marca */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3 font-display">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent1 text-white shadow-md">
          <FiCpu size={20} />
        </div>
        <span className="bg-gradient-to-r from-primary to-accent1 bg-clip-text text-transparent">
          Generador de Contenido IA
        </span>
      </h2>

      {/* Contenedor Principal con Estilos de Tarjeta */}
      <div className="bg-light-card dark:bg-dark-card p-1 rounded-xl shadow-lg border border-black/5 dark:border-white/5">
        <div className="bg-gradient-to-br from-primary/5 to-accent1/5 dark:from-primary/10 dark:to-accent1/10 p-5 rounded-lg">
            
            {/* Área de Entrada */}
            <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe qué necesitas (ej: 'Explica el ciclo de vida de React', 'Genera una lista de tareas para un proyecto Node.js')..."
            className="w-full h-32 p-4 border border-light-text-secondary/20 dark:border-dark-text-secondary/20 rounded-xl bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm leading-relaxed shadow-inner"
            />
            
            {/* Barra de Acción */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-md ${
                    isLoading 
                        ? 'bg-gradient-to-r from-primary via-accent1 to-primary text-white animate-ai-shimmer bg-[length:200%_100%] cursor-wait' 
                        : 'bg-gradient-to-r from-primary to-accent1 text-white hover:shadow-lg hover:scale-105 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100'
                    }`}
                >
                    {isLoading ? (
                        <>Generando...</>
                    ) : (
                        <><FiZap className="fill-current" /> Generar con IA</>
                    )}
                </button>
            </div>

            {/* Indicador de Carga */}
            {isLoading && (
            <div className="mt-8 flex justify-center">
                <AiLoadingIndicator />
            </div>
            )}

            {/* Área de Resultados */}
            {result && !isLoading && (
            <div className="mt-6 animate-ai-fade-in">
                <div className="relative p-6 bg-light-bg dark:bg-dark-bg rounded-xl border border-primary/20 dark:border-accent1/20 shadow-sm">
                    {/* Etiqueta Flotante */}
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-primary to-accent1 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        Respuesta Generada
                    </div>
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-light-text dark:text-dark-text bg-transparent border-none p-0 m-0">
                            {result}
                        </pre>
                    </div>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiGenerator;