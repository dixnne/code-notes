// frontend/src/components/Mermaid.jsx
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "../contexts/ThemeContext";

// Inicialización global básica (se refina en el componente)
mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
});

const Mermaid = ({ code }) => {
  const ref = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);
  const { theme } = useTheme(); // Obtenemos el tema actual (light/dark)

  useEffect(() => {
    // Configurar el tema de Mermaid antes de renderizar
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: "loose",
      fontFamily: 'Inter, sans-serif' // Usar nuestra fuente
    });

    const renderDiagram = async () => {
      try {
        // Generar un ID único para este renderizado
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // mermaid.render devuelve un objeto { svg } en versiones recientes (v10+)
        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        console.error("Error renderizando Mermaid:", err);
        // Mermaid lanza errores al DOM a veces, intentamos limpiarlos visualmente
        setSvgContent("");
        setError("Error de sintaxis en el diagrama");
      }
    };

    if (code) {
      renderDiagram();
    }
  }, [code, theme]); // Re-renderizar si cambia el código o el tema

  if (error) {
    return (
      <div className="p-4 border border-red-500/50 bg-red-500/10 rounded text-red-500 text-sm font-mono">
        {error}
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-container flex justify-center p-4 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};

export default Mermaid;