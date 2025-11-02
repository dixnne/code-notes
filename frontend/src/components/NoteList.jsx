// frontend/src/components/NoteList.jsx
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { createNote } from '../services/api';

export default function NoteList({ notes, notebookId, currentNoteId, onSelectNote, onNoteCreated }) {
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
            <li key={note.id}>
              <button
                onClick={() => onSelectNote(note)}
                className={`block w-full px-4 py-3 text-left transition-colors ${
                  note.id === currentNoteId
                    ? 'bg-blue-100 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {note.title}
                </h4>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {truncateText(note.content, 50)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
