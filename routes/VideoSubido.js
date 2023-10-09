const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Video = require('../models/Video'); 
const fs = require('fs');
const tmpDir = '/tmp';

// Verifica si el directorio temporal existe
if (!fs.existsSync(tmpDir)) {
  // Crea el directorio temporal si no existe
  fs.mkdirSync(tmpDir);
}


const VideoRouter = express.Router();

// Configura la carga de archivos con multer
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 megabytes
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('video/')) {
      callback(null, true); // Aceptar archivos de video
    } else {
      callback(new Error('El archivo debe ser un video válido.'), false);
    }
  },
});

// Ruta para subir un video
VideoRouter.post(
  '/subir-video',
  uploadMiddleware.single('video'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'No se ha proporcionado ningún archivo de video.' });
      }

      // Crear un archivo temporal con el contenido del Buffer
      const tempFilePath = `/tmp/${Date.now()}_video.mp4`; // Puedes personalizar el nombre y la extensión
      fs.writeFileSync(tempFilePath, req.file.buffer);

      // Subir el video temporal a Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'video',
      });

      // Eliminar el archivo temporal después de subirlo a Cloudinary
      fs.unlinkSync(tempFilePath);

      // Crear un nuevo objeto de video con los datos de Cloudinary
      const nuevoVideo = new Video({
        nombre: req.body.nombreArchivo || 'Video sin nombre', // Puedes personalizar esto
        url: result.secure_url, // URL del video en Cloudinary
      });

      // Guardar el video en MongoDB
      await nuevoVideo.save();

      return res
        .status(201)
        .json({ mensaje: 'El video se ha subido correctamente.' });
    } catch (error) {
      console.error('Error al subir el video:', error);
      return res
        .status(500)
        .json({ error: 'Ha ocurrido un error al subir el video.' });
    }
  }
);

console.log('video ruta')

module.exports = VideoRouter;
