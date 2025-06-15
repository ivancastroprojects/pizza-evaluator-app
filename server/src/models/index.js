const path = require('path')
const Sequelize = require('sequelize')

// Configure Sequelize for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  // Construye la ruta desde este archivo (__dirname) para apuntar siempre a la raíz del proyecto.
  // Esto garantiza que tanto la app como el script de población usen la MISMA base de datos.
  storage: path.join(__dirname, '..', '..', '..', 'database.sqlite'),
  logging: false // Optional: disable logging or use console.log for debugging
})

const models = {
  User: sequelize.import('./user'),
  Manager: sequelize.import('./manager'),
  Pizza: sequelize.import('./pizza'),
  Vote: sequelize.import('./vote')
}

// Opcional: Ejecutar asociaciones si están definidas
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
