const topicsController = require("../../controller/topics/topics.controller");
const authMiddleware = require("../../middleware/auth.controller");

module.exports = function (app) {
  app.get("/topics/listarTipicosUsuario/:filtro",  authMiddleware.auth,  topicsController.listarTipicosUsuario);

  app.get("/topics/buscarPorCodigo/:filtro",  authMiddleware.auth,  topicsController.consultarPorCodigo);
  app.post("/topics/update",  authMiddleware.auth,  topicsController.actualizar);
  app.post("/topics/create",  authMiddleware.auth,  topicsController.create);
  app.delete("/topics/delete/:filtro",  authMiddleware.auth,  topicsController.eliminar);
  app.get("/topic-details/:topic_id",  authMiddleware.auth,  topicsController.listarComentarios);
  app.post("/topics-details/comment",  authMiddleware.auth,  topicsController.comentarTopicoController);
  app.post("/topics-shared",  authMiddleware.auth,  topicsController.compartirUsuariosController);
  app.get("/topics/shared_me/:id",  authMiddleware.auth,  topicsController.listarSharedMeController);
  app.post( "/topics/saveOrder", authMiddleware.auth, topicsController.changeOrder
  );
};
