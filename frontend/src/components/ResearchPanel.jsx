import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/api';
import { FiSearch, FiChevronDown, FiX, FiSend, FiCpu } from 'react-icons/fi';
import AiLoadingIndicator from './AiLoadingIndicator';

const ResearchPanel = ({ onInsertText }) => {
  const [isOpen, setIsOpen] = useState(false); // Iniciamos cerrado por defecto para no estorbar
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const newHistory = [...history, { type: 'user', text: query }];
    setHistory(newHistory);
    setQuery(''); // Limpiar input inmediatamente
    
    try {
      const response = await generateText(query);
      setHistory([...newHistory, { type: 'ai', text: response.data }]);
    } catch (error) {
      console.error('Error in research query:', error);
      setHistory([...newHistory, { type: 'ai', text: 'Lo siento, hubo un error al conectar con la IA. Verifica tu configuración.' }]);
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-gradient-to-r from-primary to-accent1 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          title="Abrir Asistente IA"
        >
          <FiSearch size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[60vh] bg-light-card dark:bg-dark-card shadow-2xl rounded-xl flex flex-col z-50 border border-primary/20 dark:border-accent1/20 overflow-hidden animate-fade-in-up transition-all duration-300">
      
      {/* --- Header del Panel --- */}
      <div className="flex justify-between items-center p-4 border-b border-light-text-secondary/10 dark:border-dark-text-secondary/10 bg-gradient-to-r from-primary/5 to-accent1/5">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent1 text-white shadow-sm">
            <FiCpu size={16} />
          </div>
          <span className="bg-gradient-to-r from-primary via-accent1 to-primary bg-clip-text text-transparent font-display text-lg">
            Asistente de Investigación
          </span>
        </h3>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-light-text-secondary hover:text-primary dark:text-dark-text-secondary dark:hover:text-accent1 transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* --- Área de Chat --- */}
      <div className="flex-1 p-4 overflow-y-auto bg-light-bg/50 dark:bg-dark-bg/50 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {history.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center text-light-text-secondary/60 dark:text-dark-text-secondary/60 text-sm px-4 opacity-70">
              <FiSearch size={32} className="mb-3 text-primary/40" />
              <p>Pregúntame sobre conceptos, código o documentación.</p>
           </div>
        )}

        {history.map((item, index) => (
          <div key={index} className={`flex flex-col ${item.type === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm border ${
              item.type === 'user' 
                ? 'bg-primary text-white border-primary rounded-tr-none' 
                : 'bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text border-light-text-secondary/10 dark:border-dark-text-secondary/10 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap font-sans leading-relaxed">{item.text}</p>
            </div>
            
            {/* Botón de acción para respuestas de IA */}
            {item.type === 'ai' && (
              <button 
                onClick={() => onInsertText(item.text)} 
                className="mt-2 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-accent1/10 text-accent1 hover:bg-accent1 hover:text-white transition-all duration-200 border border-accent1/20 group"
              >
                <FiChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform"/> Insertar en nota
              </button>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-center py-2">
            <AiLoadingIndicator text="Procesando..." className="scale-90" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Footer / Input --- */}
      <div className="p-3 border-t border-light-text-secondary/10 dark:border-dark-text-secondary/10 bg-light-card dark:bg-dark-card">
        <div className="flex gap-2 items-end bg-light-bg dark:bg-dark-bg rounded-xl border border-light-text-secondary/20 dark:border-dark-text-secondary/20 p-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleQuery())}
            placeholder="Escribe tu consulta..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 resize-none max-h-24 py-2 px-1 scrollbar-hide"
            rows={1}
            style={{ minHeight: '2.5rem' }}
          />
          <button 
            onClick={handleQuery} 
            disabled={isLoading || !query.trim()} 
            className={`p-2 rounded-lg mb-0.5 transition-all duration-200 ${
              isLoading || !query.trim()
                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-accent1 text-white shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <FiSend size={16} className={isLoading ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;