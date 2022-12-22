const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models")

const cargarArchivo = async (req, res) => {
    //imagenes
    try{
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({ nombre });
    }catch(msg){
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async (req, res) => {    
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' });
    }

    //Limpiar imagen previa
    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            //Si existe la imagen tanto en el modelo como en el path se borra físicamente
            fs.unlinkSync(pathImagen);
        }

    };

    try{
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
    }catch(msg){
        return res.status(400).json({ msg })
    }

    await modelo.save()
        
    res.json(modelo)
}

const mostrarImagen = async (req, res) => {
    const {id, coleccion} = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' });
    }

    if(modelo.img){
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            //Si existe la imagen tanto en el modelo como en el path se envía la imagen
            return res.sendFile(pathImagen)
        }

    };

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathImagen)

}

const mostrarImagenCloudinary = async (req, res) => {
    const {id, coleccion} = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' });
    }

    if(modelo.img){
        res.redirect(modelo.img);
    };

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathImagen)

}

const actualizarImagenCloudinary = async (req, res) => {    
    const {id, coleccion} = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' });
    }

    //Limpiar imagen previa
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.')

        cloudinary.uploader.destroy(coleccion + '/' + public_id);
    };

    try{
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {folder: coleccion});
        modelo.img = secure_url;

    }catch(msg){
        return res.status(400).json({ msg })
    }

    await modelo.save()
        
    res.json(modelo)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}