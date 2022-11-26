const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {

    const token = req.header('x-token')

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //leer el usuario al que corresponde el uid
        const usuario = await Usuario.findById(uid)
        req.usuario = usuario

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            }) 
        }

        //Verificar si el uid tiene estado true
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            })
        }

       //next();

    }catch(err){
        console.log(err)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

    next();
}

module.exports = {
    validarJWT
}