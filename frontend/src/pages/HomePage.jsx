// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { getNotebooks, deleteNotebook } from '../services/api'; 
import NotebookCard from '../components/NotebookCard';
import { FiPlus, FiBook, FiFolder } from 'react-icons/fi'; // Nuevos iconos
import NotebookModal from '../components/NotebookModal'; 
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext'; // Para el saludo personalizado

export default function HomePage() {
  const { user } = useAuth(); // Obtenemos el usuario para el saludo
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notebookToEdit, setNotebookToEdit] = useState(null);

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
      } catch (err) { console.error(err); }
    }
  };

  const openCreateModal = () => {
    setNotebookToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (notebook) => {
    setNotebookToEdit(notebook);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full px-4 py-6 overflow-y-auto w-full max-w-7xl mx-auto">
        
        {/* --- SECCIÓN HERO / BIENVENIDA --- */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-primary to-accent1 p-8 text-white shadow-lg relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black opacity-10 blur-2xl"></div>

            <div className="relative z-10">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Hola, {user?.username || 'Desarrollador'} 👋
                </h1>
                <p className="text-white/90 text-lg max-w-2xl mb-6">
                    Bienvenido a tu espacio de trabajo. Organiza tus ideas, fragmentos de código y documentación en un solo lugar.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all shadow-md font-bold active:scale-95"
                    >
                        <FiPlus className="text-xl" /> 
                        <span>Crear Nuevo Notebook</span>
                    </button>

                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-lg backdrop-blur-sm text-white border border-white/30">
                        <FiBook />
                        <span className="font-bold">{notebooks.length}</span> 
                        <span className="text-sm opacity-90">Notebooks activos</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="flex-1">
          {/* Título de la Sección */}
          {!isLoading && notebooks.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-light-text dark:text-dark-text border-l-4 border-primary pl-3">
                    Tus Colecciones
                 </h2>
              </div>
          )}

          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div> 
                ))}
              </div>
          ) : (
            <>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notebooks.length === 0 ? (
                    // --- ESTADO VACÍO MEJORADO ---
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-full mb-4 shadow-sm">
                            <FiFolder className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
                            No hay notebooks todavía
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-md mb-8">
                            Comienza creando tu primer cuaderno para organizar tus notas, códigos y diagramas.
                        </p>
                        <button 
                            onClick={openCreateModal} 
                            className="px-6 py-2 text-primary dark:text-accent1 font-medium hover:underline"
                        >
                            Crear mi primer notebook ahora &rarr;
                        </button>
                    </div>
                ) : (
                    notebooks.map((notebook) => (
                        <NotebookCard 
                            key={notebook.id} 
                            notebook={notebook} 
                            onEdit={openEditModal}
                            onDelete={handleDeleteNotebook}
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
      </div>
    </DashboardLayout>
  );
}