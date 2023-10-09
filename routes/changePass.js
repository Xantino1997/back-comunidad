const express = require('express');
const changePasswordRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

// Ruta para cambiar la contraseña sin autenticación previa
changePasswordRouter.put('/cambiar-password', async (req, res) => {
  const { newPassword } = req.body;

  try {
    // Encuentra al usuario por su dirección de correo electrónico
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Encripta la nueva contraseña antes de almacenarla en la base de datos
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualiza la contraseña encriptada del usuario en la base de datos
    user.password = hashedPassword;
    await user.save();

   
    res.json({ success: true, message: 'Contraseña cambiada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
  }
});

module.exports = changePasswordRouter;
