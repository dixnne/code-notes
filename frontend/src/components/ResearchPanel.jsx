import React, { useState } from 'react';
import { generateText } from '../services/api';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

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
    <div className="fixed bottom-4 right-4 w-96 h-[60vh] bg-light-card dark:bg-dark-card shadow-2xl rounded-lg flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold flex items-center gap-2"><FiSearch /> Asistente de Investigación</h3>
        <button onClick={() => setIsOpen(false)}><FiX /></button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {history.map((item, index) => (
          <div key={index} className={`mb-4 ${item.type === 'user' ? 'text-right' : ''}`}>
            <div className={`p-2 rounded-lg inline-block ${item.type === 'user' ? 'bg-primary text-white' : 'bg-light-bg dark:bg-dark-bg'}`}>
              <p>{item.text}</p>
              {item.type === 'ai' && (
                <button onClick={() => onInsertText(item.text)} className="mt-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  Insertar en Nota
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center">Cargando...</div>}
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
          <button onClick={handleQuery} disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400">
            Preguntar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;
