// frontend/src/components/NoteList.jsx
import { FiPlus, FiTrash } from 'react-icons/fi';

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}) {
  return (
    <div className="flex h-full flex-col border-r border-light-text-secondary/30 bg-light-card dark:border-dark-text-secondary/30 dark:bg-dark-card">
      {/* Botón de Nueva Nota (Estilos Corregidos) */}
      <div className="p-4">
        <button
          onClick={onCreateNote}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-white transition-all duration-200 hover:bg-opacity-90 dark:bg-accent1 dark:text-dark-bg dark:hover:bg-accent2"
        >
          <FiPlus className="mr-2" />
          Nueva Nota
        </button>
      </div>

      {/* Lista de Notas */}
      <div className="flex-1 overflow-y-auto">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`
                group relative cursor-pointer px-4 py-3
                ${
                  activeNoteId === note.id
                    ? 'bg-primary/10 dark:bg-accent1/10'
                    : 'hover:bg-primary/5 dark:hover:bg-accent1/5'
                }
              `}
            >
              <h3
                className={`truncate font-semibold ${
                  activeNoteId === note.id
                    ? 'text-primary dark:text-accent1'
                    : 'text-light-text dark:text-dark-text'
                }`}
              >
                {note.title || 'Nueva Nota'}
              </h3>
              <p className="truncate text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {note.content ? note.content.substring(0, 40) + '...' : 'Sin contenido...'}
              </p>

              {/* Botón de Eliminar */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evitar que se seleccione la nota al borrarla
                  onDeleteNote(note.id);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-light-text-secondary opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 dark:text-dark-text-secondary dark:hover:text-red-400"
                title="Eliminar nota"
              >
                <FiTrash size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
            No hay notas. ¡Crea una!
          </p>
        )}
      </div>
    </div>
  );
}

