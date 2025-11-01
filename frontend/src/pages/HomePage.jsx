// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import NotebookCard from '../components/NotebookCard';
import CreateNotebookModal from '../components/CreateNotebookModal';
import { FiPlusCircle } from 'react-icons/fi';

const HomePage = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notebooks');
        setNotebooks(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar notebooks:', err);
        setError('No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotebooks();
  }, []);

  const handleNotebookCreated = (newNotebook) => {
    setNotebooks([newNotebook, ...notebooks]);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            // Esqueleto de carga actualizado para el tema
            <div key={i} className="h-28 bg-light-card dark:bg-dark-card/60 rounded-lg animate-pulse" />
          ))}
        </div>
      );
    }
    
    if (error) {
      return <p className="text-red-500 dark:text-red-400">{error}</p>;
    }

    if (notebooks.length === 0) {
      return (
        <div className="text-center text-light-text-secondary dark:text-gray-400 py-16">
          <p className="text-lg">No tienes notebooks todavía.</p>
          <p>¡Crea uno para empezar!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notebooks.map((notebook) => (
          <NotebookCard key={notebook.id} notebook={notebook} />
        ))}
      </div>
    );
  };

  return (
    <>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-secondary font-display">
            Mis Notebooks
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-accent1 hover:bg-accent1/90 text-dark-bg font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg"
          >
            <FiPlusCircle />
            Nuevo Notebook
          </button>
        </div>

        {renderContent()}
      </DashboardLayout>

      <CreateNotebookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNotebookCreated={handleNotebookCreated}
      />
    </>
  );
};

export default HomePage;

