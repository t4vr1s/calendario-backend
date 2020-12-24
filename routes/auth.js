/* 
  rutas de usuarios /auth
  host + /api/auth
*/
const { Router } = require('express');
const router = Router();
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require('../controlers/auth');
const { validarCampos } = require('../middelewares/validar-campos');
const { check } = require('express-validator');
const { validarJWT } = require('../middelewares/validar-jwt');

router.post(
  '/new',
  [
    check('name', 'el nombre es obligatorio').notEmpty(),
    check('email', 'el email es obligatorio').isEmail(),

    check('password', 'el password debe tener 6 o más caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    check('email', 'el email es obligatorio').isEmail(),
    check('password', 'el password debe tener 6 o más caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
