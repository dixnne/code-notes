// frontend/src/pages/NotebookDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- CORRECCIÓN DEL TYPO
import { getNotesForNotebook } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';

export default function NotebookDetailPage() {
  const { notebookId } = useParams();
  
  // Línea de depuración para confirmar que el nuevo código se está ejecutando
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
        // Seleccionar la primera nota por defecto, si existe
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
  }, [notebookId]); // Se vuelve a ejecutar si cambia el ID del notebook

  // Función para actualizar una nota en la lista local
  const onNoteUpdated = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    
    // Actualizar también la nota actual si es la que se editó
    if (currentNote && currentNote.id === updatedNote.id) {
      setCurrentNote(updatedNote);
    }
  };

  // Función para añadir una nueva nota a la lista
  const onNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote); // Seleccionar la nota recién creada
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4.1rem)] w-full">
        {/* --- Barra Lateral de Notas --- */}
        <div className="h-full w-1/4 max-w-sm overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <NoteList
            notes={notes}
            notebookId={Number(notebookId)}
            currentNoteId={currentNote?.id}
            onSelectNote={setCurrentNote}
            onNoteCreated={onNoteCreated}
          />
        </div>

        {/* --- Editor Principal --- */}
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

