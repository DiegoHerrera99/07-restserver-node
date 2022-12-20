const Role = require('../models/role')
const { Usuario, Categoria, Producto } = require('../models')

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la DB`)
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la DB`)
    }
}

const usuarioExiste = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe en la DB`)
    }
}

const categoriaExiste = async (id = '') => {
    try{
        await Categoria.findById(id)
    }catch(err){
        throw new Error(`La categoria con id ${id} no existe en la DB`)
    }
}

const productoExiste = async (id = '') => {
    try{
        const producto = await Producto.findById(id)
        if(!producto){
            throw new Error(`El producto con id ${id} no existe en la DB`)
        }
    }catch(err){
        throw new Error(`El producto con id ${id} no existe en la DB`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExiste,
    categoriaExiste,
    productoExiste
}