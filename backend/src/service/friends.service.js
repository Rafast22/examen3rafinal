const { sequelize } = require("../connection");
const { UserModel } = require("../model/user.model");

const listFriends = async function (user_id) {
  try {
    const friends = await sequelize.query(`SELECT u.id, u.name, u.last_name
    FROM friend_list as fl
    INNER JOIN users u on fl.friend_id=u.id
    WHERE  deleted IS false
          AND fl.user_id = ${user_id}
      `);

    if (friends && friends[0]) {
      return friends[0];
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

const listUsers = async function (user_id) {
  try {
    const friends = await sequelize.query(`SELECT * 
      FROM users as u
      WHERE  u.deleted IS false
      AND u.id <> ${user_id}
        
      `);

    if (friends && friends[0]) {
      return friends[0];
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};


const addFriend = async function ( user_id, friend_id,) {
    console.log("eliminar usuarios");
    try {
      await sequelize.query(`INSERT INTO friend_list ( user_id, friend_id) values ( ${user_id}, ${friend_id} )` );
    } catch (error) {
      throw error;
    }
  };
  


const deleteFriend = async function (codigo) {
  console.log("eliminar usuarios");
  try {
    await sequelize.query("DELETE FROM friend_list WHERE friend_id= " + codigo);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  listFriends,
    deleteFriend, 
    addFriend,
    listUsers
};
