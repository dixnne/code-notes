import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNotesForNotebook, createNote, deleteNote, getFoldersForNotebook } from '../services/api';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import DashboardLayout from '../components/DashboardLayout';
import { FiChevronLeft, FiShare2, FiTag, FiSidebar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function NotebookDetailPage() {
  const { notebookId } = useParams();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  
  // --- ESTADOS DE LA UI ---
  // Usamos useRef para el ancho para evitar re-renders mientras arrastras
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  // Carga de datos (sin cambios)
  const loadData = useCallback(async () => {
    if (!notebookId) return;
    try {
      const [notesRes, foldersRes] = await Promise.all([
        getNotesForNotebook(notebookId),
        getFoldersForNotebook(notebookId)
      ]);

      const fetchedNotes = notesRes.data || []; 
      const fetchedFolders = foldersRes.data || [];
      
      setNotes(fetchedNotes);
      setFolders(fetchedFolders);
      
      if (!activeNote && fetchedNotes.length > 0) {
        setActiveNote(fetchedNotes[0]);
      }
    } catch (error) {
      console.error("DEBUG: Error al cargar datos:", error);
    }
  }, [notebookId, activeNote]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- LÓGICA DE REDIMENSIONADO OPTIMIZADA ---
  const startResizing = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault(); // Evitar selección de texto
    
    const startX = e.clientX;
    const startWidth = sidebarRef.current ? sidebarRef.current.getBoundingClientRect().width : 300;

    const doDrag = (dragEvent) => {
        // Calculamos la diferencia
        let newWidth = startWidth + (dragEvent.clientX - startX);
        
        // Aplicamos límites (Mínimo 200px, Máximo 450px)
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 600) newWidth = 600; // Límite superior razonable

        // MANIPULACIÓN DIRECTA DEL DOM (Súper rápido, sin re-renders de React)
        if (sidebarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
        }
    };

    const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
        // Restaurar el cursor del body
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    // Añadir listeners al documento para seguir el mouse fuera del div
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // Cambiar cursor globalmente para mejor UX durante arrastre
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Evitar seleccionar texto al arrastrar
  }, []);
  // --- FIN LÓGICA REDIMENSIONADO ---

  const handleSelectNote = (note) => setActiveNote(note);

  const handleCreateNote = async (type, folderId = null) => {
    if (!notebookId) return;
    try {
      const response = await createNote("Nueva Nota", parseInt(notebookId), type, folderId);
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
    if (!window.confirm("¿Estás seguro?")) return;
    try {
      await deleteNote(noteId);
      const newNotes = notes.filter((note) => note.id !== noteId);
      setNotes(newNotes);
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(newNotes.length > 0 ? newNotes[0] : null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      {/* Sub-Barra de Navegación */}
      <div className="flex h-12 items-center justify-between border-b border-border-light bg-background-light px-6 dark:border-border-dark dark:bg-background-dark transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-md transition-colors ${
                isSidebarOpen 
                ? 'bg-primary/10 text-primary dark:bg-accent1/10 dark:text-accent1' 
                : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={isSidebarOpen ? "Ocultar lista" : "Mostrar lista"}
          >
            <FiSidebar size={18} />
          </button>

          <div className="h-4 w-[1px] bg-border-light dark:bg-border-dark mx-1"></div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-text-secondary transition-colors hover:text-primary dark:hover:text-accent1"
          >
            <FiChevronLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-light dark:hover:bg-surface-dark">
            <FiTag className="h-4 w-4" />
            Tags
          </button>
          <button className="flex items-center gap-2 rounded-md bg-accent1/10 px-3 py-1.5 text-sm font-medium text-accent1 transition-colors hover:bg-accent1/20">
            <FiShare2 className="h-4 w-4" />
            Compartir
          </button>
        </div>
      </div>

      {/* Contenedor Principal Flexible */}
      <div className="flex h-[calc(100vh-7rem)] w-full overflow-hidden relative">
        
        {/* Barra Lateral (Resizable) */}
        <div 
            ref={sidebarRef}
            className={`relative flex-shrink-0 h-full bg-surface-light dark:bg-surface-dark ${!isSidebarOpen ? 'hidden' : ''}`}
            style={{ width: '300px' }} // Ancho inicial por defecto
        >
            <NoteList
                notes={notes}
                folders={folders}
                notebookId={notebookId}
                activeNoteId={activeNote?.id}
                onSelectNote={handleSelectNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDeleteNote}
                onRefresh={loadData}
            />
            
            {/* --- MANIJA DE REDIMENSIONADO (RESIZER) --- */}
            {/* Es un div transparente de 4px sobre el borde derecho */}
            <div
                className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 hover:bg-primary/50 transition-colors
                    ${isResizing ? 'bg-primary w-1' : 'bg-transparent'} 
                `}
                onMouseDown={startResizing}
            />
        </div>

        {/* Área del Editor */}
        <div className="flex-1 h-full overflow-hidden bg-surface-light dark:bg-surface-dark min-w-0 border-l border-border-light dark:border-border-dark">
          {activeNote && activeNote.id ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              onNoteUpdated={handleNoteUpdate}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-text-secondary">
              <p>Selecciona una nota para editar o crea una nueva.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}