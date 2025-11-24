// ... (imports)
import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiFileText, FiCode, FiChevronDown, FiChevronRight, FiFolder, FiFolderPlus, FiMoreVertical } from 'react-icons/fi';
import { createFolder, deleteFolder } from '../services/api';

// ... (FolderItem logic, se mantiene igual) ...
const FolderItem = ({ folder, allFolders, allNotes, activeNoteId, expandedFolders, toggleFolder, onSelectNote, onDeleteNote, onAddNote, onAddSubFolder, onDeleteFolder }) => {
  // ... (código de FolderItem sin cambios) ...
  const isExpanded = expandedFolders[folder.id];
  const childFolders = allFolders.filter(f => f.parentId === folder.id);
  const childNotes = allNotes.filter(n => n.folderId === folder.id);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="mb-1">
      <div 
        className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group relative"
        onClick={() => toggleFolder(folder.id)}
        style={{ paddingLeft: '0.5rem' }}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-sm truncate pr-12 w-full">
           <span className="text-gray-400">
             {isExpanded ? <FiChevronDown size={14}/> : <FiChevronRight size={14}/>}
           </span>
           <FiFolder className="text-yellow-500 fill-current flex-shrink-0" />
           <span className="truncate">{folder.name}</span>
        </div>

        <div className="flex items-center absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-800 rounded">
           <div className="relative" ref={menuRef}>
             <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 text-gray-500 hover:text-primary dark:hover:text-accent1 transition-colors"><FiPlus size={14}/></button>
             {showMenu && (
               <div className="absolute right-0 top-6 z-50 w-40 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl overflow-hidden">
                 <button onClick={(e) => { e.stopPropagation(); onAddNote('markdown', folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"><FiFileText className="text-blue-500"/> Markdown</button>
                 <button onClick={(e) => { e.stopPropagation(); onAddNote('code', folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"><FiCode className="text-green-500"/> Código</button>
                 <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                 <button onClick={(e) => { e.stopPropagation(); onAddSubFolder(folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"><FiFolderPlus className="text-yellow-500"/> Subcarpeta</button>
               </div>
             )}
           </div>
           <button onClick={(e) => onDeleteFolder(e, folder.id)} className="p-1 text-gray-500 hover:text-red-500 transition-colors ml-1"><FiTrash size={14}/></button>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-1">
          {childFolders.map(sub => <FolderItem key={sub.id} folder={sub} allFolders={allFolders} allNotes={allNotes} activeNoteId={activeNoteId} expandedFolders={expandedFolders} toggleFolder={toggleFolder} onSelectNote={onSelectNote} onDeleteNote={onDeleteNote} onAddNote={onAddNote} onAddSubFolder={onAddSubFolder} onDeleteFolder={onDeleteFolder} />)}
          {childNotes.map(note => (
             <div
               key={note.id}
               onClick={() => onSelectNote(note)}
               className={`
                 group relative cursor-pointer px-3 py-2 my-1 rounded-md border-l-2 transition-all duration-200 flex items-center gap-2
                 ${activeNoteId === note.id
                   ? 'bg-primary/10 border-primary dark:bg-accent1/10 dark:border-accent1' 
                   : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800' 
                 }
               `}
             >
               {note.type === 'code' ? <FiCode className="w-3 h-3 text-green-500 flex-shrink-0" /> : <FiFileText className="w-3 h-3 text-blue-500 flex-shrink-0" />}
               <span className={`truncate text-sm flex-1 ${activeNoteId === note.id ? 'font-semibold text-primary dark:text-accent1' : 'text-gray-700 dark:text-gray-300'}`}>
                   {note.title || 'Sin título'}
               </span>
               {note.tags && note.tags.length > 0 && (
                 <div className="flex flex-wrap gap-1 mt-1 ml-5">
                   {note.tags.map((t, idx) => (
                     <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">#{t.tag.name}</span>
                   ))}
                 </div>
               )}
               <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"><FiTrash size={12} /></button>
             </div>
          ))}
          {childFolders.length === 0 && childNotes.length === 0 && <div className="px-4 py-2 text-xs text-gray-400 italic">Vacío</div>}
        </div>
      )}
    </div>
  );
};

export default function NoteList({
  notes, folders, activeNoteId, notebookId, onSelectNote, onCreateNote, onDeleteNote, onRefresh, 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const menuRef = useRef(null);
  const rootFolders = folders.filter(f => !f.parentId);
  const rootNotes = notes.filter(n => !n.folderId);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) { setIsMenuOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // --- NUEVO EFECTO: Auto-Expandir carpetas cuando activeNoteId cambia ---
  useEffect(() => {
    if (activeNoteId && notes.length > 0 && folders.length > 0) {
        const activeNote = notes.find(n => n.id === activeNoteId);
        if (activeNote && activeNote.folderId) {
            setExpandedFolders(prev => {
                const newExpanded = { ...prev };
                let currentFolderId = activeNote.folderId;
                let changed = false;

                // Ascender por la jerarquía de carpetas
                while (currentFolderId) {
                    if (!newExpanded[currentFolderId]) {
                        newExpanded[currentFolderId] = true;
                        changed = true;
                    }
                    const folder = folders.find(f => f.id === currentFolderId);
                    currentFolderId = folder ? folder.parentId : null;
                }
                
                return changed ? newExpanded : prev;
            });
        }
    }
  }, [activeNoteId, notes, folders]); 
  // -----------------------------------------------------------------------

  const toggleFolder = (folderId) => { setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] })); };
  const handleCreateFolder = async (parentId = null) => {
    const name = prompt(parentId ? "Nombre de la subcarpeta:" : "Nombre de la carpeta:");
    if (name) {
      try { await createFolder(name, parseInt(notebookId), parentId); onRefresh(); if (parentId) setExpandedFolders(prev => ({ ...prev, [parentId]: true })); } catch (err) { console.error(err); alert("Error"); }
    }
    setIsMenuOpen(false);
  };
  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation();
    if(confirm("¿Estás seguro?")) { try { await deleteFolder(folderId); onRefresh(); } catch(err) { console.error(err); alert("Error"); } }
  };
  const handleCreateNoteInFolder = (type, folderId = null) => { onCreateNote(type, folderId); setIsMenuOpen(false); if (folderId) setExpandedFolders(prev => ({ ...prev, [folderId]: true })); };

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* ... (renderizado del botón principal y lista igual que antes) ... */}
      <div className="p-4 relative" ref={menuRef}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white shadow-md transition-all hover:bg-opacity-90 active:scale-95 dark:bg-accent1">
          <div className="flex items-center gap-2 font-medium"><FiPlus className="text-lg" /> <span>Nueva Nota</span></div>
          <FiChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        {isMenuOpen && (
            <div className="absolute left-4 right-4 top-16 z-20 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in zoom-in duration-100">
                <button onClick={() => handleCreateNoteInFolder('markdown')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-gray-700 dark:text-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><FiFileText /></div>
                    <span className="text-sm font-semibold">Nota Markdown</span>
                </button>
                <button onClick={() => handleCreateNoteInFolder('code')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-left text-gray-700 dark:text-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><FiCode /></div>
                    <span className="text-sm font-semibold">Nota de Código</span>
                </button>
                <button onClick={() => handleCreateFolder(null)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-left text-gray-700 dark:text-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"><FiFolderPlus /></div>
                    <span className="text-sm font-semibold">Nueva Carpeta</span>
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {rootFolders.map(folder => (
          <FolderItem key={folder.id} folder={folder} allFolders={folders} allNotes={notes} activeNoteId={activeNoteId} expandedFolders={expandedFolders} toggleFolder={toggleFolder} onSelectNote={onSelectNote} onDeleteNote={onDeleteNote} onAddNote={handleCreateNoteInFolder} onAddSubFolder={handleCreateFolder} onDeleteFolder={handleDeleteFolder} />
        ))}
        <div className="mt-2 space-y-1">
            {rootNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`
                  group relative cursor-pointer px-4 py-2 rounded-md border-l-2 transition-all duration-200
                  ${activeNoteId === note.id ? 'bg-primary/10 border-primary dark:bg-accent1/10 dark:border-accent1' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}
                `}
              >
                 <div className="flex items-center gap-2">
                    {note.type === 'code' ? <FiCode className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" /> : <FiFileText className="w-4 h-4 text-text-secondary flex-shrink-0" />}
                    <span className={`truncate text-sm flex-1 ${activeNoteId === note.id ? 'font-semibold text-primary dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{note.title || 'Sin título'}</span>
                 </div>
                 {note.tags && note.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-1 ml-6">
                     {note.tags.map((t, idx) => (
                       <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">#{t.tag.name}</span>
                     ))}
                   </div>
                 )}
                 <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"><FiTrash size={12} /></button>
              </div>
            ))}
        </div>
        {rootFolders.length === 0 && rootNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 opacity-60">
             <p className="text-sm">Notebook vacío</p>
          </div>
        )}
      </div>
    </div>
  );
}