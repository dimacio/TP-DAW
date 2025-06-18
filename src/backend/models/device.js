const db = require('../mysql-connector');

class Device {
    // --- NUEVA FUNCIÓN ---
    static getUniqueTypes() {
        return new Promise((resolve, reject) => {
            db.query("SELECT DISTINCT tipo FROM Devices ORDER BY tipo", (err, results) => {
                if (err) reject(err);
                // Mapeamos para obtener un array de strings en lugar de un array de objetos
                resolve(results.map(row => row.tipo));
            });
        });
    }
    // --------------------

    static getAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM Devices", (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM Devices WHERE id = ?", [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static create(device) {
        return new Promise((resolve, reject) => {
            // Incluimos el nuevo campo `tipo`
            const { nombre_id, ubicacion, tipo, estado, nivel } = device;
            const query = "INSERT INTO Devices (nombre_id, ubicacion, tipo, estado, nivel) VALUES (?, ?, ?, ?, ?)";
            db.query(query, [nombre_id, ubicacion, tipo, estado, nivel], (err, result) => {
                if (err) reject(err);
                // Devolvemos el objeto completo con su nuevo ID
                this.getById(result.insertId).then(resolve).catch(reject);
            });
        });
    }

    static update(id, device) {
        return new Promise((resolve, reject) => {
            // Incluimos el nuevo campo `tipo`
            const { nombre_id, ubicacion, tipo, estado, nivel } = device;
            const query = "UPDATE Devices SET nombre_id = ?, ubicacion = ?, tipo = ?, estado = ?, nivel = ? WHERE id = ?";
            db.query(query, [nombre_id, ubicacion, tipo, estado, nivel, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

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
