import React, { useState, useEffect, useCallback, useRef } from 'react';
import { updateNote } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ReactMDEditor from '@uiw/react-md-editor';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { FiCode, FiFileText } from 'react-icons/fi';
import TagInput from './TagInput'; 

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- CAMBIO: Recibimos 'availableTags' como prop ---
export default function NoteEditor({ note, onNoteUpdated, availableTags = [] }) {
  const { theme } = useTheme(); 
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [language, setLanguage] = useState(note.language || 'javascript');
  const [tags, setTags] = useState(note.tags ? note.tags.map(t => t.tag.name) : []);
  
  const [status, setStatus] = useState('idle');
  const isInitialMount = useRef(true);

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

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
            <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${note.type === 'code' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {note.type === 'code' ? <FiCode className="mr-2" /> : <FiFileText className="mr-2" />}
                {note.type === 'code' ? "Código" : "Markdown"}
            </div>
            
            {note.type === 'code' && (
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML/XML</option>
                </select>
            )}
            
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
            
            {/* --- CAMBIO: Pasamos availableTags al TagInput --- */}
            <TagInput tags={tags} onChange={setTags} suggestions={availableTags} />
        </div>

        <div className="flex items-center gap-4">
            {status === 'saving' ? <span className="text-sm italic text-gray-500">Guardando...</span> : <span className="h-5"></span>}
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (status === 'error') setStatus('idle'); }}
        placeholder="Título de la nota"
        className="border-b border-gray-200 bg-transparent px-6 py-4 text-3xl font-bold text-gray-800 outline-none dark:border-gray-700 dark:text-white"
      />

      {note.type === 'code' ? renderCodeEditor() : renderMarkdownEditor()}
    </div>
  );
}