import React, { useState } from 'react';
import { generateText } from '../services/api';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';
import AiLoadingIndicator from './AiLoadingIndicator';

const ResearchPanel = ({ onInsertText }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    if (!query) return;
    setIsLoading(true);
    const newHistory = [...history, { type: 'user', text: query }];
    setHistory(newHistory);
    try {
      const response = await generateText(query);
      setHistory([...newHistory, { type: 'ai', text: response.data }]);
    } catch (error) {
      console.error('Error in research query:', error);
      setHistory([...newHistory, { type: 'ai', text: 'Sorry, I could not fetch a response.' }]);
    }
    setQuery('');
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setIsOpen(true)} className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark">
          <FiSearch size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[60vh] bg-light-card dark:bg-dark-card shadow-2xl rounded-lg flex flex-col z-50 border-2 border-transparent hover:border-purple-500/20 transition-all duration-300">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5">
        <h3 className="font-bold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
            <FiSearch size={16} />
          </div>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
            Asistente de Investigación
          </span>
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <FiX />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {history.map((item, index) => (
          <div key={index} className={`mb-4 animate-ai-fade-in ${item.type === 'user' ? 'text-right' : ''}`}>
            <div className={`p-2 rounded-lg inline-block ${item.type === 'user' ? 'bg-primary text-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-500/30'}`}>
              <p className={item.type === 'ai' ? 'text-light-text dark:text-dark-text' : ''}>{item.text}</p>
              {item.type === 'ai' && (
                <button onClick={() => onInsertText(item.text)} className="mt-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                  Insertar en Nota
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <AiLoadingIndicator />
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Pregunta algo..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-light-card dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={handleQuery} disabled={isLoading} className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            isLoading 
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white animate-ai-shimmer bg-[length:200%_100%] shadow-lg' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
          }`}>
            {isLoading ? 'Pensando...' : 'Preguntar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;
