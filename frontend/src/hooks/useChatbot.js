import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook personalizado para extender funcionalidades del chatbot
export const useChatbot = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar datos de productos y categorías para el contexto del chatbot
    const loadData = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          axios.get('http://localhost:3000/api/productos?limit=50'),
          axios.get('http://localhost:3000/api/categorias')
        ]);
        
        setProductos(productosRes.data.data);
        setCategorias(categoriasRes.data.data);
      } catch (error) {
        console.error('Error cargando datos para chatbot:', error);
      }
    };

    loadData();
  }, []);

  // Función para generar contexto enriquecido con datos reales
  const generateEnhancedContext = (userInput) => {
    const productosInfo = productos.slice(0, 10).map(p => 
      `- ${p.nombre}: $${p.precio} (Stock: ${p.stock})`
    ).join('\n');

    const categoriasInfo = categorias.map(c => c.nombre).join(', ');

    return `
      Eres un asistente virtual para "Divino Diseño", una tienda online de productos de diseño y decoración.
      
      INFORMACIÓN DE LA EMPRESA:
      - Nombre: Divino Diseño
      - Email: divinodiseno@gmail.com
      - Teléfono: +54 9 1234 5678
      - Ofrecemos descuentos especiales para docentes con Mercado Pago
      - Tenemos cupones de descuento disponibles
      
      CATEGORÍAS DISPONIBLES:
      ${categoriasInfo}
      
      ALGUNOS PRODUCTOS DESTACADOS:
      ${productosInfo}
      
      INSTRUCCIONES:
      - Responde de manera amigable y profesional
      - Si preguntan por productos específicos, usa la información proporcionada
      - Si preguntan sobre categorías, menciona las disponibles
      - Para consultas sobre stock o precios específicos, sugiere visitar la página del producto
      - Si preguntan sobre descuentos, menciona la oferta para docentes y los cupones
      - Mantén respuestas concisas pero útiles (máximo 150 palabras)
      - Si no tienes información específica, sugiere contactar por email o teléfono
      
      Pregunta del usuario: ${userInput}
    `;
  };

  // Función para detectar intenciones específicas
  const detectIntent = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('precio') || input.includes('costo') || input.includes('cuanto')) {
      return 'precio';
    }
    if (input.includes('stock') || input.includes('disponible') || input.includes('hay')) {
      return 'stock';
    }
    if (input.includes('descuento') || input.includes('oferta') || input.includes('cupon')) {
      return 'descuento';
    }
    if (input.includes('categoria') || input.includes('tipo') || input.includes('clase')) {
      return 'categoria';
    }
    if (input.includes('contacto') || input.includes('telefono') || input.includes('email')) {
      return 'contacto';
    }
    
    return 'general';
  };

  return {
    productos,
    categorias,
    generateEnhancedContext,
    detectIntent
  };
};