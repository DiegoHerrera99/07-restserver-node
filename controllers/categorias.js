const { Categoria } = require('../models')

//obtenerCategorias - paginado - total - populate:en la respuesta que muestre quien fue el ultimo usuario que creo o modifico esa categoria
const obtenerCategorias = async (req, res) => {

    const { desde = 0, hasta = 5 } = req.query
    const activos = { estado: true }

    const [categorias, total] = await Promise.all([
        Categoria.find(activos)
            .populate('usuario')
            .skip(Number(desde))
            .limit(Number(hasta)),
        Categoria.count(activos)
    ])

    res.json({
        total,
        categorias
    })
}


//obtenerCategoria - populate
const obtenerCategoria = async (req, res) => {
    const { id } = req.params

    const categoria = await Categoria.findById(id)
                                .populate('usuario')

    if(!categoria.estado){
        return res.status(400).json({
            msg: `La categoria ${id} - ${categoria.nombre} no esta activa.`,
            usuarioDel: categoria.usuario 
        })
    }

    res.json({
        categoria
    })
}

const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    //Guardar en DB
    await categoria.save()

    res.status(201).json(categoria)
}

//actualizarCategoria
const actualizarCategoria = async (req, res) => {
    const { id } = req.params
    const nombre = req.body.nombre.toUpperCase()
    const usuario = req.usuario._id 

    const data = {
        nombre,
        usuario
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})

    res.json({
        msg: `Categoria con ID ${id} actualizada con exito!`,
        categoria
    })
}

//borrarCategoria estado: false
const borrarCategoria = async (req, res) => {
    const { id } = req.params
    const usuario = req.usuario._id

    const data = {
        estado: false,
        usuario
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})

    res.json({
        msg: `Categoria con ID ${id} eliminada con exito!`,
        categoria
    })
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}