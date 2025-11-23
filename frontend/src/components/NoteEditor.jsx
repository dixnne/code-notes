import { useState, useEffect, useCallback, useRef } from 'react';
import { updateNote } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Editores
import ReactMDEditor from '@uiw/react-md-editor';
import CodeMirror from '@uiw/react-codemirror';

// Lenguajes y Temas para CodeMirror
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

import { FiCode, FiFileText } from 'react-icons/fi';

// Hook de "debounce"
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function NoteEditor({ note, onNoteUpdated }) {
  const { theme } = useTheme(); 
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [status, setStatus] = useState('idle');

  const isInitialMount = useRef(true);

  // Sincronizar el estado local si la nota seleccionada cambia
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || '');
    setStatus('idle');
    isInitialMount.current = true;
  }, [note.id]); // Solo al cambiar de ID

  // Valores "debounced"
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Efecto para guardar automáticamente
  const handleSave = useCallback(async (saveData) => {
    if (!note || !note.id) return;
    setStatus('saving');
    try {
      const res = await updateNote(note.id, saveData);
      onNoteUpdated(res.data);
      setStatus('idle');
    } catch (err) {
      console.error('Error al guardar la nota:', err);
      setStatus('error');
    }
  }, [note.id, onNoteUpdated]);

  // Efecto de guardado unificado
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const safeContent = content || '';
    const noteContent = note.content || '';
    
    // Guardamos si hay cambios
    if (debouncedTitle !== note.title || safeContent !== noteContent) {
      handleSave({ title: debouncedTitle, content: safeContent });
    }
  }, [debouncedTitle, debouncedContent, handleSave]);

  const renderStatus = () => {
    if (status === 'saving') {
      return <span className="text-sm italic text-text-secondary">Guardando...</span>;
    }
    if (status === 'error') {
      return <span className="text-sm font-semibold text-red-500">Error al guardar</span>;
    }
    return <span className="h-5 text-sm">&nbsp;</span>;
  };

  // --- RENDERIZADORES ---

  // 1. EDITOR DE CÓDIGO
  const renderCodeEditor = () => (
    <div className="flex-1 h-full w-full overflow-hidden border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <CodeMirror
        value={content}
        height="100%"
        width="100%"
        theme={theme === 'dark' ? githubDark : githubLight}
        extensions={[javascript(), python(), html()]} 
        onChange={(val) => {
            setContent(val);
            if (status === 'error') setStatus('idle');
        }}
        className="h-full text-base"
      />
    </div>
  );

  // 2. EDITOR MARKDOWN
  const renderMarkdownEditor = () => (
    <div className="flex-1 h-full w-full overflow-hidden" data-color-mode={theme}>
      <ReactMDEditor
        value={content}
        onChange={(newContent) => {
          setContent(newContent || ''); 
          if (status === 'error') setStatus('idle');
        }}
        preview="live" 
        hideToolbar={false}
        className="h-full"
        height="100%"
        width="100%"
        visiableDragbar={false}
      />
    </div>
  );

  // Icono según el tipo
  const getTypeInfo = () => {
    if (note.type === 'code') return { icon: <FiCode className="mr-2" />, label: "Fragmento de Código" };
    return { icon: <FiFileText className="mr-2" />, label: "Nota Markdown" };
  };

  const typeInfo = getTypeInfo();

  return (
    <div className="flex h-full w-full flex-col ">
      {/* Header del Editor */}
      <div className="flex items-center justify-between px-6 py-2 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center text-sm text-text-secondary font-medium bg-primary text-white px-3 py-1 rounded-full">
            {typeInfo.icon}
            {typeInfo.label}
        </div>
        <div className="flex items-center gap-4">
            {renderStatus()}
        </div>
      </div>

      {/* Editor de Título */}
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        placeholder="Título de la nota"
        className="border-b border-border-light bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white px-6 py-4 text-3xl font-bold text-text-primary outline-none dark:border-border-dark placeholder-text-secondary/50"
      />

      {/* Renderizado Condicional del Editor */}
      {note.type === 'code' ? renderCodeEditor() : renderMarkdownEditor()}
    </div>
  );
}