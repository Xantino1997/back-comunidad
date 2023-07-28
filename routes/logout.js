const express = require("express");
const bodyParser = require("body-parser");
const Logout = express();

// Simulación de una variable para almacenar los usuarios que iniciaron sesión
let loggedInUsers = [];

// Endpoint para el logout
Logout.post("/logout", (req, res) => {
  const { username } = req.body;

  // Verificar si el usuario está conectado
  const userIndex = loggedInUsers.indexOf(username);
  if (userIndex !== -1) {
    // Si el usuario está conectado, eliminamos su sesión
    loggedInUsers.splice(userIndex, 1);
    res.status(200).json({ success: true, message: "¡Sesión cerrada exitosamente!" });
  } else {
    // Si el usuario no está conectado, devolvemos un mensaje de error
    res.status(400).json({ success: false, message: "El usuario no está conectado" });
  }
});

console.log("Logout is here");

module.exports = Logout;
