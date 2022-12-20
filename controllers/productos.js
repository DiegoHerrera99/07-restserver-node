const { Producto } = require("../models")

const obtenerProductos = async (req, res) => {
    const { desde = 0, hasta = 5 } = req.query

    const activos = { estado: true }

    const [ total, productos ] = await Promise.all([
        Producto.count(activos),
        Producto.find(activos)
            .populate(['usuario', 'categoria'])
            .skip(Number(desde))
            .limit(Number(hasta))
    ])

    res.status(200).json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res) => {
    const { id } = req.params

    const producto = await Producto.findById(id)
                        .populate(['usuario', 'categoria'])

    if(!producto.estado){
        return res.status(400).json({
            msg: `El producto ${id} - ${categoria.nombre} no esta activo.`,
            usuarioDel: producto.usuario 
        })
    }

    res.status(200).json({
        producto
    })
}

const crearProducto = async (req, res) => {
    const { nombre, precio = 0, categoria, descripcion = '' } = req.body
    const usuario = req.usuario._id

    const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() })

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe en la DB`
        })
    }

    const data = {
        nombre: nombre.toUpperCase(),
        usuario,
        precio,
        categoria,
        descripcion
    }

    const producto = new Producto(data)

    await producto.save()

    res.status(201).json(producto)
}

const actualizarProducto = async (req, res) => {
    const { id } = req.params
    const usuario = req.usuario._id
    const { estado, ...data } = req.body 

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = usuario

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

    res.status(200).json({
        msg: `Producto con id: ${id} actualizado con exito!`,
        producto
    })
}

const borrarProducto = async (req, res) => {
    const { id } = req.params
    const usuario = req.usuario._id

    const data = {
        estado: false,
        usuario
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

    res.status(200).json({
        msg: `Producto eliminado con exito!`,
        producto
    })
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}