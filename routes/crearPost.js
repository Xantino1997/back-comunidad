// Importa las dependencias necesarias
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Post = require("../models/Post"); // Asegúrate de que el modelo Post esté en el lugar correcto
const jwt = require("jsonwebtoken");
const secret =  process.env.SECRET_KEY;
const Suscriptor = require('../models/Suscriptores');
const nodemailer = require('nodemailer');
const path = require('path');

const imageMail = path.join(__dirname, '..', 'assets', 'patron.png');

const postRouter = express.Router();

const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ala282016@gmail.com',
    pass: "enyb yajs tjze exfy"
  },
};

const transport = nodemailer.createTransport(config);
// let lastSubscriberId = 0;


// Define la configuración de multer para el almacenamiento de archivos
const uploadMiddleware = multer({
  storage: multer.diskStorage({}), // Configuración vacía para evitar guardar localmente
  limits: {
    fileSize: 40 * 1024 * 1024, // 40 megabytes
  },
});

// Ruta para crear un nuevo post
postRouter.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { path } = req.file;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autorización no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content, profileAvatar, localidad } = req.body;

    try {
      const cloudinaryUploadResult = await cloudinary.uploader.upload(path);
      const { secure_url } = cloudinaryUploadResult;

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: secure_url, // Guarda la URL de Cloudinary en lugar de la ruta local
        profilePicture: profileAvatar,
        author: info.id,
        localidad,
      });

      const subscribers = await Suscriptor.find({}, "email");

      for (const subscriber of subscribers) {
        const subscriberEmail = subscriber.email;

        // Enlace al post
        const postId = postDoc._id;
        const link = `https://centromocovi.vercel.app`;

        // Envío del correo electrónico al suscriptor actual
        const mailOptions = {
          from: "ala282016@gmail.com", // Tu dirección de correo electrónico
          to: subscriberEmail,
          subject: "Nuevo post creado",
          html: `Hola, ¿cómo estás? Queríamos contarte que se creó un nuevo post:<br><br>
          <h2>Título: ${title}</h2><br>
          Dale click en el siguiente enlace:<br><br>
          <hr>
          <img src=${imageMail} alt="image autor" />
          <button style="background-color: #66b3ff; color: white; font-weight: bold; border-radius: 15px">
            <a href="${link}" style="color: white; text-decoration: none;">VER EL ARTÍCULO</a>
          </button>`,
        };

        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Correo enviado:", info.response);
          }
        });
      }

      res.json(postDoc);
    } catch (e) {
      console.log(e + 'error no se envio el mail tampoco');
      res.status(400).json(e);
    }
  });
});



postRouter.get('/post', async (req, res) => {

  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

postRouter.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})


console.log('Post te envia saludos bro')
module.exports = postRouter;
