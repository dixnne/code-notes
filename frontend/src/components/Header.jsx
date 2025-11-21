import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Añadido useParams
import { getNotebooks } from '../services/api';
import { FaNoteSticky } from 'react-icons/fa6';
import { FiLogOut, FiSun, FiMoon, FiChevronDown, FiBook, FiChevronRight } from 'react-icons/fi'; // Añadido FiChevronRight

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { notebookId } = useParams(); // Obtener el ID del notebook de la URL si existe

  // Estado para el dropdown de notebooks
  const [notebooks, setNotebooks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar notebooks al montar el componente (si hay usuario)
  useEffect(() => {
    if (user) {
      getNotebooks()
        .then((res) => {
            const data = res.data || [];
            setNotebooks(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error cargando notebooks en header:", err));
    }
  }, [user]);

  // Determinar el notebook activo basado en la URL
  const activeNotebook = notebookId 
    ? notebooks.find(n => n.id === parseInt(notebookId)) 
    : null;

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderUserMenu = () => {
    if (!user) {
      return (
        <div className="w-24 h-6 bg-light-text-secondary/10 dark:bg-dark-text-secondary/10 rounded animate-pulse" />
      );
    }
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary hidden sm:block">
          {user.username}
        </span>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
          title="Cerrar sesión"
        >
          <FiLogOut />
        </button>
      </div>
    );
  };

  return (
    <header className="flex flex-col w-full shadow-md border-b border-black/10 dark:border-white/10 bg-light-card dark:bg-dark-card transition-colors duration-300">
      
      {/* --- FILA SUPERIOR: Logo, Breadcrumb, Usuario, Tema --- */}
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6">
        <nav className="flex w-full justify-between items-center max-w-7xl mx-auto">
          
          {/* Sección Izquierda: Logo + Indicador de Notebook */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <FaNoteSticky className="text-primary text-3xl group-hover:text-accent1 transition-colors" />
              <span className="text-2xl font-bold font-display text-light-text dark:text-dark-text">
                Code<span className="text-primary group-hover:text-accent1 transition-colors">Notes</span>
              </span>
            </Link>

            {/* Separador y Nombre del Notebook Actual (Breadcrumb) */}
            {activeNotebook && (
              <div className="flex items-center ml-4 pl-4 border-l border-light-text-secondary/30 dark:border-dark-text-secondary/30 h-8 animate-fade-in">
                <FiBook className="mr-2 text-light-text-secondary dark:text-dark-text-secondary" />
                <span className="text-lg font-medium text-light-text dark:text-dark-text truncate max-w-[200px] md:max-w-[300px]">
                  {activeNotebook.title}
                </span>
              </div>
            )}
          </div>

          {/* Menú de Usuario y Toggle de Tema */}
          <div className="flex items-center space-x-4">
            {renderUserMenu()}

            <button
              onClick={toggleTheme}
              className="text-xl text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </nav>
      </div>

      {/* --- FILA INFERIOR: Barra de Navegación / Dropdown --- */}
      {user && (
        <div className="h-10 w-full bg-light-bg dark:bg-dark-bg border-t border-black/5 dark:border-white/5 px-4 md:px-6 flex items-center">
            <div className="max-w-7xl mx-auto w-full flex items-center space-x-4">
                
                {/* Dropdown de Notebooks */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors focus:outline-none ${
                          activeNotebook 
                            ? 'text-primary dark:text-accent1 font-bold' 
                            : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary'
                        }`}
                    >
                        <FiBook className="mr-1" />
                        <span>{activeNotebook ? "Cambiar Notebook" : "Mis Notebooks"}</span>
                        <FiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Menú Desplegable */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-light-card dark:bg-dark-card rounded-lg shadow-xl border border-black/10 dark:border-white/10 z-50 overflow-hidden py-1">
                            <div className="max-h-64 overflow-y-auto">
                                {notebooks.length > 0 ? (
                                    notebooks.map(notebook => (
                                        <button
                                            key={notebook.id}
                                            onClick={() => {
                                                navigate(`/notebooks/${notebook.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                                              activeNotebook && activeNotebook.id === notebook.id
                                                ? 'bg-primary/10 text-primary dark:text-accent1'
                                                : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                                            }`}
                                        >
                                            <span className="truncate">{notebook.title}</span>
                                            {activeNotebook && activeNotebook.id === notebook.id && (
                                              <span className="w-2 h-2 rounded-full bg-primary dark:bg-accent1 ml-2"></span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary italic">
                                        No tienes notebooks aún.
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1">
                                <Link 
                                    to="/"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block w-full text-left px-4 py-2 text-xs text-primary hover:underline"
                                >
                                    Ver todos los notebooks...
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;