// frontend/src/components/NoteEditor.jsx
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
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
  }, [note.id, note.title, note.content]);

  // Valores "debounced"
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Efecto para guardar automáticamente
  const handleSave = useCallback(async (saveData) => {
    if (!note || !note.id) return;
    setStatus('saving');
    try {
      const res = await updateNote(note.id, saveData);
      onNoteUpdated(res.data); // Notificar al padre de la actualización
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
    if (debouncedTitle !== note.title || debouncedContent !== noteContent) {
      handleSave({ title: debouncedTitle, content: debouncedContent });
    }
  }, [debouncedTitle, debouncedContent, note.title, note.content, handleSave]);

  // Función para mostrar el estado del guardado
  const renderStatus = () => {
    if (status === 'saving') {
      return <span className="text-sm italic text-light-text-secondary dark:text-dark-text-secondary">Guardando...</span>;
    }
    if (status === 'error') {
      return <span className="text-sm font-semibold text-accent1">Error al guardar</span>;
    }
    return <span className="h-5 text-sm">&nbsp;</span>;
  };

  return (
    // Aseguramos que el div contenedor principal use los colores correctos
    <div className="flex h-full flex-col bg-light-card dark:bg-dark-card">
      {/* Indicador de guardado */}
      <div className="flex h-8 items-center justify-end px-6 pt-2">
        {renderStatus()}
      </div>

      {/* Editor de Título (con colores de nuestro tema) */}
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        placeholder="Título de la nota"
        className="border-b border-light-text-secondary/30 bg-transparent px-6 pb-2 text-3xl font-bold text-light-text outline-none dark:border-dark-text-secondary/30 dark:text-dark-text"
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
          className="h-full" // <-- Esto ya estaba bien
        />
      </div>
    </div>
  );
}

