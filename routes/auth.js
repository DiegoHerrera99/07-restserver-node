const { Router } = require('express')
const { body, param } = require('express-validator');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.get('/', validarJWT, renovarToken);

router.post('/login', [
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    body('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;