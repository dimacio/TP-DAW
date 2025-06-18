// src/backend/index.js

const express = require('express');
const app = express();
const PORT = 3000;

const deviceRoutes = require('./routes/devices');
const dbConnection = require('./mysql-connector'); 

// Middlewares
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('API de Smart Home funcionando!');
});

// --- AÑADE ESTA RUTA DE PRUEBA AQUÍ ---
app.get('/test', (req, res) => {
    console.log("-> Petición de prueba recibida en /test");
    res.status(200).send("El servidor está vivo y responde desde /test.");
});
// ------------------------------------

// Rutas de la API para /devices
app.use('/devices', deviceRoutes);

app.listen(PORT, () => {
    console.log(`NodeJS API running on http://localhost:${PORT}`);
});