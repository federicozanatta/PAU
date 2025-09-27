import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Fade,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useChatbot } from '../../hooks/useChatbot';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy el asistente virtual de Divino Diseño. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = useRef(null);
  const { generateEnhancedContext, detectIntent } = useChatbot();

  // Inicializar Gemini AI
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('VITE_GEMINI_API_KEY no está configurada');
    }
  }, []);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userInput) => {
    if (!genAI.current) {
      return 'Lo siento, el servicio de chat no está disponible en este momento.';
    }

    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-pro' });
      
      // Usar contexto enriquecido con datos reales
      const context = generateEnhancedContext(userInput);
      const intent = detectIntent(userInput);
      
      console.log('Intent detectado:', intent); // Para debugging

      const result = await model.generateContent(context);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error con Gemini AI:', error);
      return 'Lo siento, no pude procesar tu consulta en este momento. ¿Podrías intentar reformular tu pregunta?';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: 'primary.main',
            color: 'white',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Box>

      {/* Ventana del chat */}
      <Fade in={isOpen}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            width: 350,
            height: 500,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 6,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Header del chat */}
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon />
              <Typography variant="h6">Asistente Virtual</Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Área de mensajes */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              backgroundColor: '#f5f5f5',
            }}
          >
            <List sx={{ p: 1 }}>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                      mx: 1,
                    }}
                  >
                    {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      backgroundColor: message.sender === 'user' ? 'primary.light' : 'white',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {message.text}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Escribiendo...
                  </Typography>
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          <Divider />

          {/* Input para escribir mensajes */}
          <Box sx={{ p: 2, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={3}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                color="primary"
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default ChatbotWidget;