// ... (Imports iguales)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getNotesForNotebook, createNote, deleteNote } from '../services/api';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import DashboardLayout from '../components/DashboardLayout'; 

function NotebookDetailPage() {
  // ... (estados y loadNotes iguales)
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const { notebookId } = useParams();

  const loadNotes = useCallback(async () => {
    if (!notebookId) return;
    console.log(`DEBUG: Cargando Notebook ID: ${notebookId}.`);
    try {
      const response = await getNotesForNotebook(notebookId);
      const fetchedNotes = response.data || []; 
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0) {
        setActiveNote(fetchedNotes[0]);
      } else {
        setActiveNote(null);
      }
    } catch (error) {
      console.error("DEBUG: Error al cargar las notas:", error);
    }
  }, [notebookId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSelectNote = (note) => {
    setActiveNote(note);
  };

  // --- CAMBIO: Aceptamos 'type' como argumento ---
  const handleCreateNote = async (type) => {
    if (!notebookId) return;
    try {
      // Pasamos el tipo a la API
      const response = await createNote("Nueva Nota", parseInt(notebookId), type);
      const newNote = response.data;
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setActiveNote(newNote);
    } catch (error) {
      console.error("Error al crear la nota:", error);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes(prevNotes => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    if (activeNote && activeNote.id === updatedNote.id) {
        setActiveNote(updatedNote);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      return;
    }
    try {
      await deleteNote(noteId);
      const newNotes = notes.filter((note) => note.id !== noteId);
      setNotes(newNotes);
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(newNotes.length > 0 ? newNotes[0] : null);
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      alert("No se pudo eliminar la nota. Inténtalo de nuevo.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)] w-full">
        <NoteList
          notes={notes}
          activeNoteId={activeNote?.id}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote} // Se pasa la función que ahora acepta 'type'
          onDeleteNote={handleDeleteNote}
        />
        
        {activeNote && activeNote.id ? (
          <NoteEditor
            key={activeNote.id}
            note={activeNote}
            onNoteUpdated={handleNoteUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-surface-light dark:bg-surface-dark">
            <p>Selecciona una nota para editar o crea una nueva.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default NotebookDetailPage;