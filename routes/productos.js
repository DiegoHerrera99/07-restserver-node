const { Router } = require('express');
const { body, param } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { categoriaExiste, productoExiste } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//Obtener todos los productos - publico
router.get('/', obtenerProductos)

//Obtener una categoria por id - publico
router.get('/:id', [
    param('id', 'El id de producto no es válido').isMongoId(),
    param('id').custom(productoExiste),
    validarCampos
], obtenerProducto)

//Crear producto - privado - cualquier persona con un token válido
router.post('/',[
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('categoria', 'La categoria es obligatoria').not().isEmpty(),
    body('categoria', 'El id de categoria no es válido').isMongoId(),
    body('categoria').custom(categoriaExiste),
    validarCampos
], crearProducto)

//Actualizar un producto por id - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    param('id', 'El id de producto no es válido').isMongoId(),
    param('id').custom(productoExiste),
    validarCampos
], actualizarProducto)

//Borrar un producto - Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'El id de producto no es válido').isMongoId(),
    param('id').custom(productoExiste),
    validarCampos
], borrarProducto)

module.exports = router;