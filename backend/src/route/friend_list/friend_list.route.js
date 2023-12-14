const friendController = require("../../controller/friends_list/firends_controller");
const authMiddleware = require("../../middleware/auth.controller");
//require es como un import para referenciar archivos

module.exports = function (app) {
  app.get( 
    "/friends/list/:user_id", 
    authMiddleware.auth, 
    friendController.listFriends
    );

    app.get( 
      "/friends/listUsers/:user_id", 
      authMiddleware.auth, 
      friendController.listUsers
      );
  
  
  app.delete(
    "/friends/delete/:friend_id",
    authMiddleware.auth,
    friendController.deleteFriend
  );
  
  app.post(
    "/friends/add",
    authMiddleware.auth,
    friendController.addFriend
  );
  
};
