// src/backend/routes/devices.js

const express = require('express');
const router = express.Router();
const Device = require('../models/device');

// --- NUEVO ENDPOINT ---
// GET /devices/types - Obtener todos los tipos de dispositivos únicos
router.get('/types', async (req, res) => {
    console.log("-> Se ha recibido una petición GET en /devices/types");
    try {
        const types = await Device.getUniqueTypes();
        console.log("<- Respondiendo a GET /devices/types con los datos.");
        res.status(200).json(types);
    } catch (err) {
        console.error("!! ERROR en GET /devices/types:", err);
        res.status(500).json({ error: err.message });
    }
});
// --------------------

// GET /devices - Obtener todos los dispositivos
router.get('/', async (req, res) => {
    console.log("-> Se ha recibido una petición GET en /devices");
    try {
        const devices = await Device.getAll();
        console.log("<- Respondiendo a GET /devices con los datos.");
        res.status(200).json(devices);
    } catch (err) {
        console.error("!! ERROR en GET /devices:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /devices/:id - Obtener un dispositivo por ID
router.get('/:id', async (req, res) => {
    console.log(`-> Se ha recibido una petición GET en /devices/${req.params.id}`);
    try {
        const device = await Device.getById(req.params.id);
        if (device) {
            console.log(`<- Respondiendo a GET /devices/${req.params.id} con datos.`);
            res.status(200).json(device);
        } else {
            console.log(`<- Respondiendo a GET /devices/${req.params.id} con 404.`);
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    } catch (err) {
        console.error(`!! ERROR en GET /devices/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST /devices - Crear un nuevo dispositivo
router.post('/', async (req, res) => {
    console.log("-> Se ha recibido una petición POST en /devices con el body:", req.body);
    try {
        // Aseguramos que el campo tipo se maneje correctamente
        const newDevice = await Device.create(req.body);
        console.log("<- Respondiendo a POST /devices con el nuevo dispositivo creado.");
        res.status(201).json(newDevice);
    } catch (err) {
        console.error("!! ERROR en POST /devices:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /devices/:id - Actualizar un dispositivo
router.put('/:id', async (req, res) => {
    console.log(`-> Se ha recibido una petición PUT en /devices/${req.params.id} con el body:`, req.body);
    try {
        // Aseguramos que el campo tipo se maneje correctamente
        const result = await Device.update(req.params.id, req.body);
        if (result.affectedRows > 0) {
            console.log(`<- Respondiendo a PUT /devices/${req.params.id} con 200 OK.`);
            // Devolvemos el dispositivo actualizado para mantener la SPA sincronizada
            const updatedDevice = await Device.getById(req.params.id);
            res.status(200).json(updatedDevice);
        } else {
            console.log(`<- Respondiendo a PUT /devices/${req.params.id} con 404.`);
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    } catch (err) {
        console.error(`!! ERROR en PUT /devices/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /devices/:id - Eliminar un dispositivo
router.delete('/:id', async (req, res) => {
    console.log(`-> Se ha recibido una petición DELETE en /devices/${req.params.id}`);
    try {
        const result = await Device.delete(req.params.id);
        if (result.affectedRows > 0) {
            console.log(`<- Respondiendo a DELETE /devices/${req.params.id} con 200 OK.`);
            res.status(200).json({ message: 'Dispositivo eliminado' });
        } else {
            console.log(`<- Respondiendo a DELETE /devices/${req.params.id} con 404.`);
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    } catch (err) {
        console.error(`!! ERROR en DELETE /devices/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
