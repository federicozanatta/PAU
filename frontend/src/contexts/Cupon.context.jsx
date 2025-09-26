import { createContext, useState } from "react";
import axios from "axios";

const CuponContext = createContext();

function CuponProviderWrapper({ children }) {
  const [cupon, setCupon] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");

  function validarCupon() {
    axios
      .get(`http://localhost:3000/api/cupones/validar/${codigoIngresado}`)
      .then((response) => {
        const data = response.data.data;

        if (data && data.activo) {
          setCupon({
            nombreCupon: data.nombreCupon,
            porcentajeDescuento: data.porcentajeDescuento,
          });
          setMensaje(
            `Cupón aplicado: ${data.nombreCupon} (${data.porcentajeDescuento}%)`
          );
        } else {
          setCupon(null);
          setMensaje("El código de cupón no es válido o está inactivo.");
        }
      })
      .catch((error) => {
        console.error("Error al validar cupón:", error);
        setCupon(null);
        setMensaje("Cupón inválido o no encontrado.");
      });
  }

  function quitarCupon() {
    setCupon(null);
    setMensaje("Cupón eliminado.");
  }

  return (
    <CuponContext.Provider
      value={{ setCodigoIngresado, validarCupon, cupon, mensaje, quitarCupon }}
    >
      {children}
    </CuponContext.Provider>
  );
}

export { CuponContext, CuponProviderWrapper };
