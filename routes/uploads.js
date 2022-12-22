const { Router } = require('express');
const { body, param } = require('express-validator');

const { validaArchivo, validarCampos } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads');

const router = Router();

router.get('/:coleccion/:id', [
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    param('id', 'No es un id válido de Mongo').isMongoId(),
    validarCampos
], mostrarImagenCloudinary) //mostrarImagen

router.post('/', validaArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validaArchivo,
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    param('id', 'No es un id válido de Mongo').isMongoId(),
    validarCampos
], actualizarImagenCloudinary) //actualizarImagen

module.exports = router;