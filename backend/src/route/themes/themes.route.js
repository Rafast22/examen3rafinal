const themesController = require("../../controller/themes/themes.controller");
const authMiddleware = require("../../middleware/auth.controller");
//require es como un import para referenciar archivos

module.exports = function (app) {
  app.get("/themes/list/:user_id", authMiddleware.auth, themesController.listar);
  app.get( "/themes/buscarPorCodigo/:filtro", authMiddleware.auth, themesController.busquedaPorCodigo);
  app.post("/themes/update", authMiddleware.auth, themesController.actualizar);
  app.post("/themes/create", authMiddleware.auth, themesController.create);
  app.delete( "/themes/delete/:filtro", authMiddleware.auth, themesController.eliminar);
  
};
