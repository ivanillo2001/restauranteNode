import conexion from "../mysql_conector.js";

/**
 * @description Funcion encargada de hacer la petición a la bbdd para
 * obtener los cursos.
 * @param {*} req 
 * @param {*} res 
 */
/**
 * @description Controlador encargado de la carga de restaurantes
 * @param {*} req 
 * @param {*} res 
 */
export const cargarRestaurantes = async (req, res) => {
  try {
    const [result] = await conexion.query("Select * from restaurantes"); 
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

/**
 * @description Controlador encargado de la carga de empleados de un restaurante en concreto
 * @param {*} req 
 * @param {*} res 
 */
export const cargarEmpleados = async(req,res)=>{
  try {
    const {idRestaurante}=req.params;
    const [result]= await conexion.query('SELECT * from empleados where idrest = ?',[idRestaurante])
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
}

/**
 * @description Controlador encargado de mostrar las reservas que hay de un restaurante y con una fecha concretos
 * @param {*} req 
 * @param {*} res 
 */
export const mostrarMesas = async (req,res)=>{
  try {
    const {idRestaurante,fechaReserva}=req.params;
    const [result]= await conexion.query('SELECT * from reservas where idrest=? and fecha = ?',[idRestaurante,fechaReserva])
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
}

/**
 * @description Controlador encargado de insertar reservas en la bbdd
 * @param {*} req 
 * @param {*} res 
 */
export const confirmarReserva= async (req,res)=>{
  try {
    console.log(req.body);
    const {idRestaurante,idEmpleado,fecha,mesa,cliente,comensales}=req.body;
    const [result]= await conexion.query('INSERT into reservas values (NULL,?,?,?,?,?,?)',[idRestaurante,idEmpleado,fecha,mesa,cliente,comensales])
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
}
/**
 * @description Controlador encargado de borrar reservas
 * @param {*} req 
 * @param {*} res 
 */
export const borrarReserva = async (req,res)=>{
  try {
    const {numMesa, idRestaurante, fecha}=req.body;
    const [result]= await conexion.query('Delete from reservas where mesa =? and idrest=? and fecha=?',[numMesa,idRestaurante,fecha])
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
}
