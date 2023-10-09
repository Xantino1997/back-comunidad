const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  nombre: String,
  url: String,
  fechaCreacion: { type: Date, default: Date.now }, 
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
