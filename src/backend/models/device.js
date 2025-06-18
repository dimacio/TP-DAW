const db = require('../mysql-connector');

class Device {
    // Obtener todos los dispositivos
    static getAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM Devices", (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    // Obtener un dispositivo por su ID
    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM Devices WHERE id = ?", [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    // Crear un nuevo dispositivo
    static create(device) {
        return new Promise((resolve, reject) => {
            const { nombre_id, ubicacion, estado, nivel } = device;
            const query = "INSERT INTO Devices (nombre_id, ubicacion, estado, nivel) VALUES (?, ?, ?, ?)";
            db.query(query, [nombre_id, ubicacion, estado, nivel], (err, result) => {
                if (err) reject(err);
                resolve({ id: result.insertId, ...device });
            });
        });
    }

    // Actualizar un dispositivo
    static update(id, device) {
        return new Promise((resolve, reject) => {
            const { nombre_id, ubicacion, estado, nivel } = device;
            const query = "UPDATE Devices SET nombre_id = ?, ubicacion = ?, estado = ?, nivel = ? WHERE id = ?";
            db.query(query, [nombre_id, ubicacion, estado, nivel, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Eliminar un dispositivo
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM Devices WHERE id = ?", [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Device;