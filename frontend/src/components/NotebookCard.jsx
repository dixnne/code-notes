// frontend/src/components/NotebookCard.jsx
import { FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // 1. Importar Link

// 2. Convertir la tarjeta en un Link
export default function NotebookCard({ notebook }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/notebooks/${notebook.id}`}
      className="group block"
    >
      <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-blue-500/20">
        <div>
          <div className="mb-4 flex items-center space-x-3">
            <FiBook className="h-6 w-6 text-brand-600" />
            <h3 className="font-heading text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {notebook.title}
            </h3>
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Actualizado: {formatDate(notebook.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

