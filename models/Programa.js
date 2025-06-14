const mongoose = require('mongoose');

const programaSchema = new mongoose.Schema({
  titulo: String,
  fecha: String,
  archivo: String, // Ej: "/audios/mi-audio.mp3"
  temas: [String],
  participantes: [String]
});

module.exports = mongoose.model('Programa', programaSchema);