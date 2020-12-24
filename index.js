const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

// crear servidor express
const app = express();

// base de datos
dbConnection();

// cors
app.use(cors());

// directorio publico
app.use(express.static('public'));

// lectura y parseo del body
app.use(express.json());

// rutas
// auth, crear, login, renew
app.use('/api/auth', require('./routes/auth'));
// crud eventos
app.use('/api/events', require('./routes/events'));

// escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
