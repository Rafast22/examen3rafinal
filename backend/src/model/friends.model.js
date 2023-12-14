const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const UserModel = sequelize.define("User", {
  //Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  friend_id:{
    type: DataTypes.STRING,
    allowNull:false
  },

},{
    //Other model options go here
    tableName: 'friend_list',
    timestamps: false
});

module.exports = {
    UserModel
};