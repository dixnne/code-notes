// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { getNotebooks, deleteNotebook } from '../services/api'; 
import NotebookCard from '../components/NotebookCard';
import { FiPlus, FiBook, FiFolder } from 'react-icons/fi'; 
import NotebookModal from '../components/NotebookModal'; 
import ShareNotebookModal from '../components/ShareNotebookModal'; // Importar Modal Compartir
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext'; 

export default function HomePage() {
  const { user } = useAuth(); 
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Estado compartir
  const [notebookToEdit, setNotebookToEdit] = useState(null);
  const [notebookToShare, setNotebookToShare] = useState(null); // Notebook a compartir

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      setIsLoading(true);
      const response = await getNotebooks();
      setNotebooks(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar notebooks:', err);
      setError('No se pudo cargar la información.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotebookSaved = (savedNotebook, isEdit) => {
    if (isEdit) {
      setNotebooks(prev => prev.map(n => n.id === savedNotebook.id ? savedNotebook : n));
    } else {
      setNotebooks(prev => [savedNotebook, ...prev]);
    }
  };

  const handleDeleteNotebook = async (id) => {
    if (confirm("¿Estás seguro de borrar este notebook? Se perderán todas las notas y carpetas que contiene.")) {
      try {
        await deleteNotebook(id);
        setNotebooks(prev => prev.filter(n => n.id !== id));
      } catch (err) { console.error(err); alert("Error al eliminar."); }
    }
  };

  // Modales
  const openCreateModal = () => { setNotebookToEdit(null); setIsModalOpen(true); };
  const openEditModal = (notebook) => { setNotebookToEdit(notebook); setIsModalOpen(true); };
  // Abrir modal compartir
  const openShareModal = (notebook) => { setNotebookToShare(notebook); setIsShareModalOpen(true); };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full px-4 py-6 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* ... Hero Section (sin cambios) ... */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-primary to-accent1 p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black opacity-10 blur-2xl"></div>

            <div className="relative z-10">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Hola, {user?.username || 'Desarrollador'} 👋
                </h1>
                <p className="text-white/90 text-lg max-w-2xl mb-6">
                    Bienvenido a tu espacio de trabajo.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all shadow-md font-bold active:scale-95">
                        <FiPlus className="text-xl" /> <span>Crear Nuevo Notebook</span>
                    </button>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-lg backdrop-blur-sm text-white border border-white/30">
                        <FiBook /><span className="font-bold">{notebooks.length}</span> <span className="text-sm opacity-90">Notebooks</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1">
          {/* ... Grid de Notebooks ... */}
          {!isLoading && notebooks.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-l-4 border-primary pl-3">Tus Colecciones</h2>
              </div>
          )}
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (<div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>))}
              </div>
          ) : (
            <>
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notebooks.length === 0 ? (
                    <div className="col-span-full text-center py-24 text-gray-500">No hay notebooks.</div>
                ) : (
                    notebooks.map((notebook) => (
                        <NotebookCard 
                            key={notebook.id} 
                            notebook={notebook} 
                            onEdit={openEditModal}
                            onDelete={handleDeleteNotebook}
                            onShare={openShareModal} // Pasar manejador de compartir
                        />
                    ))
                )}
                </div>
            </>
          )}
        </div>

        <NotebookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNotebookSaved={handleNotebookSaved}
          notebookToEdit={notebookToEdit}
        />

        {/* Modal de Compartir */}
        <ShareNotebookModal 
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            notebook={notebookToShare}
        />
      </div>
    </DashboardLayout>
  );
}