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
  storage: multer.diskStorage({}), 
  limits: {
    fileSize: 40 * 1024 * 1024, 
  },
});

saveImage.use(bodyParser.json({ limit: "100mb" }));
saveImage.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

saveImage.post(
  "/register",
  uploadMiddleware.single("profilePicture"),
  async (req, res) => {
    const { username, password, email } = req.body; 
    const { path } = req.file;

    try {
      const cloudinaryUploadResult = await cloudinary.uploader.upload(path);
      const { secure_url } = cloudinaryUploadResult;

      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
        email,
        profilePicture: secure_url,
      });
      const savedUser = await userDoc.save(); // Guardar el usuario en la base de datos

      res.json(savedUser);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
);


console.log("cloudinary is here bro");

module.exports = saveImage;
