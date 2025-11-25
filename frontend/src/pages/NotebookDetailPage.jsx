import ResearchPanel from '../components/ResearchPanel';
import { FiChevronLeft, FiShare2, FiTag, FiSidebar, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getNotesForNotebook, createNote, deleteNote } from '../services/api';
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

  const handleInsertText = (text) => {
    if (activeNote) {
      const newContent = activeNote.content ? `${activeNote.content}\n\n${text}` : text;
      const updatedNote = { ...activeNote, content: newContent };
      setActiveNote(updatedNote);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-14 items-center justify-between border-b border-black/5 bg-light-card px-6 dark:border-white/10 dark:bg-dark-card transition-colors duration-300">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-md transition-colors ${
                isSidebarOpen 
                ? 'bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary' 
                : 'text-light-text-secondary hover:bg-light-bg dark:text-dark-text-secondary dark:hover:bg-dark-bg'
            }`}
          >
            <FiSidebar size={18} />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1"></div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-light-text-secondary transition-colors hover:text-primary dark:text-dark-text-secondary dark:hover:text-secondary"
          >
            <FiChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          
          {currentNotebook && (
             <span className="ml-2 text-sm font-bold text-light-text dark:text-dark-text hidden sm:inline fade-in">
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
                    ? 'bg-accent1 text-white hover:bg-accent2 shadow-md ring-2 ring-accent1/20' 
                    : 'bg-light-bg text-light-text hover:bg-gray-200 dark:bg-dark-bg dark:text-dark-text dark:hover:bg-gray-700 border border-black/5 dark:border-white/5'
                }`}
              >
                <FiTag className={`h-4 w-4 ${selectedTags.length > 0 ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'}`} />
                {selectedTags.length > 0 ? `Filtrando (${selectedTags.length})` : 'Filtrar Tags'}
              </button>
              
              {isTagMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-black/10 bg-light-card shadow-xl dark:border-white/10 dark:bg-dark-card z-50 overflow-hidden ring-1 ring-black/5">
                    <div className="p-3 border-b border-black/5 dark:border-white/5 bg-light-bg/50 dark:bg-dark-bg/50">
                        <span className="text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">Selecciona etiquetas</span>
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
                                        ? 'bg-accent1/10 text-accent1 font-medium' 
                                        : 'text-light-text hover:bg-light-bg dark:text-dark-text dark:hover:bg-dark-bg'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <FiTag size={12} className={selectedTags.includes(tag) ? 'text-accent1' : 'text-gray-400'} />
                                        {tag}
                                    </span>
                                    {selectedTags.includes(tag) && <FiCheck className="text-accent1" />}
                                </button>
                            ))
                        )}
                    </div>
                    {selectedTags.length > 0 && (
                        <div className="p-2 border-t border-black/5 dark:border-white/5 bg-light-bg dark:bg-dark-bg">
                            <button 
                                onClick={() => { setSelectedTags([]); setIsTagMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary/20 dark:text-secondary"
          >
            <FiShare2 className="h-4 w-4" />
            Compartir
          </button>
           <button
            onClick={() => setIsResearchPanelOpen(!isResearchPanelOpen)}
            className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-200"
          >
            <FiSearch className="h-4 w-4" />
            Investigar
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-14rem)] w-full overflow-hidden relative">
        <div ref={sidebarRef} className={`relative flex-shrink-0 h-full bg-light-card dark:bg-dark-card border-r border-black/10 dark:border-white/10 ${!isSidebarOpen ? 'hidden' : ''}`} style={{ width: '300px' }}>
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
            <div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 hover:bg-primary/50 transition-colors ${isResizing ? 'bg-primary w-1' : 'bg-transparent'}`} onMouseDown={startResizing} />
        </div>

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
              <FiSidebar size={48} strokeWidth={1} />
              <p className="text-lg font-medium">Selecciona una nota para editar o crea una nueva.</p>
            </div>
          )}
        </div>
      </div>

      <ShareNotebookModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} notebook={currentNotebook} />
      {isResearchPanelOpen && <ResearchPanel onInsertText={handleInsertText} />}
    </DashboardLayout>
  );
}