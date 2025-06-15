module.exports = (sequelize, DataTypes) => {
  const Pizza = sequelize.define('Pizza', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sourceName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    // Opciones adicionales del modelo, si fueran necesarias
    // tableName: 'pizzas' // Sequelize infiere 'Pizzas' de 'Pizza'. Se puede especificar si es diferente.
  })

  // Si tienes asociaciones, defínelas aquí. Por ejemplo:
  // Pizza.associate = function(models) {
  //   Pizza.hasMany(models.Vote, { foreignKey: 'pizzaId' }); // Ejemplo
  // }

  return Pizza
}
