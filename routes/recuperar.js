const express = require('express');
const nodemailer = require('nodemailer');
const RecuperoRouter = express.Router();

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

RecuperoRouter.post("/recuperar-password", (req, res) => {
    const { email, token } = req.body;
  
    const mailOptions = {
      from: "ala282016@gmail.com", // Reemplaza con tu dirección de correo
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Tu código de recuperación de contraseña es: ${token}`,
    };
  
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error al enviar el correo" });
      } else {
        console.log("Correo enviado:", info.response);
        res.status(200).json({ message: "Token enviado al correo" });
      }
    });
  });

  console.log('sera que  recuperar')

module.exports = RecuperoRouter;
