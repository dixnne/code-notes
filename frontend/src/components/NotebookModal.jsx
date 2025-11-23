import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { createNotebook, updateNotebook } from '../services/api';

export default function NotebookModal({ isOpen, onClose, onNotebookSaved, notebookToEdit = null }) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(notebookToEdit ? notebookToEdit.title : '');
      setError(null);
    }
  }, [isOpen, notebookToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      let savedNotebook;
      if (notebookToEdit) {
        const res = await updateNotebook(notebookToEdit.id, title);
        savedNotebook = res.data;
      } else {
        const res = await createNotebook(title);
        savedNotebook = res.data;
      }
      onNotebookSaved(savedNotebook, !!notebookToEdit);
      onClose();
    } catch (err) {
      console.error('Error al guardar notebook:', err);
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEdit = !!notebookToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-lg bg-light-card p-6 shadow-xl dark:bg-dark-card border border-black/10 dark:border-white/10">
        
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h3 className="font-display text-2xl font-bold text-light-text dark:text-dark-text">
            {isEdit ? 'Renombrar Notebook' : 'Crear Nuevo Notebook'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-light-text-secondary hover:bg-light-bg dark:text-dark-text-secondary dark:hover:bg-dark-bg transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Apuntes de Proyecto"
              autoFocus
              className="mt-1 block w-full rounded-lg border border-black/20 bg-light-bg px-3 py-2 text-light-text focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/20 dark:bg-dark-bg dark:text-dark-text focus:outline-none"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-bg dark:text-dark-text-secondary dark:hover:bg-dark-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Notebook')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}