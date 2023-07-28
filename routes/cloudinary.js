const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const saveImage = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const salt = bcrypt.genSaltSync(10);

const uploadMiddleware = multer({
  storage: multer.diskStorage({}), // Configuración vacía para evitar guardar localmente
  limits: {
    fileSize: 40 * 1024 * 1024, // 40 megabytes
  },
});

// Configuración de Multer para almacenar la imagen temporalmente en el servidor

// Aumentar el límite del tamaño máximo del cuerpo de la solicitud
saveImage.use(bodyParser.json({ limit: "100mb" }));
saveImage.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

saveImage.post(
  "/register",
  uploadMiddleware.single("profilePicture"),
  async (req, res) => {
    const { username, password } = req.body;
    const { path } = req.file;

    try {
      const cloudinaryUploadResult = await cloudinary.uploader.upload(path);
      const { secure_url } = cloudinaryUploadResult;

      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
        profilePicture: secure_url,
      });
      const savedUser = await userDoc.save(); // Guarda el usuario en la base de datos

      res.json(savedUser);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
);

console.log("cloudinary is here bro");

module.exports = saveImage;
