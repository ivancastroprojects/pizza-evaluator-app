module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('vote', {
    // ID del voto (autoincremental, PK)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Username del Manager que votó (antes userName, ahora más específico)
    voterUsername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Nombre de la Pizza por la que se votó
    pizzaName: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // Timestamps (createdAt, updatedAt) se añaden por defecto por Sequelize
  })
  return Vote
}
