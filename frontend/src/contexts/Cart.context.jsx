import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === producto.id);
      
      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productoId));
  };

  // Decrementar cantidad
  const decrementQuantity = (productoId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productoId) {
          if (item.cantidad > 1) {
            return { ...item, cantidad: item.cantidad - 1 };
          } else {
            // Si la cantidad es 1, eliminar el producto
            return null;
          }
        }
        return item;
      }).filter(Boolean); // Filtrar elementos null
    });
  };

  // Decrementar una unidad sin eliminar completamente
  const decrementOne = (productoId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productoId && item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      });
    });
  };

  // Obtener cantidad total de productos
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productoId) => {
    return cartItems.some(item => item.id === productoId);
  };

  // Obtener cantidad de un producto específico
  const getItemQuantity = (productoId) => {
    const item = cartItems.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decrementQuantity,
    decrementOne,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};