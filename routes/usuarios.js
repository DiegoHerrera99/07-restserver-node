const { Router } = require('express')
const { body, param } = require('express-validator')

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require('../middlewares')

const { esRoleValido, emailExiste, usuarioExiste } = require('../helpers/db-validators')

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete,
} = require('../controllers/usuarios')

const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(usuarioExiste),
    body('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)

router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    body('correo', 'El correo no es válido').isEmail(),
    body('correo').custom(emailExiste),
    body('rol').custom(esRoleValido),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
   //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(usuarioExiste),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router;