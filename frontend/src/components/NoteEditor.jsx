import React, { useState, useEffect, useCallback, useRef } from 'react';
import { updateNote, summarizeText, rewriteText, autoTag, autoTitle } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ReactMDEditor from '@uiw/react-md-editor';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { FiCode, FiFileText, FiZap, FiChevronDown, FiCpu } from 'react-icons/fi';
import TagInput from './TagInput';
import AiLoadingIndicator from './AiLoadingIndicator';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function NoteEditor({ note, onNoteUpdated, availableTags = [] }) {
  const { theme } = useTheme(); 
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [language, setLanguage] = useState(note.language || 'javascript');
  const [tags, setTags] = useState(note.tags ? note.tags.map(t => t.tag.name) : []);
  
  const [status, setStatus] = useState('idle');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const isInitialMount = useRef(true);

  // Estado para el menú unificado de IA
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  
  // Refs separados para móvil y escritorio para manejar el click outside correctamente
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Cerrar menú al hacer click fuera (revisa ambos refs)
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedDesktop = desktopMenuRef.current && desktopMenuRef.current.contains(event.target);
      const clickedMobile = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      
      if (!clickedDesktop && !clickedMobile) {
        setIsAiMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [desktopMenuRef, mobileMenuRef]);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || '');
    setLanguage(note.language || 'javascript');
    setTags(note.tags ? note.tags.map(t => t.tag.name) : []);
    setStatus('idle');
    isInitialMount.current = true;
  }, [note.id]); 

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTags = useDebounce(tags, 1000); 

  const handleSave = useCallback(async (saveData) => {
    if (!note || !note.id) return;
    setStatus('saving');
    try {
      const res = await updateNote(note.id, saveData);
      onNoteUpdated(res.data);
      setStatus('idle');
    } catch (err) {
      console.error('Error al guardar:', err);
      setStatus('error');
    }
  }, [note.id, onNoteUpdated]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const safeContent = content || '';
    const noteContent = note.content || '';
    const tagsChanged = JSON.stringify(debouncedTags) !== JSON.stringify(note.tags ? note.tags.map(t => t.tag.name) : []);

    if (debouncedTitle !== note.title || safeContent !== noteContent || language !== note.language || tagsChanged) {
      handleSave({ title: debouncedTitle, content: safeContent, language, tags: debouncedTags });
    }
  }, [debouncedTitle, debouncedContent, language, debouncedTags, handleSave]);

  // --- FUNCIONES DE IA ---

  const handleSummarize = async () => {
    setIsLoadingAi(true);
    setIsAiMenuOpen(false);
    try {
      const response = await summarizeText(content);
      setContent(response.data);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
    setIsLoadingAi(false);
  };

  const handleRewrite = async (style) => {
    setIsLoadingAi(true);
    
    try {
      const response = await rewriteText(content, style);
      setContent(response.data);
    } catch (error) {
      console.error('Error rewriting text:', error);
    }
    setIsLoadingAi(false);
  };

  const handleAutoTag = async () => {
    setIsLoadingAi(true);
    setIsAiMenuOpen(false);
    try {
      const response = await autoTag(content);
      const newTags = response.data;
      setTags([...new Set([...tags, ...newTags])]);
    } catch (error) {
      console.error('Error auto-tagging:', error);
    }
    setIsLoadingAi(false);
  };

  const handleAutoTitle = async () => {
    setIsLoadingAi(true);
    setIsAiMenuOpen(false);
    try {
      const response = await autoTitle(content);
      setTitle(response.data);
    } catch (error) {
      console.error('Error auto-titling:', error);
    }
    setIsLoadingAi(false);
  };

  const getExtensions = () => {
      switch(language) {
          case 'python': return [python()];
          case 'html': return [html()];
          default: return [javascript()];
      }
  };

  const renderCodeEditor = () => (
    <div className="flex-1 h-full overflow-hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CodeMirror
        value={content}
        height="100%"
        theme={theme === 'dark' ? githubDark : githubLight}
        extensions={getExtensions()} 
        onChange={(val) => { setContent(val); if (status === 'error') setStatus('idle'); }}
        className="h-full text-base"
      />
    </div>
  );

  const renderMarkdownEditor = () => (
    <div className="flex-1 overflow-hidden" data-color-mode={theme}>
      <ReactMDEditor
        value={content}
        onChange={(val) => { setContent(val || ''); if (status === 'error') setStatus('idle'); }}
        preview="live" 
        hideToolbar={false}
        className="h-full"
        height="100%"
        visiableDragbar={false}
      />
    </div>
  );

  const rewriteOptions = ['Formal', 'Casual', 'Poetic'];

  // Componente del Menú Dropdown (Reutilizable)
  const AiDropdownMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-100 origin-top-right">
        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-1">
            Generación IA
        </div>
        <button onClick={handleSummarize} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><span>📝</span> Resumir Nota</button>
        <button onClick={handleAutoTag} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><span>🏷️</span> Generar Tags</button>
        <button onClick={handleAutoTitle} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><span>T</span> Generar Título</button>
        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <div className="px-3 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reescribir</div>
        {rewriteOptions.map((tone) => (
            <button onClick={() => handleRewrite(tone)} className="w-full text-left px-6 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><span>✨</span> {tone}</button>
        ))}
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-900">
      
      {/* --- HEADER UNIFICADO --- */}
      <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        
        {/* CONTENEDOR PRINCIPAL FLEXBOX */}
        {/* En móvil es columna, en desktop fila */}
        <div className="flex flex-wrap md:flex-nowrap items-center min-h-[3.5rem]">
            
            {/* SECCIÓN 1: Tipo, Lenguaje (Siempre visible a la izquierda) */}
            {/* En móvil ocupa la mitad o lo necesario, en desktop es el inicio */}
            <div className="flex items-center gap-3 px-4 py-2 flex-shrink-0">
                <div className={`flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md shadow-sm ${note.type === 'code' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {note.type === 'code' ? <FiCode className="mr-1.5" /> : <FiFileText className="mr-1.5" />}
                    {note.type === 'code' ? "Código" : "Markdown"}
                </div>
                
                {note.type === 'code' && (
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs font-medium border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML/XML</option>
                    </select>
                )}
            </div>

            {/* SECCIÓN 2 (MÓVIL SOLAMENTE): Controles derechos (IA Icono + Estado) */}
            <div className="flex md:hidden ml-auto px-4 items-center gap-3">
                 <div className="flex-shrink-0">
                    {status === 'saving' ? <span className="text-xs italic text-gray-500">...</span> : null}
                </div>
                {/* Botón IA Móvil (Solo Icono) */}
                <div className="relative" ref={mobileMenuRef}>
                    <button 
                        onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                        className={`p-2 rounded-md border transition-all duration-200 ${isLoadingAi ? 'bg-gradient-to-r from-primary to-accent1 text-white border-transparent animate-pulse' : 'bg-white dark:bg-gray-700 text-primary dark:text-accent1 border-primary/20 dark:border-accent1/20'}`}
                    >
                        <FiCpu size={16} className={isLoadingAi ? 'animate-spin' : ''} />
                    </button>
                    {isAiMenuOpen && <AiDropdownMenu />}
                </div>
            </div>

            {/* SECCIÓN 3: Tags (Fila completa en móvil, central en desktop) */}
            {/* Ajuste: pb-4 para dar más espacio abajo en móvil. min-h-[3.5rem] para asegurar altura suficiente. */}
            <div className="w-full md:w-auto md:flex-1 px-4 pb-4 md:pb-0 md:py-0 overflow-x-auto scrollbar-hide flex items-center md:border-l md:border-r border-gray-300 dark:border-gray-600 md:mx-2 min-h-[3.5rem] [&>div]:!flex-nowrap">
                <TagInput tags={tags} onChange={setTags} suggestions={availableTags} />
            </div>

            {/* SECCIÓN 4 (DESKTOP SOLAMENTE): Herramientas IA (Texto) + Estado */}
            <div className="hidden md:flex items-center gap-4 px-4 flex-shrink-0">
                 {/* Botón IA Desktop (Texto + Icono) */}
                 <div className="relative" ref={desktopMenuRef}>
                    <button 
                        onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${
                            isLoadingAi 
                            ? 'bg-gradient-to-r from-primary to-accent1 text-white border-transparent animate-ai-shimmer bg-[length:200%_100%]' 
                            : 'bg-white dark:bg-gray-700 text-primary dark:text-accent1 border-primary/20 dark:border-accent1/20 hover:shadow-md'
                        }`}
                    >
                        <FiCpu className={isLoadingAi ? 'animate-spin' : ''} size={14} />
                        <span className="whitespace-nowrap">Herramientas de IA</span>
                        <FiChevronDown size={12} className={`transition-transform ${isAiMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAiMenuOpen && <AiDropdownMenu />}
                </div>

                <div className="w-16 text-right">
                    {status === 'saving' ? <span className="text-xs italic text-gray-500">Guardando...</span> : <span className="text-xs font-bold text-green-500 opacity-0 transition-opacity duration-500">Guardado</span>}
                </div>
            </div>

        </div>
      </div>

      {/* Título e Inputs */}
      <input
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (status === 'error') setStatus('idle'); }}
        placeholder="Título de la nota"
        className="border-b border-gray-200 bg-transparent px-6 py-4 text-3xl font-bold text-gray-800 outline-none dark:border-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
      />

      {note.type === 'code' ? renderCodeEditor() : renderMarkdownEditor()}
    </div>
  );
}