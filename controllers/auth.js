const { request, response, json } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req=request, res=response) => {

    const { correo, password } = req.body

    try{

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario){
            return res.status(400).json({
                msg: 'Correo Incorrecto'
            })
        }

        //Verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario Eliminado (No activo)'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg: 'Password Incorrecto'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res) => {
    
    const { id_token } = req.body;

    try{
        const { nombre, img, correo } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if(!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '>:',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario inactivo'
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })

    }catch(err){
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

const renovarToken = async (req, res) => {
    const { usuario } = req;

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}