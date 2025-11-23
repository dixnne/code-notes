import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiFileText, FiCode, FiChevronDown } from 'react-icons/fi';

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleCreate = (type) => {
    onCreateNote(type);
    setIsMenuOpen(false);
  };

  return (
    // CAMBIO: Fondo sólido (blanco/gris oscuro) en lugar de transparente/background
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      
      <div className="p-4 relative" ref={menuRef}>
        {/* CAMBIO: Botón con color primario sólido y sombra */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white shadow-md transition-all hover:bg-opacity-90 active:scale-95 dark:bg-accent1"
        >
          <div className="flex items-center gap-2 font-medium">
            <FiPlus className="text-lg" />
            <span>Nueva Nota</span>
          </div>
          <FiChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menú Desplegable con fondo sólido y bordes */}
        {isMenuOpen && (
            <div className="absolute left-4 right-4 top-16 z-20 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in zoom-in duration-100">
                <button onClick={() => handleCreate('markdown')} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <FiFileText />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nota Markdown</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Documentación y texto</span>
                    </div>
                </button>
                <button onClick={() => handleCreate('code')} className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <FiCode />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Snippet de Código</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Editor con resaltado</span>
                    </div>
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`
                group relative cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200
                ${
                  activeNoteId === note.id
                    // Activo: Fondo de color suave, borde de color primario
                    ? 'bg-blue-50 border-primary shadow-sm dark:bg-gray-800 dark:border-accent1' 
                    // Inactivo: Borde transparente, hover gris suave
                    : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50' 
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                {/* Iconos coloreados según tipo */}
                {note.type === 'code' ? (
                    <FiCode className={`w-4 h-4 flex-shrink-0 ${activeNoteId === note.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                ) : (
                    <FiFileText className={`w-4 h-4 flex-shrink-0 ${activeNoteId === note.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                )}
                
                <h3 className={`truncate text-sm font-semibold ${activeNoteId === note.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {note.title || 'Sin título'}
                </h3>
              </div>
              
              <p className="truncate text-xs text-gray-500 pl-6 dark:text-gray-400">
                {note.content ? note.content.substring(0, 40) : 'Sin contenido...'}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30"
                title="Eliminar nota"
              >
                <FiTrash size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 opacity-60">
             <p className="text-sm">No hay notas.</p>
             <p className="text-xs">¡Crea una nueva arriba!</p>
          </div>
        )}
      </div>
    </div>
  );
}