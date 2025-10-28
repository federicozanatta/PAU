import { useState } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  Stack,
  Alert
} from "@mui/material";
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon,
  Send as SendIcon,
  AccessTime as ClockIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });
  
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    setEnviado(true);
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: ""
      });
      setEnviado(false);
    }, 3000);
  };

  const infoContacto = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      titulo: "Teléfono",
      info: "+54 261 662 6117",
      descripcion: "Lunes a Viernes: 9:00 a 13:00 - 16:30 a 19:30hs Y Sábados de 9:00 a 13:00"
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: "error.main" }} />,
      titulo: "Email",
      info: "divinodiseno@gmail.com",
      descripcion: "Respondemos lo antes posible"
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: "success.main" }} />,
      titulo: "Dirección",
      info: "Alvear 581, Luján de Cuyo",
      descripcion: "Mendoza, Argentina"
    },
    {
      icon: <ClockIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      titulo: "Horarios",
      info: "Lun - Vie: 9:00 a 13:00 - 16:30 a 19:30hs",
      descripcion: "Sáb: 9:00 - 13:00"
    }
  ];

  return (
    <>
      <Header />
      <FilterBar />
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          
          {/* Hero Section */}
          <Paper 
            elevation={3} 
            
            sx={{ 
              p: 6, 
              mb: 5, 
              borderRadius: 3, 
              textAlign: "center", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              color: "white" 
            }}
          >
            <SendIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Contáctanos
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8, opacity: 0.95 }}>
              ¿Tienes alguna consulta o proyecto en mente? Estamos aquí para ayudarte. Completa el formulario o comunícate directamente con nosotros.
            </Typography>
          </Paper>

          {/* Información de Contacto */}
          <Grid container spacing={3} sx={{ mb: 5 }} justifyContent="center">
            {infoContacto.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={2}
                   
                  sx={{ 
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    height: "100%",
                    width: "250px",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.titulo}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="primary" sx={{ mb: 0.5 }}>
                    {item.info}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.descripcion}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Formulario de Contacto */}
          <Paper elevation={2} sx={{ p: 5, borderRadius: 3 }}>
            <Box sx={{ maxWidth: 500, mx: "auto" }}>
              <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 1 }}>
                Envíanos un mensaje
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </Typography>

              {enviado && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
  <Stack spacing={3}>
    {/* Fila 1: Nombre y Email */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nombre completo"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ 
            backgroundColor: "white",
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ 
            backgroundColor: "white",
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Grid>
    </Grid>

    {/* Fila 2: Teléfono y Asunto */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Teléfono (opcional)"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          variant="outlined"
          sx={{ 
            backgroundColor: "white",
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Asunto"
          name="asunto"
          value={formData.asunto}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ 
            backgroundColor: "white",
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Grid>
    </Grid>

    {/* Mensaje */}
    <TextField
      fullWidth
      label="Mensaje"
      name="mensaje"
      value={formData.mensaje}
      onChange={handleChange}
      required
      multiline
      rows={6}
      variant="outlined"
      placeholder="Cuéntanos sobre tu consulta o proyecto..."
      sx={{ 
        backgroundColor: "white",
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
    />

    {/* Botón de envío */}
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SendIcon />}
        sx={{ 
          py: 1.8,
          px: 4,
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: 3,
          minWidth: 250,
          borderRadius: 2,
          "&:hover": { 
            boxShadow: 6,
            transform: 'scale(1.02)',
          },
          transition: 'all 0.3s'
        }}
      >
        Enviar Mensaje
      </Button>
    </Box>
  </Stack>
</form>
            </Box>
          </Paper>

          {/* Mapa de Google Maps */}
<Paper elevation={2} sx={{ p: 0, mt: 5, borderRadius: 3, overflow: "hidden" }}>
  <Box sx={{ p: 4, textAlign: "center", backgroundColor: "white" }}>
    <LocationIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
    <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
      ¡Visítanos!
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
      Estamos ubicados en la tierra del sol y del buen vino
    </Typography>
    <Typography variant="h6" fontWeight="medium" color="primary">
      Alvear 581, Luján de Cuyo - Mendoza
    </Typography>
  </Box>
  
  {/* Google Maps Embed */}
  <Box sx={{ width: "100%", height: 450 }}>
    <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.8287651234567!2d-68.8924766!3d-33.0374359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e751ca0410a7d%3A0x955730fb35b45bc0!2sDivino%20Dise%C3%B1o!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Ubicación de la librería"
/>
  </Box>
  
  <Box sx={{ p: 3, textAlign: "center", backgroundColor: "#f8f9fa" }}>
    <Typography variant="body1" color="text.secondary">
      Te esperamos de <strong>lunes a viernes de 9:00 a 18:00hs</strong> y <strong>sábados de 9:00 a 13:00hs</strong>
    </Typography>
  </Box>
</Paper>

        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Contacto;