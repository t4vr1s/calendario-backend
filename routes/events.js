/* 
  rutas de events
  /api/events
*/

const { Router } = require('express');
const router = Router();
const { validarJWT } = require('../middelewares/validar-jwt');
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controlers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middelewares/validar-campos');
const { isDate } = require('../helpers/isDate');

// todas las peticiones pasan por validarJWT
router.use(validarJWT);
// obtener eventos
router.get('/', getEventos);
// crear evento
router.post(
  '/',
  [
    check('title', 'titulo es obligatorio').notEmpty(),
    check('start', 'fecha de inicio es obligatoria').custom(isDate),
    check('end', 'fecha de finalización es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEvento
);
// actualizar evento
router.put(
  '/:id',
  [
    check('title', 'titulo es obligatorio').notEmpty(),
    check('start', 'fecha de inicio es obligatoria').custom(isDate),
    check('end', 'fecha de finalización es obligatoria').custom(isDate),
    validarCampos,
  ],
  actualizarEvento
);
// eliminar evento
router.delete('/:id', eliminarEvento);

// exportar las rutas
module.exports = router;
