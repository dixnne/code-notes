// frontend/src/pages/HomePage.jsx
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaPlus, FaBook } from 'react-icons/fa';

const HomePage = () => {
  // Datos de ejemplo para los notebooks. Eventualmente vendrán de la API.
  const notebooks = [
    { id: 1, title: 'Proyecto de Tesina', noteCount: 12 },
    { id: 2, title: 'Apuntes de React Avanzado', noteCount: 8 },
    { id: 3, title: 'Configuraciones de Docker', noteCount: 5 },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-dark font-display">Mis Notebooks</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-orange-accent rounded-lg hover:bg-yellow-accent transition-colors duration-300 shadow-lg">
          <FaPlus />
          <span>Crear Notebook</span>
        </button>
      </div>

      {/* Grid para los notebooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notebooks.map((notebook) => (
          <div 
            key={notebook.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-teal-dark"
          >
            <div className="flex items-center gap-4 mb-2">
              <FaBook className="text-2xl text-teal-dark" />
              <h2 className="text-xl font-semibold text-gray-800">{notebook.title}</h2>
            </div>
            <p className="text-gray-500">{notebook.noteCount} notas</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default HomePage;

