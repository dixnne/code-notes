// frontend/src/components/CreateNotebookModal.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { PiBookOpenTextDuotone } from 'react-icons/pi';

const CreateNotebookModal = ({ isOpen, onClose, onNotebookCreated }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/notebooks', { title });
      onNotebookCreated(response.data);
      handleClose();
    } catch (err) {
      console.error('Error al crear el notebook:', err);
      setError('No se pudo crear el notebook. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    // Fondo oscuro semi-transparente
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Panel del Modal actualizado con colores de tema */}
      <div
        className="bg-light-card dark:bg-dark-card w-full max-w-md rounded-lg shadow-xl p-6 border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-4">
          <PiBookOpenTextDuotone className="text-primary text-2xl" />
          <h2 className="text-xl font-bold text-light-text dark:text-white font-display">
            Crear Nuevo Notebook
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="block text-sm font-medium text-light-text-secondary dark:text-gray-300 mb-2">
            Título del Notebook
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Apuntes de React"
            className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-black/20 dark:border-white/20 rounded-md text-light-text dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />

          {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="py-2 px-4 rounded-md text-light-text-secondary dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 rounded-md bg-accent1 hover:bg-accent1/90 text-dark-bg font-bold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotebookModal;

