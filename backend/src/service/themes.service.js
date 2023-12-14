const { sequelize } = require("../connection");
const { ThemesModel } = require("../model/themes.model");

const listar = async function (user_id) {
  console.log("listar temas");
  try {
    const themes = await sequelize.query(`SELECT * 
    FROM themes t WHERE t.owner_user_id=${user_id}  `);
    if (themes && themes[0]) {
      return themes[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 tema por codigo");
  try {
    const themesModelResult = await ThemesModel.findByPk(codigo);
    if (themesModelResult) {
      return themesModelResult;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const create  = async function ( name, description, keywords,  owner_user_id) { 

  try {
     const usersDBInsert = await sequelize.query(
      `INSERT  INTO themes (
        create_date
        ,name, 
        description, 
        keywords, 
        owner_user_id
        ) values(CURRENT_DATE, '${name}',  '${description}', '${keywords}',   ${owner_user_id}) `
      )
      console.log(`INSERT  INTO themes (
        create_date
        ,name, 
        description, 
        keywords, 
        owner_user_id, 
        ) values(CURRENT_DATE, '${name}', '${description}', '${keywords}',   ${owner_user_id}) `)
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
  description,
  keywords,
  owner_user_id
) {
  console.log("actualizar temas");
  let themesReturn = null;

  const data = { id, create_date, name, description, keywords, owner_user_id };
  try {
    let themesExist = null;
    if (id) {
      themesExist = await ThemesModel.findByPk(id);
    }
    if (themesExist) {
      themesReturn = await ThemesModel.update(data, { where: { id: id } });
      themesReturn = data;
    } 
    return themesReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  try {
    ThemesModel.destroy({ where: { id: codigo } }, { truncate: false });
    // await sequelize.query("UPDATE themes SET deleted=true WHERE id= " + codigo);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  create,
};
