// frontend/src/pages/NotebookDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// --- CAMBIO: Importamos 'deleteNote' ---
import { getNotesForNotebook, deleteNote } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';

export default function NotebookDetailPage() {
  const { notebookId } = useParams();
  
  console.log('Cargando Notebook ID:', notebookId);

  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las notas del notebook al montar la página
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const res = await getNotesForNotebook(notebookId);
        setNotes(res.data);
        if (res.data.length > 0) {
          setCurrentNote(res.data[0]);
        } else {
          setCurrentNote(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error al cargar las notas:', err);
        setError('No se pudieron cargar las notas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [notebookId]);

  const onNoteUpdated = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    if (currentNote && currentNote.id === updatedNote.id) {
      setCurrentNote(updatedNote);
    }
  };

  const onNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote); 
  };

  // --- CAMBIO: Nueva función para manejar la eliminación ---
  const handleDeleteNote = async (noteId) => {
    // 1. Confirmación del usuario
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      // 2. Llamada a la API
      await deleteNote(noteId);

      // 3. Actualizar el estado local
      const newNotes = notes.filter((note) => note.id !== noteId);
      setNotes(newNotes);

      // 4. Ajustar la nota activa
      if (currentNote && currentNote.id === noteId) {
        // Si la nota eliminada era la activa, selecciona la primera
        // de la nueva lista, o null si la lista está vacía.
        setCurrentNote(newNotes.length > 0 ? newNotes[0] : null);
      }
    } catch (err) {
      console.error('Error al eliminar la nota:', err);
      alert('No se pudo eliminar la nota. Inténtalo de nuevo.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4.1rem)] w-full">
        <div className="h-full w-1/4 max-w-sm overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <NoteList
            notes={notes}
            notebookId={Number(notebookId)}
            currentNoteId={currentNote?.id}
            onSelectNote={setCurrentNote}
            onNoteCreated={onNoteCreated}
            onDeleteNote={handleDeleteNote} // <-- 5. Pasamos la nueva prop
          />
        </div>

        <div className="h-full w-3/4 flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
              Cargando notas...
            </div>
          )}
          {!isLoading && !error && currentNote && (
            <NoteEditor
              note={currentNote}
              onNoteUpdated={onNoteUpdated}
            />
          )}
          {!isLoading && !error && !currentNote && (
            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <p className="text-xl">No hay notas seleccionadas.</p>
              <p>Selecciona una nota de la lista o crea una nueva.</p>
            </div>
          )}
          {error && (
             <div className="flex h-full items-center justify-center text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

