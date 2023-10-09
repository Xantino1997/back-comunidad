const express = require("express");
const Logout = express();

// Endpoint para el logout
Logout.post('/logout', (req, res) => {
  // Aquí puedes realizar cualquier lógica adicional que necesites antes de limpiar el token
  // Limpia el token estableciendo una cookie con un valor vacío y tiempo de vida cero
  res.cookie('token', '', { expires: new Date(0) }).json({ message: 'Logout exitoso' });
});

module.exports = Logout;
