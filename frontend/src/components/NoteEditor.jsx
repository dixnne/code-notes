// frontend/src/components/NoteEditor.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { updateNote } from '../services/api';

// Hook de "debounce" para no saturar la API
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
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [status, setStatus] = useState('idle');

  // Ref para evitar el guardado automático en la carga inicial
  const isInitialMount = useRef(true);

  // Sincronizar el estado local si la nota seleccionada cambia
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || '');
    setStatus('idle');
    isInitialMount.current = true; // Reiniciar el flag para la nueva nota
  }, [note.id, note.title, note.content]); // Sincronizar si la nota (o su contenido) cambia

  // Valores "debounced"
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Efecto para guardar automáticamente
  const handleSave = useCallback(async (saveData) => {
    if (!note || !note.id) return; // Asegurarse de que la nota y su ID existen
    setStatus('saving');
    try {
      const res = await updateNote(note.id, saveData);
      onNoteUpdated(res.data); // Notificar al padre de la actualización
      setStatus('idle');
    } catch (err) {
      console.error('Error al guardar la nota:', err);
      setStatus('error'); // Mostrar un error visual en lugar de alert
    }
  }, [note.id, onNoteUpdated]); // Depende del ID de la nota y la función de actualización

  // --- EFECTO DE GUARDADO UNIFICADO ---
  useEffect(() => {
    // No guardar en la carga inicial del componente
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const safeContent = content || '';
    const noteContent = note.content || '';
    
    // Comprobar si el título "debounced" o el contenido "debounced" son diferentes
    // de los valores originales de la nota que se cargó.
    if (debouncedTitle !== note.title || debouncedContent !== noteContent) {
       handleSave({ title: debouncedTitle, content: debouncedContent });
    }
    
  }, [debouncedTitle, debouncedContent, note.title, note.content, handleSave]); // Dependencias correctas


  // Función para mostrar el estado del guardado
  const renderStatus = () => {
    if (status === 'saving') {
      return <span className="text-sm italic text-gray-500 dark:text-gray-400">Guardando...</span>;
    }
    if (status === 'error') {
      return <span className="text-sm font-semibold text-red-500">Error al guardar</span>;
    }
    return <span className="h-5 text-sm">&nbsp;</span>; // Espacio reservado
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
          if (status === 'error') setStatus('idle'); // Limpiar error al escribir
        }}
        placeholder="Título de la nota"
        className="border-b border-gray-200 bg-transparent px-6 pb-2 text-3xl font-bold text-gray-900 outline-none dark:border-gray-700 dark:text-white"
      />

      {/* Editor de Contenido (por ahora un textarea) */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value); // <-- ¡CORREGIDO!
          if (status === 'error') setStatus('idle'); // Limpiar error al escribir
        }}
        placeholder="Comienza a escribir tu nota..."
        className="h-full w-full flex-1 resize-none bg-transparent p-6 text-base text-gray-800 outline-none dark:text-gray-200"
        style={{ fontFamily: 'monospace' }} // Mejor para código
      />
    </div>
  );
}

