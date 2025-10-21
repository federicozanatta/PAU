import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './Auth.context';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

const getCartStorageKey = (userEmail) => {
  return userEmail ? `cart_${userEmail}` : 'cart_guest';
};

const loadCartFromStorage = (userEmail) => {
  try {
    const key = getCartStorageKey(userEmail);
    const storedCart = localStorage.getItem(key);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error al cargar carrito desde localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (userEmail, cartItems) => {
  try {
    const key = getCartStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error al guardar carrito en localStorage:', error);
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userEmail = user?.email || null;

  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(userEmail));

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

  // Establecer cantidad específica de un producto
  const setProductQuantity = (producto, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(producto.id);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === producto.id);

      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: cantidad }
            : item
        );
      } else {
        // Si no existe, agregarlo con la cantidad especificada
        return [...prevItems, { ...producto, cantidad: cantidad }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    saveCartToStorage(userEmail, cartItems);
  }, [cartItems, userEmail]);

  useEffect(() => {
    const storedCart = loadCartFromStorage(userEmail);
    setCartItems(storedCart);
  }, [userEmail]);

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
    setProductQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};