require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Programa = require('./models/Programa');

const app = express();

// Middleware para JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// 👉 Servir archivos estáticos (index.html, estilos, scripts)
app.use(express.static(path.join(__dirname, 'public')));

// 👉 Servir audios desde la carpeta pública
app.use('/audios', express.static(path.join(__dirname, 'public/audios')));

// 👉 API - Obtener todos los programas
app.get('/api/programas', async (req, res) => {
  try {
    const programas = await Programa.find();
    res.json(programas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener programas' });
  }
});

// 👉 API - Crear un nuevo programa
app.post('/api/programas', async (req, res) => {
  try {
    const { titulo, fecha, archivo, temas, participantes } = req.body;
    const nuevoPrograma = new Programa({ titulo, fecha, archivo, temas, participantes });
    await nuevoPrograma.save();
    res.status(201).json(nuevoPrograma);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar el programa' });
  }
});

// 👉 Fallback - Redirige todas las rutas desconocidas a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 👉 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
