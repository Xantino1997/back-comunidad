const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const noticiasRouter = require('./routes/noticias');
const saveImage = require('./routes/cloudinary');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.DB_KEY;
const jwtSecretKey = process.env.SECRET_KEY; // Cambia esta clave por una segura en producción

// Configuración de middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use( loginRouter);
app.use( logoutRouter);
app.use(saveImage);
// Conexión a la base de datos MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
