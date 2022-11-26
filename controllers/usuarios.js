const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        usuariosActivos: total,
        usuarios,
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol })

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en DB
    await usuario.save();

    res.json({
        msg: 'Usuario creado con exito!',
        usuario
    })
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body

    //TODO validar contra base de datos
    if(password){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: `Usuario con ID: ${id} actualizado con exito!`,
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params

    let usuarioAuth = req.usuario

    //Fisicamente lo borramos: NO SE RECOMIENDA BORRAR FISICAMENTE REGISTROS DE UNA DB
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Virtualmente actualizamos el campo estado a false y a esto le llamamos "eliminado"
    const usuarioDel = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuarioDel,
        usuarioAuth
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}