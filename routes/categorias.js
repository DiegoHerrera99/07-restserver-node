const { Router } = require('express')
const { body, param } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { categoriaExiste } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

/*
{{url}}/api/categorias
*/

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener una categoria por id - publico
router.get('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(categoriaExiste), //Parecido a db-validators
    validarCampos
], obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar un registro por id - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(categoriaExiste), //Parecido a db-validators
    validarCampos
], actualizarCategoria)

//Borrar una categoria - Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(categoriaExiste), //Parecido a db-validators
    validarCampos
], borrarCategoria)

module.exports = router;