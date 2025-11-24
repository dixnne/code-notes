// frontend/src/components/NotebookCard.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiMoreVertical, FiEdit2, FiTrash2, FiShare2, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext'; // Importar contexto para saber si soy dueño

export default function NotebookCard({ notebook, onEdit, onDelete, onShare }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();

  // Verificar si el usuario actual es el dueño
  const isOwner = user && notebook.ownerId === user.id;
  const isShared = notebook.collaborators && notebook.collaborators.length > 0;
  const isSharedWithMe = !isOwner;

  const formattedDate = new Date(notebook.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleEditClick = (e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); onEdit(notebook); };
  const handleDeleteClick = (e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); onDelete(notebook.id); };
  // Nuevo manejador para compartir
  const handleShareClick = (e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); onShare(notebook); };

  return (
    <div className="relative group block h-full">
      <Link
        to={`/notebooks/${notebook.id}`}
        className="flex h-full flex-col justify-between rounded-lg border border-black/5 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/50 dark:border-white/10 dark:bg-gray-800"
      >
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isSharedWithMe ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'}`}>
                    {isSharedWithMe ? <FiUsers size={20} /> : <FiBook size={20} />}
                </div>
                <div>
                    <h3 className="font-display text-lg font-bold text-gray-900 truncate dark:text-white group-hover:text-primary transition-colors">
                    {notebook.title}
                    </h3>
                    {isSharedWithMe && notebook.owner && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">de {notebook.owner.username}</p>
                    )}
                </div>
            </div>
          </div>
          <div className="h-4"></div>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
          {/* Indicador visual si yo lo compartí con otros */}
          {isOwner && isShared && (
              <span className="flex items-center gap-1 text-xs text-blue-500" title="Compartido">
                  <FiUsers />
              </span>
          )}
        </div>
      </Link>

      {/* Botón de Menú (Solo visible si soy el DUEÑO) */}
      {isOwner && (
        <div className="absolute top-4 right-4" ref={menuRef}>
            <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
            <FiMoreVertical size={18} />
            </button>

            {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-40 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-gray-800 animate-in fade-in zoom-in duration-100">
                <button onClick={handleShareClick} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <FiShare2 size={14} className="text-blue-500" /> Compartir
                </button>
                <button onClick={handleEditClick} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <FiEdit2 size={14} className="text-primary" /> Renombrar
                </button>
                <button onClick={handleDeleteClick} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors border-t border-black/5 dark:border-white/5">
                    <FiTrash2 size={14} /> Eliminar
                </button>
            </div>
            )}
        </div>
      )}
    </div>
  );
}