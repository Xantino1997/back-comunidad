
const cors = require('cors'); // Importa el middleware cors
require('dotenv').config();
const express = require('express');
const Login = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Route for login
Login.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  try {
    // Buscamos el usuario en la base de datos por su nombre de usuario
    const user = await User.findOne({ username });
    console.log(JSON.stringify(user + ' useer que deberia buscar y traer'));

    if (!user) {
      // Si el usuario no existe, enviamos una respuesta de error
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparamos la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Si la contraseña es incorrecta, enviamos una respuesta de error
      return res.status(401).json({ success: false, message: 'Credenciales no válidas' });
    }

    // Si las credenciales son válidas, enviamos una respuesta de éxito
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al iniciar sesión' });
  }
});

// module.exports = router;

module.exports = Login;