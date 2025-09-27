import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import theme from "./theme";
import Home from "./pages/Home";
import Categoria from "./pages/Categoria";
import DetalleCategoria from "./pages/DetalleCategoria";
import ProductoDetalle from "./pages/ProductoDetalle";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductosAdmin from "./pages/admin/productos/ProductosAdmin";
import CategoriasAdmin from "./pages/admin/categorias/CategoriasAdmin";
import AdministradoresAdmin from "./pages/admin/administradores/AdministradoresAdmin";
import CuponesAdmin from "./pages/admin/cupones/CuponesAdmin";
import { ChatbotWidget } from "./components/Chatbot";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categoria />} />
        <Route path="/categorias/:id" element={<DetalleCategoria />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        
        
        {/* Rutas de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="administradores" element={<AdministradoresAdmin />} />
          <Route path="cupones" element={<CuponesAdmin />} />
        </Route>
      </Routes>
      
      {/* Chatbot disponible en todas las páginas */}
      <ChatbotWidget />
    </ThemeProvider>
  );
};

export default App;
