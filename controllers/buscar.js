const { ObjectId } = require('mongoose').Types
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res) => {

    const esMongoId = ObjectId.isValid(termino) //TRUE

    if(esMongoId){
        const usuario = await Usuario.findById(termino)
        res.json({
            results: (usuario) ? [ usuario ] : []
        })
    }

    const regex = new RegExp(termino, 'i') //Expresión regular insensible

    const usuarios = await Usuario.find({ //Sintaxis de OR caracteristica de MongoDB
        $or: [
            {nombre: regex},
             {correo: regex}
        ],
        $and: [{estado: true}]
    })

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async (termino = '', res) => {

    const esMongoId = ObjectId.isValid(termino) //TRUE

    if(esMongoId){
        const categoria = await Categoria.findById(termino)
        res.json({
            results: (categoria) ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i') //Expresión regular insensible

    const categoria = await Categoria.find({ nombre: regex, estado: true })
                                .populate('usuario', 'nombre')

    res.json({
        results: categoria
    })

}

const buscarProductos = async (termino = '', res) => {

    const esMongoId = ObjectId.isValid(termino) //TRUE

    if(esMongoId){
            const producto = await Producto.find({
                $or: [
                    { _id: termino },
                    { categoria: termino }
                ],
                $and: [
                    { estado: true }
                ]
            })

            return res.json({
                results: producto
            })

    }

    const regex = new RegExp(termino, 'i') //Expresión regular insensible

    const producto = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria', 'nombre')
                            .populate('usuario', 'nombre')

    res.json({
        results: producto
    })

}

const buscar = (req, res) => {

    const { coleccion, termino } = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;

        case 'categoria':
            buscarCategorias(termino, res)
            break;

        case 'productos':
            buscarProductos(termino, res)
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })
    }

}

module.exports = {
    buscar
}