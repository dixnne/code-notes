// frontend/src/components/NotebookCard.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function NotebookCard({ notebook, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const formattedDate = new Date(notebook.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    onEdit(notebook);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    onDelete(notebook.id);
  };

  return (
    <div className="relative group block h-full">
      <Link
        to={`/notebooks/${notebook.id}`}
        // CORRECCIÓN: Usamos bg-light-card en lugar de bg-surface-light
        className="flex h-full flex-col justify-between rounded-lg border border-black/5 bg-light-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/50 dark:border-white/10 dark:bg-dark-card"
      >
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FiBook size={20} />
                </div>
                <h3 className="font-display text-lg font-bold text-light-text truncate dark:text-dark-text group-hover:text-primary transition-colors">
                {notebook.title}
                </h3>
            </div>
          </div>
          
          <div className="h-4"></div>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
          <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
            {formattedDate}
          </span>
        </div>
      </Link>

      {/* Botón de Menú */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="rounded-full p-1.5 text-light-text-secondary hover:bg-light-bg hover:text-light-text dark:text-dark-text-secondary dark:hover:bg-dark-bg dark:hover:text-dark-text transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <FiMoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 z-10 w-40 overflow-hidden rounded-lg border border-black/10 bg-light-card shadow-lg dark:border-white/10 dark:bg-dark-card animate-in fade-in zoom-in duration-100">
            <button
              onClick={handleEditClick}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-light-text hover:bg-light-bg dark:text-dark-text dark:hover:bg-dark-bg transition-colors"
            >
              <FiEdit2 size={14} className="text-primary" />
              Renombrar
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors border-t border-black/5 dark:border-white/5"
            >
              <FiTrash2 size={14} />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}