import React, { useEffect, useState } from "react";
import Categoria from "./Categoria";
import axios from "axios";
import { useParams } from "react-router-dom";

function DetalleCategoria() {
  const { id } = useParams();
  const [detalleCategoria, setDetalleCategoria] = useState({});
  useEffect(() => {
    const getDetalleCategoria = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/categorias/${id}`
        );
        setDetalleCategoria(response.data.data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    getDetalleCategoria();
  }, [id]);

  if (!detalleCategoria) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>{detalleCategoria.nombre}</h1>
      <img src={detalleCategoria.imagenUrl} alt={detalleCategoria.nombre} />
    </div>
  );
}

export default DetalleCategoria;
