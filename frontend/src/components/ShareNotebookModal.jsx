// frontend/src/components/ShareNotebookModal.jsx
import { useState } from 'react';
import { FiX, FiUsers } from 'react-icons/fi';
import { shareNotebook } from '../services/api';

export default function ShareNotebookModal({ isOpen, onClose, notebook }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // { text: '', type: 'success' | 'error' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !notebook) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await shareNotebook(notebook.id, email);
      setMessage({ text: `¡Invitación enviada a ${email}!`, type: 'success' });
      setEmail(''); // Limpiar campo
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al compartir.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
            <FiUsers className="text-blue-500" />
            Compartir "{notebook?.title}"
          </h3>
          <button
            onClick={() => { setMessage({text:'', type:''}); onClose(); }}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Invitar por correo electrónico
            </label>
            <div className="mt-1 flex gap-2">
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amigo@ejemplo.com"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
                />
                <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                {isLoading ? '...' : 'Invitar'}
                </button>
            </div>
          </div>
          
          {message.text && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {message.text}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
             <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Colaboradores actuales
             </h4>
             {/* Aquí podríamos listar los colaboradores en el futuro */}
             <div className="text-sm text-gray-500 italic">
                {notebook?.collaborators?.length > 0 
                    ? `${notebook.collaborators.length} persona(s) con acceso` 
                    : 'Solo tú tienes acceso'}
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}