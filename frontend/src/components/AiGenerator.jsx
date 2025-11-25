import React, { useState } from 'react';
import { generateText } from '../services/api';
import { FiCpu } from 'react-icons/fi';
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
      setResult('Failed to generate text. Is your API key correct?');
    }
    setIsLoading(false);
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
          <FiCpu size={20} />
        </div>
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
          Generador de Texto AI
        </span>
      </h2>
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-blue-900/10 p-4 rounded-lg border-2 border-purple-200/30 dark:border-purple-500/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Introduce tu prompt aquí..."
          className="w-full h-24 p-2 border border-purple-300/50 dark:border-purple-600/50 rounded-md bg-light-card dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`mt-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            isLoading 
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white animate-ai-shimmer bg-[length:200%_100%] shadow-lg' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {isLoading ? 'Generando...' : 'Generar Texto'}
        </button>
        {isLoading && (
          <div className="mt-4">
            <AiLoadingIndicator />
          </div>
        )}
        {result && !isLoading && (
          <div className="mt-4 p-4 bg-light-card dark:bg-dark-card rounded-lg border-2 border-purple-200/30 dark:border-purple-500/30 animate-ai-fade-in">
            <h3 className="font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Texto Generado:</h3>
            <pre className="whitespace-pre-wrap font-sans text-light-text dark:text-dark-text">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGenerator;
