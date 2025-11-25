import React, { useState } from 'react';
import { generateText } from '../services/api';
import { FiCpu } from 'react-icons/fi';

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
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <FiCpu className="mr-2" />
        Generador de Texto AI
      </h2>
      <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Introduce tu prompt aquí..."
          className="w-full h-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-light-card dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400"
        >
          {isLoading ? 'Generando...' : 'Generar Texto'}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-light-card dark:bg-dark-card rounded-md">
            <h3 className="font-semibold">Texto Generado:</h3>
            <pre className="whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGenerator;
