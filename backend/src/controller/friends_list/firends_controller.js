const { sequelize } = require("../../connection");
const friendsService = require("../../service/friends.service");
const jwt = require("jsonwebtoken");




const listFriends = async function (req, res) {
  console.log(req.params)
  try {
    const friendModelResult = await friendsService.listFriends(req.params.user_id);
    res.json({
      success: true,
      usuarios: friendModelResult,
    }); ;
   
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};


const listUsers = async function (req, res) {
  try {
    const friendModelResult = await friendsService.listUsers(req.params.user_id);
    res.json({
      success: true,
      usuarios: friendModelResult,
    }); ;

  } catch (error) {
    res.json({
      success: false,
      error: error.message + 'errp',
    });
  }
};

const deleteFriend = async function (req, res) {
  console.log("eliminar usuarios controller");

  try {
    await friendsService.deleteFriend(req.params.friend_id);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const addFriend = async function (req, res){
  try {
 console.log('adidionanco')
      const friendDBInsert = friendsService.addFriend( req.body.friend_id, req.body.user_id )
    
      res.json({
        success: true,
        message: 'Amigo Agregado',
      });
     } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
}



module.exports = {

  listFriends,
  deleteFriend, 
    addFriend, 
    listUsers

};
