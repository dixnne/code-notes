// frontend/src/components/NoteList.jsx
import { useState } from 'react';
// --- CAMBIO: Importamos FiPlus y FiTrash ---
import { FiPlus, FiTrash } from 'react-icons/fi';
import { createNote } from '../services/api';

// --- CAMBIO: Añadimos 'onDeleteNote' a las props ---
export default function NoteList({ notes, notebookId, currentNoteId, onSelectNote, onNoteCreated, onDeleteNote }) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await createNote('Nueva Nota', notebookId);
      onNoteCreated(res.data); // Pasamos la nueva nota al padre
    } catch (err) {
      console.error('Error al crear la nota:', err);
      alert('No se pudo crear la nota.');
    } finally {
      setIsCreating(false);
    }
  };

  const truncateText = (text, length) => {
    if (!text || text.length <= length) return text || "Sin contenido";
    return text.substring(0, length) + '...';
  };

  return (
    <div className="flex h-full flex-col">
      {/* Botón de crear nota */}
      <div className="p-4">
        <button
          onClick={handleCreateNote}
          disabled={isCreating}
          className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva Nota
        </button>
      </div>
      
      {/* Lista de notas */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {notes.map((note) => (
            <li 
              key={note.id}
              // --- CAMBIO: Se añade un div contenedor para el botón de eliminar ---
              className={`flex items-center justify-between transition-colors ${
                note.id === currentNoteId
                  ? 'bg-blue-100 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Botón principal para seleccionar */}
              <button
                onClick={() => onSelectNote(note)}
                className="w-full flex-1 px-4 py-3 text-left"
              >
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {note.title}
                </h4>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {truncateText(note.content, 50)}
                </p>
              </button>

              {/* --- CAMBIO: Botón para eliminar --- */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que onSelectNote se dispare
                  onDeleteNote(note.id);
                }}
                className="mr-3 flex-shrink-0 rounded-full p-2 text-text-light/40 transition-colors hover:bg-red-100 hover:text-red-500 dark:text-text-dark/40 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                aria-label="Eliminar nota"
              >
                <FiTrash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

