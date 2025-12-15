import ResearchPanel from '../components/ResearchPanel';
import { FiChevronLeft, FiShare2, FiTag, FiSidebar, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getNotesForNotebook, createNote, deleteNote, updateNote } from '../services/api';
import { getFoldersForNotebook } from '../services/api';
import { getNotebooks } from '../services/api';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import DashboardLayout from '../components/DashboardLayout';
import ShareNotebookModal from '../components/ShareNotebookModal';

export default function NotebookDetailPage() {
  const { notebookId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedNoteId = searchParams.get('noteId');

  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [currentNotebook, setCurrentNotebook] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isResearchPanelOpen, setIsResearchPanelOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagMenuRef = useRef(null);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) {
        setIsTagMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tagMenuRef]);

  const loadData = useCallback(async () => {
    if (!notebookId) return;
    try {
      const [notesRes, foldersRes, notebooksRes] = await Promise.all([
        getNotesForNotebook(notebookId),
        getFoldersForNotebook(notebookId),
        getNotebooks()
      ]);

      const fetchedNotes = notesRes.data || [];
      const fetchedFolders = foldersRes.data || [];
      const allNotebooks = notebooksRes.data || [];

      const foundNotebook = allNotebooks.find(n => n.id === notebookId);
      setCurrentNotebook(foundNotebook || null);
      
      setNotes(fetchedNotes);
      setFolders(fetchedFolders);
      
      if (!activeNote && fetchedNotes.length > 0) {
        if (requestedNoteId) {
          const requestedNote = fetchedNotes.find(n => n.id === requestedNoteId);
          if (requestedNote) {
             setActiveNote(requestedNote);
          } else {
             setActiveNote(fetchedNotes[0]);
          }
        } else {
          setActiveNote(fetchedNotes[0]);
        }
      }
    } catch (error) {
      console.error("DEBUG: Error al cargar datos:", error);
    }
  }, [notebookId, activeNote, requestedNoteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allTags = useMemo(() => {
    const tags = new Set();
    notes.forEach(note => {
        if (note.tags) {
            note.tags.forEach(t => tags.add(t.tag.name));
        }
    });
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (selectedTags.length === 0) return notes;
    return notes.filter(note => {
        if (!note.tags) return false;
        return note.tags.some(t => selectedTags.includes(t.tag.name));
    });
  }, [notes, selectedTags]);

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const startResizing = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault(); 
    const startX = e.clientX;
    const startWidth = sidebarRef.current ? sidebarRef.current.getBoundingClientRect().width : 300;
    const doDrag = (dragEvent) => {
        let newWidth = startWidth + (dragEvent.clientX - startX);
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 600) newWidth = 600; 
        if (sidebarRef.current) sidebarRef.current.style.width = `${newWidth}px`;
    };
    const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; 
  }, []);

  const handleSelectNote = (note) => setActiveNote(note);
  const handleCreateNote = async (type, folderId = null) => {
    if (!notebookId) return;
    try {
      const response = await createNote("Nueva Nota", notebookId, type, folderId);
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

  const handleInsertText = async (text) => {
    if (activeNote) {
      const newContent = activeNote.content ? `${activeNote.content}\n\n${text}` : text;
      const updatedNote = { ...activeNote, content: newContent };
      setActiveNote(updatedNote);
      
      try {
        const response = await updateNote(activeNote.id, { content: newContent });
        handleNoteUpdate(response.data);
      } catch (error) {
        console.error('Error saving inserted text:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      {/* Header Bar: Uso de light-card/dark-card y bordes suaves con colores de marca */}
      <div className="flex h-14 items-center justify-between border-b border-primary/10 bg-light-card px-6 dark:border-secondary/10 dark:bg-dark-card transition-colors duration-300 font-sans">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
                isSidebarOpen 
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary' 
                : 'text-light-text-secondary hover:bg-light-bg hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg dark:hover:text-secondary'
            }`}
          >
            <FiSidebar size={18} />
          </button>

          {/* Separador sutil usando color primario muy transparente */}
          <div className="h-4 w-[1px] bg-primary/20 dark:bg-secondary/20 mx-1"></div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-light-text-secondary transition-colors hover:text-primary dark:text-dark-text-secondary dark:hover:text-secondary"
          >
            <FiChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          
          {currentNotebook && (
             // Uso de font-display para el título del notebook (Marca)
             <span className="ml-2 text-sm font-bold font-display text-primary dark:text-secondary hidden sm:inline animate-ai-fade-in">
                / {currentNotebook.title}
             </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={tagMenuRef}>
              <button 
                onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all shadow-sm ${
                    selectedTags.length > 0 
                    // Estado Activo: Acento 1 (Naranja vibrante)
                    ? 'bg-accent1 text-white hover:bg-accent1/90 shadow-md ring-2 ring-accent1/20' 
                    // Estado Inactivo: Fondo crema/oscuro
                    : 'bg-light-bg text-light-text hover:bg-secondary/80 dark:bg-dark-bg dark:text-dark-text dark:hover:bg-gray-800 border border-primary/10 dark:border-secondary/10'
                }`}
              >
                <FiTag className={`h-4 w-4 ${selectedTags.length > 0 ? 'text-white' : 'text-primary dark:text-secondary'}`} />
                {selectedTags.length > 0 ? `Filtrando (${selectedTags.length})` : 'Filtrar Tags'}
              </button>
              
              {isTagMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-primary/10 bg-light-card shadow-xl dark:border-secondary/10 dark:bg-dark-card z-50 overflow-hidden ring-1 ring-primary/5">
                    <div className="p-3 border-b border-primary/5 dark:border-secondary/5 bg-light-bg/50 dark:bg-dark-bg/50">
                        <span className="text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider font-display">Selecciona etiquetas</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                        {allTags.length === 0 ? (
                            <p className="px-3 py-4 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary italic">No hay tags en este notebook.</p>
                        ) : (
                            allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTagFilter(tag)}
                                    className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                      selectedTags.includes(tag) 
                                        // Tag seleccionado: Fondo primary suave, texto primary
                                        ? 'bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-secondary' 
                                        : 'text-light-text hover:bg-light-bg dark:text-dark-text dark:hover:bg-dark-bg'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <FiTag size={12} className={selectedTags.includes(tag) ? 'text-accent1' : 'text-light-text-secondary'} />
                                        {tag}
                                    </span>
                                    {selectedTags.includes(tag) && <FiCheck className="text-accent1" />}
                                </button>
                            ))
                        )}
                    </div>
                    {selectedTags.length > 0 && (
                        <div className="p-2 border-t border-primary/5 dark:border-secondary/5 bg-light-bg dark:bg-dark-bg">
                            <button 
                                onClick={() => { setSelectedTags([]); setIsTagMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-accent1 hover:bg-accent1/10 rounded transition-colors"
                            >
                                <FiX size={12} /> Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
              )}
          </div>

          <button 
            onClick={() => setIsShareModalOpen(true)}
            disabled={!currentNotebook}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary/10 dark:text-secondary dark:border-primary/30 dark:hover:bg-primary dark:hover:text-white"
          >
            <FiShare2 className="h-4 w-4" />
            Compartir
          </button>
           
           {/* Botón Investigar: Reemplazo de gradiente púrpura por gradiente de marca (Primary -> Accent1) */}
           <button
            onClick={() => setIsResearchPanelOpen(!isResearchPanelOpen)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
              isResearchPanelOpen
                ? 'bg-gradient-to-r from-primary to-accent1 text-white shadow-lg scale-105 shadow-primary/20'
                : 'bg-light-bg border border-primary/20 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent1 hover:text-white hover:border-transparent hover:shadow-lg hover:scale-105 dark:bg-dark-bg dark:text-secondary dark:hover:text-white'
            }`}
          >
            <FiSearch className="h-4 w-4" />
            Investigar
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-14rem)] w-full overflow-hidden relative">
        {/* Sidebar: Fondo de tarjeta (Blanco/Gris Azulado) */}
        <div ref={sidebarRef} className={`relative flex-shrink-0 h-full bg-light-card dark:bg-dark-card border-r border-primary/10 dark:border-secondary/10 ${!isSidebarOpen ? 'hidden' : ''}`} style={{ width: '300px' }}>
            <NoteList
                notes={filteredNotes} 
                folders={folders}
                notebookId={notebookId}
                activeNoteId={activeNote?.id}
                onSelectNote={handleSelectNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDeleteNote}
                onRefresh={loadData}
            />
            {/* Resizer con color primario */}
            <div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 hover:bg-primary transition-colors ${isResizing ? 'bg-primary w-1' : 'bg-transparent'}`} onMouseDown={startResizing} />
        </div>

        {/* Main Content: Fondo principal (Crema/Azul Oscuro) */}
        <div className="flex-1 h-full overflow-hidden bg-light-bg dark:bg-dark-bg min-w-0">
          {activeNote && activeNote.id ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              onNoteUpdated={handleNoteUpdate}
              availableTags={allTags}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-light-text-secondary dark:text-dark-text-secondary flex-col gap-4 opacity-60">
              <FiSidebar size={48} strokeWidth={1} className="text-primary dark:text-secondary" />
              <p className="text-lg font-medium font-display">Selecciona una nota para editar o crea una nueva.</p>
            </div>
          )}
        </div>
      </div>

      <ShareNotebookModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} notebook={currentNotebook} />
      {isResearchPanelOpen && <ResearchPanel onInsertText={handleInsertText} />}
    </DashboardLayout>
  );
}