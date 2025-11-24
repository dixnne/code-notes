import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Filtrar sugerencias que no hayan sido seleccionadas ya
  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (name) => {
    const tag = name.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2" ref={wrapperRef}>
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="flex items-center gap-1 rounded-full bg-brand-base/10 px-2 py-1 text-xs font-medium text-brand-base dark:bg-brand-base/20 dark:text-brand-accent"
        >
          #{tag}
          <button onClick={() => removeTag(tag)} className="hover:text-red-500 focus:outline-none">
            <FiX size={12} />
          </button>
        </span>
      ))}
      
      <div className="relative flex items-center">
        <FiPlus size={14} className="absolute left-2 text-text-secondary z-10" />
        <input
          type="text"
          value={inputValue}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Añadir tag..."
          className="w-24 rounded-full border border-border-light bg-transparent py-1 pl-6 pr-2 text-xs text-text-primary focus:border-brand-base focus:outline-none focus:w-32 transition-all dark:border-border-dark relative z-10"
        />
        
        {/* Dropdown de Sugerencias */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-40 rounded-md border border-border-light bg-surface-light shadow-lg dark:border-border-dark dark:bg-surface-dark z-50 max-h-40 overflow-y-auto">
             {filteredSuggestions.map((suggestion, idx) => (
               <button
                 key={idx}
                 onClick={() => addTag(suggestion)}
                 className="block w-full px-3 py-2 text-left text-xs text-text-primary hover:bg-background-light dark:hover:bg-background-dark"
               >
                 #{suggestion}
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}