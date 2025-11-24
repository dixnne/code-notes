import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllTags, getAllNotes } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { FiTag, FiFileText, FiCode, FiArrowRight, FiSearch, FiFilter, FiHash } from 'react-icons/fi';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTag = searchParams.get('tag');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getAllTags();
        setTags(res.data);
      } catch (err) {
        console.error("Error cargando tags:", err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await getAllNotes(activeTag || ''); 
        setNotes(res.data);
      } catch (err) {
        console.error("Error cargando notas:", err);
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [activeTag]);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-11rem)] flex-col md:flex-row overflow-hidden">
        
        {/* --- BARRA LATERAL (Filtros) --- */}
        <div className="w-full md:w-80 flex-shrink-0 bg-light-card dark:bg-dark-card border-b md:border-r border-black/10 dark:border-white/10 flex flex-col h-full z-10 transition-colors duration-300">
            
            <div className="p-5 border-b border-black/10 dark:border-white/10 bg-light-card dark:bg-dark-card">
                <h2 className="font-display text-xl font-bold text-light-text dark:text-dark-text mb-1 flex items-center gap-2">
                    <FiFilter className="text-primary" /> 
                    Explorador de Temas
                </h2>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Navega a través de {tags.length} etiquetas
                </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-light-card dark:bg-dark-card">
                <button
                    onClick={() => setSearchParams({})}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex justify-between items-center mb-4 ${
                        !activeTag 
                        ? 'bg-gradient-to-r from-primary to-accent1 text-white shadow-md ring-1 ring-primary/20' 
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text border border-transparent'
                    }`}
                >
                    <span className="font-bold flex items-center gap-2">
                        <FiFileText className={!activeTag ? "text-white" : "text-light-text-secondary"} />
                        Todas las notas
                    </span>
                    {!activeTag && <FiArrowRight className="animate-pulse" />}
                </button>
                
                <div className="px-2 pb-2 text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider opacity-70">
                    Etiquetas Disponibles
                </div>

                {loadingTags ? (
                   <div className="space-y-2 px-1">
                      {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2">
                              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </div>
                      ))}
                   </div>
                ) : tags.map(tag => (
                    <button
                        key={tag.id}
                        onClick={() => setSearchParams({ tag: tag.name })}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 flex justify-between items-center group border ${
                            activeTag === tag.name 
                            ? 'bg-accent1/10 border-accent1 text-accent1 font-semibold' 
                            : 'border-transparent text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                        }`}
                    >
                        <span className="flex items-center gap-2.5">
                           <FiHash className={`w-3.5 h-3.5 ${activeTag === tag.name ? 'text-accent1' : 'text-light-text-secondary dark:text-dark-text-secondary group-hover:text-accent1'}`} />
                           {tag.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activeTag === tag.name 
                            ? 'bg-accent1 text-white' 
                            : 'bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary border border-black/5 dark:border-white/5 group-hover:border-accent1/30'
                        }`}>
                            {tag.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* --- ÁREA PRINCIPAL (Resultados) --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-light-bg dark:bg-dark-bg relative transition-colors duration-300">
            
            <header className="px-8 py-6 bg-light-card dark:bg-dark-card border-b border-black/5 dark:border-white/5 shadow-sm shrink-0 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                            Vista Actual
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text font-display flex items-center gap-3">
                        {activeTag ? (
                            <>
                                <span className="text-accent1 bg-accent1/10 p-1 rounded-md">#{activeTag}</span>
                                <span className="text-light-text-secondary dark:text-dark-text-secondary font-light">Notes</span>
                            </>
                        ) : (
                            <span>📚 Biblioteca Completa</span>
                        )}
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-2 flex items-center gap-2">
                        <span className="font-semibold text-light-text dark:text-dark-text">{notes.length}</span> 
                        {notes.length === 1 ? 'nota encontrada' : 'notas encontradas'}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {loadingNotes ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_,i) => (
                                <div key={i} className="h-56 bg-light-card dark:bg-dark-card rounded-xl border border-black/5 dark:border-white/5 p-6 animate-pulse flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    </div>
                                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                            {notes.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-light-text-secondary dark:text-dark-text-secondary opacity-70">
                                    <div className="bg-light-card dark:bg-dark-card p-4 rounded-full shadow-sm mb-4">
                                        <FiSearch size={40} className="text-primary/50" />
                                    </div>
                                    <p className="text-xl font-medium">No se encontraron notas</p>
                                    <p className="text-sm mt-1">Intenta seleccionar otra etiqueta o crea una nueva nota.</p>
                                </div>
                            )}
                            
                            {notes.map(note => (
                                <Link 
                                    // --- CAMBIO: Añadimos el query param ?noteId ---
                                    to={`/notebooks/${note.notebookId}?noteId=${note.id}`}
                                    key={note.id}
                                    className="flex flex-col h-56 bg-light-card dark:bg-dark-card p-5 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-md shadow-sm ${
                                                note.type === 'code' 
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {note.type === 'code' ? <FiCode size={14}/> : <FiFileText size={14}/>}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary opacity-80">
                                                {note.type}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-light-text-secondary bg-light-bg dark:bg-gray-700 px-2 py-1 rounded-full max-w-[100px] truncate">
                                            {note.notebook?.title}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-display font-bold text-lg text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors truncate">
                                        {note.title}
                                    </h3>
                                    
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-auto leading-relaxed">
                                        {note.content || <span className="italic opacity-50">Sin contenido...</span>}
                                    </p>
                                    
                                    <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
                                        <div className="flex flex-wrap gap-1.5 overflow-hidden h-6">
                                            {note.tags && note.tags.slice(0, 3).map(t => (
                                                <span key={t.tag.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-light-bg dark:bg-gray-700 text-light-text-secondary dark:text-dark-text-secondary border border-black/5 dark:border-white/5 group-hover:text-primary transition-colors">
                                                    #{t.tag.name}
                                                </span>
                                            ))}
                                            {note.tags && note.tags.length > 3 && (
                                                <span className="text-[10px] text-light-text-secondary px-1">+{note.tags.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}