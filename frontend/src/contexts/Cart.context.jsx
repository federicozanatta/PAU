// src/contexts/Cart.context.js
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useAuth } from "./Auth.context";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// 🔹 Helpers para manejar el storage por usuario
const getCartStorageKey = (userEmail) => {
  return userEmail ? `cart_${userEmail}` : "cart_guest";
};

const loadCartFromStorage = (userEmail) => {
  try {
    const key = getCartStorageKey(userEmail);
    const storedCart = localStorage.getItem(key);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error al cargar carrito desde localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (userEmail, cartItems) => {
  try {
    const key = getCartStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error al guardar carrito en localStorage:", error);
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userEmail = user?.email || null;

  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(userEmail));

  // 🔹 Cargar carrito cuando cambia el usuario
  useEffect(() => {
    const storedCart = loadCartFromStorage(userEmail);
    setCartItems(storedCart);
  }, [userEmail]);

  // 🔹 Guardar carrito cada vez que cambia
  useEffect(() => {
    saveCartToStorage(userEmail, cartItems);
  }, [cartItems]);

  // 🔹 Agregar producto
  const addToCart = (producto) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === producto.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  // 🔹 Eliminar producto
  const removeFromCart = (productoId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productoId));
  };

  // 🔹 Decrementar cantidad (con opción de eliminar al llegar a 0)
  const decrementQuantity = (productoId, allowDelete = true) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productoId) {
            const nuevaCantidad = item.cantidad - 1;
            if (nuevaCantidad <= 0 && allowDelete) return null;
            return { ...item, cantidad: Math.max(nuevaCantidad, 0) };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // 🔹 Cantidad total
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  // 🔹 Precio total
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + ((item.precio || 0) * item.cantidad),
      0
    );
  };

  // 🔹 Verificar si está en el carrito
  const isInCart = (productoId) => {
    return cartItems.some((item) => item.id === productoId);
  };

  // 🔹 Obtener cantidad de un producto
  const getItemQuantity = (productoId) => {
    const item = cartItems.find((item) => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  // 🔹 Establecer cantidad específica
  const setProductQuantity = (producto, cantidad) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== producto.id);
      if (cantidad > 0) {
        updatedItems.push({ ...producto, cantidad });
      }
      return updatedItems;
    });
  };

  // 🔹 Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔹 Memorizar valores para evitar renders innecesarios
  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      decrementQuantity,
      getTotalItems,
      getTotalPrice,
      isInCart,
      getItemQuantity,
      setProductQuantity,
      clearCart,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
