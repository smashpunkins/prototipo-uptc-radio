require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Programa = require('./models/Programa');

const app = express();
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ MongoDB error:', err));

// 👉 Servir archivos estáticos (HTML, CSS, JS, audios)
app.use(express.static(path.join(__dirname, 'public')));

// 👉 Servir audios desde subcarpeta
app.use('/audios', express.static(path.join(__dirname, 'public/audios')));

// API - Obtener programas
app.get('/api/programas', async (req, res) => {
  try {
    const programas = await Programa.find();
    res.json(programas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener programas' });
  }
});

// API - Crear nuevo programa
app.post('/api/programas', async (req, res) => {
  try {
    const { titulo, fecha, archivo, temas, participantes } = req.body;
    const nuevo = new Programa({ titulo, fecha, archivo, temas, participantes });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar el programa' });
  }
});

// 👉 Fallback: sirve index.html si no hay otras rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
