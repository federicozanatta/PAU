import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#CBA0FF", // Lila suave
      light: "#E6D3FF", // Lila más claro
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6A0DAD", // Morado oscuro
      contrastText: "#ffffff",
    },

    text: {
      primary: "#2E2E2E", // Gris oscuro
      secondary: "#6A0DAD",
    },
    accent: {
      main: "#FF6EC7", // Rosa chicle
    },
    info: {
      main: "#AEEEEE", // Celeste suave para detalles
    },
    success: {
      main: "#4CAF50",
      light: "#81C784",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB74D",
    },
    error: {
      main: "#F44336",
      light: "#EF5350",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#4d5656",
        },
        "#root": {
          width: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
