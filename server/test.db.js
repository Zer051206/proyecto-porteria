// test_db.js
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { getPool } from "./src/config/db.config.js";

async function testPoolConnection() {
    let conn;
    try {
        console.log('Intentando obtener una conexión del pool...');
        
        // Obtiene la conexión usando la nueva función getPool()
        const pool = getPool();
        conn = await pool.getConnection();

        console.log('¡Conexión del pool exitosa!');
        const rows = await conn.query("SELECT 1+1 as result");
        console.log('Resultado de la consulta:', rows[0].result);

    } catch (err) {
        console.error('Error de conexión:', err.message);
        console.error('Detalles del error:', err);
    } finally {
        if (conn) conn.release();
    }
}

testPoolConnection();