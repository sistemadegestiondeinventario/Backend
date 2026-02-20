#!/usr/bin/env node
/**
 * scripts/seedUsers.js
 *
 * Crea tres usuarios de prueba (administrador, encargado, consultor)
 * Usar localmente: `node scripts/seedUsers.js`
 * Para apuntar a la BD de Render exportar `DATABASE_URL` o las variables `DB_*` antes de ejecutar.
 */

require('dotenv').config();

const path = require('path');
// Cargar modelos
const models = require(path.join(__dirname, '..', 'src', 'models'));
const { sequelize, Usuario } = models;

async function main() {
    try {
        console.log('Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión OK');

        const users = [
            { nombre: 'Admin Demo', email: 'admin@example.com', password: 'Admin123!', rol: 'administrador' },
            { nombre: 'Encargado Demo', email: 'encargado@example.com', password: 'Encargado123!', rol: 'encargado' },
            { nombre: 'Consultor Demo', email: 'consultor@example.com', password: 'Consultor123!', rol: 'consultor' }
        ];

        for (const u of users) {
            const [user, created] = await Usuario.findOrCreate({
                where: { email: u.email },
                defaults: u
            });

            if (created) {
                console.log(`Creado usuario: ${u.email} (${u.rol})`);
            } else {
                console.log(`Ya existe usuario: ${u.email} (no se modificó)`);
            }
        }

        console.log('Seed finalizado.');
        process.exit(0);
    } catch (err) {
        console.error('Error en seedUsers:', err.message || err);
        process.exit(1);
    }
}

main();
