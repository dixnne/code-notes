// frontend/src/components/NoteEditor.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { updateNote } from '../services/api';
import ReactMDEditor from '@uiw/react-md-editor'; 
import { useTheme } from '../contexts/ThemeContext'; 

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
  
  // --- DEBUG: Ver qué nota estamos recibiendo del padre ---
  console.log('[NoteEditor] Renderizando. Nota ID:', note?.id, 'Título:', note?.title);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [status, setStatus] = useState('idle');

  const isInitialMount = useRef(true);

  // Sincronizar el estado local SOLO si cambia el ID de la nota
  useEffect(() => {
    console.log('[NoteEditor] Cambio de nota detectado (ID):', note.id);
    setTitle(note.title);
    setContent(note.content || '');
    setStatus('idle');
    isInitialMount.current = true;
  }, [note.id]); 

  // Valores "debounced"
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Efecto para guardar automáticamente
  const handleSave = useCallback(async (saveData) => {
    console.log('[NoteEditor] handleSave ejecutándose con:', saveData);
    
    if (!note || !note.id) {
      console.error('[NoteEditor] Error: No hay ID de nota para guardar');
      return;
    }
    
    setStatus('saving');
    try {
      const res = await updateNote(note.id, saveData);
      console.log('[NoteEditor] Guardado exitoso en API:', res.data);
      onNoteUpdated(res.data); 
      setStatus('idle');
    } catch (err) {
      console.error('[NoteEditor] Error en API al guardar:', err);
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
    
    // --- DEBUG: Ver por qué se dispara (o no) el guardado ---
    console.log('[NoteEditor] Verificando cambios:', {
      localTitle: debouncedTitle,
      serverTitle: note.title,
      localContent: safeContent,
      serverContent: noteContent,
      isDifferent: debouncedTitle !== note.title || safeContent !== noteContent
    });

    if (debouncedTitle !== note.title || safeContent !== noteContent) {
      console.log('[NoteEditor] Cambios detectados -> Disparando handleSave');
      handleSave({ title: debouncedTitle, content: safeContent });
    }
  }, [debouncedTitle, debouncedContent, handleSave]); // Dependencias simplificadas

  // Función para mostrar el estado del guardado
  const renderStatus = () => {
    if (status === 'saving') {
      return <span className="text-sm italic text-gray-500 dark:text-gray-400">Guardando...</span>;
    }
    if (status === 'error') {
      return <span className="text-sm font-semibold text-red-500">Error al guardar</span>;
    }
    return <span className="h-5 text-sm">&nbsp;</span>;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Indicador de guardado */}
      <div className="flex h-8 items-center justify-end px-6 pt-2">
        {renderStatus()}
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
        className="border-b border-gray-200 bg-transparent px-6 pb-2 text-3xl font-bold text-gray-900 outline-none dark:border-gray-700 dark:text-white"
      />

      {/* Editor de Contenido (Altura Corregida) */}
      <div className="flex-1 overflow-hidden" data-color-mode={theme}>
        <ReactMDEditor
          value={content}
          onChange={(newContent) => {
            setContent(newContent || ''); 
            if (status === 'error') setStatus('idle');
          }}
          preview="live" 
          hideToolbar={false}
          className="h-full"
          visiableDragbar={false}
        />
      </div>
    </div>
  );
}