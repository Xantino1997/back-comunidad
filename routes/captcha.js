const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const captchaRouter = express.Router();
const KeyCaptcha = express.Router();
const session = require("express-session");

// Configura express-session
captchaRouter.use(
  session({
    secret: "tu_secreto_aqui", // Cambia esto por una cadena secreta
    resave: false,
    saveUninitialized: true,
  })
);

// Configura el middleware de bodyParser para parsear JSON
captchaRouter.use(bodyParser.json());

// Reemplaza estas variables con tus credenciales de reCAPTCHA
const RECAPTCHA_SECRET_KEY = "6LdQt4QoAAAAAETpz94ehT4JbsfEtDp13SivHywg";

// Ruta para verificar reCAPTCHA v3
captchaRouter.post("/verify-recaptcha", async (req, res) => {
  const { recaptchaToken } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      {}
    );

    const { success } = response.data;

    if (success) {
      // El reCAPTCHA fue verificado correctamente
      res.json({ success: true });
    } else {
      // El reCAPTCHA no fue verificado correctamente
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error al verificar reCAPTCHA:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});



// Ruta para obtener la clave secreta de reCAPTCHA desde el servidor
KeyCaptcha.get("/api/recaptcha-secret", (req, res) => {
    // Obtén la clave secreta de reCAPTCHA desde una variable de entorno o archivo de configuración
    const reCAPTCHASecretKey = process.env.RECAPTCHA_SECRET_KEY; // Reemplaza con tu forma de obtener la clave secreta
  
    if (!reCAPTCHASecretKey) {
      // Manejar el caso en el que no se encuentre la clave secreta
      return res.status(500).json({ error: "Clave secreta de reCAPTCHA no configurada en el servidor." });
    }
  
    // Enviar la clave secreta al cliente
    res.json({ secretKey: reCAPTCHASecretKey });
  });
  

  
  
  
  

console.log("recaptcha")
module.exports = captchaRouter;
