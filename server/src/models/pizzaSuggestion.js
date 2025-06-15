module.exports = (sequelize, DataTypes) => {
  const PizzaSuggestion = sequelize.define('PizzaSuggestion', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The brand of the pizza, e.g., Domino\'s, Telepizza'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending', // pending, approved, rejected
      allowNull: false
    }
  })
  return PizzaSuggestion
} 