const { sequelize } = require("../connection");
const { TopicsModel } = require("../model/topics.model");
const { Comments } = require('../model/comments.model');

class Data {

} 

const listarTipicosUsuario = async function (user_id) {
  console.log("listar topicos");
  try {
    const topics = await sequelize.query(`SELECT * 
      FROM topics tp
      WHERE 
         tp.owner_user_id= ${user_id}
         
      `);

      console.log(user_id)
    if (topics && topics[0]) {
      return topics[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 topico por codigo");
  try {
    const topicsModelResult = await TopicsModel.findByPk(codigo);
    if (topicsModelResult) {
      return topicsModelResult;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const create  = async function ( name,  owner_user_id) { 

  try {
     const usersDBInsert = await sequelize.query(
      
        `INSERT  INTO topics (create_date, name, "order", priority, color, owner_user_id, rank) 
        values(CURRENT_DATE,  '${name}', 
        (SELECT SUM("order")+1 FROM topics t), ${priority}, ${color},
        ${owner_user_id}, ${0}) `
      )
      
    if (usersDBInsert.length>0) return true;
    else return false;
    
  } catch (error) {
    return {reponse:false, message:error}
  }

  
}

const changeOrder  = async function ( from,  to) { 

  try {
     const usersDBInsert = await sequelize.query(
      
        `UPDATE topics SET "order"=${to}
        WHERE "order" =  ${from} `
      )
      
    if (usersDBInsert.length>0) return true;
    else return false;
    
  } catch (error) {
    return {reponse:false, message:error}
  }

  
}


const actualizar = async function (
  id,
  create_date,
  name,
  topic_id,
  order,
  priority,
  color,
  owner_user_id,
  rank
) {
  console.log("actualizar topicos");

  let topicsReturn = null;
  const data = {
    id,
    create_date,
    name,
    topic_id,
    order,
    priority,
    color,
    owner_user_id,
    rank
  };

  let sql;

  try {
    let topicsExist = null;
    if (id) {
      topicsExist = await TopicsModel.findByPk(id);
    }
    if (topicsExist) {
      topicsReturn = await TopicsModel.update(data, { where: { id: id } });
      topicsReturn = data;
    }


    topicsReturn =  await sequelize.query( sql);
    return topicsReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  console.log("eliminar topicos");
  try {
    //pide tb poner topic_id (??)
    TopicsModel.destroy(
      { where: { id: codigo } },
      { truncate: false }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const listarComentarios = async function (textoBuscar) {
  console.log("listar comentarios topicos service");
  try {
    const comentarios = await sequelize.query(
      'SELECT c.id, c.text, c.topic_id, c.user_id, c.created_at, u.name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.topic_id = :topicId',
      {
        replacements: { topicId: textoBuscar },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (comentarios && comentarios.length > 0) {
      return comentarios;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const comentarTopicoService = async function (comentarioData) {
  try {
    const { text, topic_id, user_id } = comentarioData;

    const newComment = await sequelize.query(`INSERT INTO comments (created_at, user_id, topic_id, text) values(CURRENT_DATE, ${user_id},${topic_id},'${text}')`)


    return newComment; 
  } catch (error) {
    throw new Error("Error al guardar el comentario en la base de datos");
  }
};

const compartirUsuariosService = async function (dataSharedTopics) {
  try {
    const { user_shared_id, topic_id, user_destination_ids } = dataSharedTopics;
    let retorno
    try{
    user_destination_ids.forEach(element => {
      retorno = sequelize.query( `INSERT INTO shared_topics (user_shared_id, topic_id, user_destination_id) VALUES (${user_shared_id}, ${topic_id}, ${user_destination_id})`);
    });
  }
  catch(error){}


    return "Datos insertados correctamente";
  } catch (error) {
    throw new Error("Error al insertar los datos en la base de datos en el servicio 810");
  }
};

const listarSharedMeService = async function (userId) {
  console.log("listar topicos");
  try {
    const topics = await sequelize.query(`
      SELECT t.*
      FROM shared_topics st
      INNER JOIN topics t ON st.topic_id = t.id
      WHERE st.user_destination_id = :userId
      `, {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT
      });

    return topics;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports = {
  listarTipicosUsuario,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  create,
  eliminar,
  listarComentarios,
  comentarTopicoService,
  compartirUsuariosService,
  listarSharedMeService,
  changeOrder
};
