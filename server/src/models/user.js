module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    votes_cast: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  })
  return User
}
