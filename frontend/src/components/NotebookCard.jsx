// frontend/src/components/NotebookCard.jsx
import React from 'react';
import { PiBookOpenTextDuotone } from 'react-icons/pi';

const NotebookCard = ({ notebook }) => {
  const formattedDate = new Date(notebook.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    // Tarjeta actualizada con colores de tema
    <div className="bg-light-card dark:bg-dark-card/60 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 cursor-pointer">
      <div className="flex items-center space-x-3 mb-2">
        <PiBookOpenTextDuotone className="text-primary text-xl" />
        <h3 className="text-lg font-semibold font-display text-light-text dark:text-secondary truncate">
          {notebook.title}
        </h3>
      </div>
      <p className="text-sm text-light-text-secondary dark:text-gray-400">
        Modificado: {formattedDate}
      </p>
    </div>
  );
};

export default NotebookCard;

