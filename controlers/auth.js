const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'ya existe un usuario con ese correo',
      });
    }

    usuario = new Usuario(req.body);

    // encriptar contraseña
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // generar jwt
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'contacte al administrador',
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(400).json({
        ok: false,
        msg: 'no existe el email',
      });
    }

    // comparar password
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'password invalido',
      });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    return res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'contacte al administrador',
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  // generar un nuevo jwt y retornarlo a esta petición
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
