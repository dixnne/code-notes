import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiFileText, FiCode, FiChevronDown, FiChevronRight, FiFolder, FiFolderPlus } from 'react-icons/fi';
import { createFolder, deleteFolder } from '../services/api';

// --- SUB-COMPONENTE RECURSIVO ---
// Este componente se encarga de renderizar una carpeta y llamarse a sí mismo para las subcarpetas
const FolderItem = ({ folder, allFolders, allNotes, activeNoteId, expandedFolders, toggleFolder, onSelectNote, onDeleteNote, onAddNote, onAddSubFolder, onDeleteFolder }) => {
  const isExpanded = expandedFolders[folder.id];
  
  // Filtrar hijos directos de esta carpeta
  const childFolders = allFolders.filter(f => f.parentId === folder.id);
  const childNotes = allNotes.filter(n => n.folderId === folder.id);
  
  // Estado local para el menú contextual de esta carpeta específica
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
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
      {/* Cabecera de la Carpeta */}
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

        {/* Botones de Acción de Carpeta (Hover) */}
        <div className="flex items-center absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-800 rounded">
           {/* Botón Menú (+) */}
           <div className="relative" ref={menuRef}>
             <button 
               title="Añadir..."
               onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
               className="p-1 text-gray-500 hover:text-primary dark:hover:text-accent1 transition-colors"
             >
               <FiPlus size={14}/>
             </button>
             
             {/* Menú Desplegable Contextual */}
             {showMenu && (
               <div className="absolute right-0 top-6 z-50 w-40 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl overflow-hidden">
                 <button onClick={(e) => { e.stopPropagation(); onAddNote('markdown', folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                   <FiFileText className="text-blue-500"/> Markdown
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); onAddNote('code', folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                   <FiCode className="text-green-500"/> Código
                 </button>
                 <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                 <button onClick={(e) => { e.stopPropagation(); onAddSubFolder(folder.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                   <FiFolderPlus className="text-yellow-500"/> Subcarpeta
                 </button>
               </div>
             )}
           </div>
           
           {/* Botón Borrar */}
           <button 
             title="Borrar carpeta" 
             onClick={(e) => onDeleteFolder(e, folder.id)} 
             className="p-1 text-gray-500 hover:text-red-500 transition-colors ml-1"
           >
             <FiTrash size={14}/>
           </button>
        </div>
      </div>

      {/* Contenido Recursivo */}
      {isExpanded && (
        <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-1">
          {/* Renderizar Subcarpetas Recursivamente */}
          {childFolders.map(subFolder => (
            <FolderItem 
              key={subFolder.id} 
              folder={subFolder} 
              allFolders={allFolders}
              allNotes={allNotes}
              activeNoteId={activeNoteId}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onSelectNote={onSelectNote}
              onDeleteNote={onDeleteNote}
              onAddNote={onAddNote}
              onAddSubFolder={onAddSubFolder}
              onDeleteFolder={onDeleteFolder}
            />
          ))}

          {/* Renderizar Notas de esta carpeta */}
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
               <button
                 onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                 className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
               >
                 <FiTrash size={12} />
               </button>
             </div>
          ))}
          
          {childFolders.length === 0 && childNotes.length === 0 && (
             <div className="px-4 py-2 text-xs text-gray-400 italic">Vacío</div>
          )}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function NoteList({
  notes,
  folders, 
  activeNoteId,
  notebookId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onRefresh, 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const menuRef = useRef(null);

  // Filtrar carpetas y notas de nivel raíz (parentId/folderId es null)
  const rootFolders = folders.filter(f => !f.parentId);
  const rootNotes = notes.filter(n => !n.folderId);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleCreateFolder = async (parentId = null) => {
    const name = prompt(parentId ? "Nombre de la subcarpeta:" : "Nombre de la carpeta:");
    if (name) {
      try {
        // createFolder ahora acepta parentId
        await createFolder(name, parseInt(notebookId), parentId);
        onRefresh(); 
        if (parentId) {
            setExpandedFolders(prev => ({ ...prev, [parentId]: true }));
        }
      } catch (err) {
        console.error(err);
        alert("Error al crear la carpeta");
      }
    }
    setIsMenuOpen(false);
  };

  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation();
    if(confirm("¿Estás seguro? Se eliminará la carpeta, sus subcarpetas y todas las notas dentro.")) {
      try {
        await deleteFolder(folderId);
        onRefresh();
      } catch(err) { console.error(err); alert("Error al borrar carpeta"); }
    }
  };

  const handleCreateNoteInFolder = (type, folderId = null) => {
    onCreateNote(type, folderId);
    setIsMenuOpen(false);
    if (folderId) {
        setExpandedFolders(prev => ({ ...prev, [folderId]: true })); 
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Botón Principal (Raíz) */}
      <div className="p-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white shadow-md transition-all hover:bg-opacity-90 active:scale-95 dark:bg-accent1"
        >
          <div className="flex items-center gap-2 font-medium">
            <FiPlus className="text-lg" />
            <span>Nuevo...</span>
          </div>
          <FiChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
            <div className="absolute left-4 right-4 top-16 z-20 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in zoom-in duration-100">
                <button onClick={() => handleCreateNoteInFolder('markdown')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><FiFileText /></div>
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nota Markdown</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Raíz</span>
                    </div>
                </button>
                <button onClick={() => handleCreateNoteInFolder('code')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><FiCode /></div>
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nota de Código</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Raíz</span>
                    </div>
                </button>
                <button onClick={() => handleCreateFolder(null)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"><FiFolderPlus /></div>
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nueva Carpeta</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Raíz</span>
                    </div>
                </button>
            </div>
        )}
      </div>

      {/* Lista Principal */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Renderizar Carpetas Raíz (Las cuales renderizarán sus hijos recursivamente) */}
        {rootFolders.map(folder => (
          <FolderItem 
            key={folder.id} 
            folder={folder}
            allFolders={folders} // Pasamos TODOS los folders para que cada uno busque sus hijos
            allNotes={notes}     // Pasamos TODAS las notas
            activeNoteId={activeNoteId}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            onSelectNote={onSelectNote}
            onDeleteNote={onDeleteNote}
            onAddNote={handleCreateNoteInFolder}
            onAddSubFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        ))}

        {/* Renderizar Notas Raíz */}
        <div className="mt-2 space-y-1">
            {rootNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`
                  group relative cursor-pointer px-4 py-2 rounded-md border transition-all duration-200 flex items-center gap-2
                  ${
                    activeNoteId === note.id
                      ? 'bg-surface-light dark:bg-surface-dark border-brand-base shadow-sm' 
                      : 'border-transparent hover:bg-surface-light/50 dark:hover:bg-surface-dark/50' 
                  }
                `}
              >
                 {note.type === 'code' ? <FiCode className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" /> : <FiFileText className="w-4 h-4 text-text-secondary flex-shrink-0" />}
                 <span className={`truncate text-sm flex-1 ${activeNoteId === note.id ? 'font-semibold text-brand-base' : 'text-text-primary'}`}>
                    {note.title || 'Sin título'}
                 </span>
                 <button
                    onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                 >
                    <FiTrash size={14} />
                 </button>
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