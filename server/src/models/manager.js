const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('manager', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      async beforeCreate (manager) {
        const salt = await bcrypt.genSalt(10)
        manager.password = await bcrypt.hash(manager.password, salt)
      }
    }
  })
  return Manager
}
