import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as tokenUtils from '../utils/tokenUtils.js'
import * as userModel from '../models/userModel.js';
import * as refreshTokenModel  from '../models/refreshTokenModel.js'

/**
 * @file: Este archivo es el servicio de autenticacion de usuarios.
 * @author M.M
 */

/** 
 * @function registerUser: Función que se encarga de llamar al modelo para que realice la función solicitada.
 * @description  se encarga de verificar si el usuario asociado a su correo electronico existe, 
 * sino crea uno nuevo con los datos proporcionados.
 * @param {Object} validatedData Objeto con la Data validada del usuario. 
 * @returns {Object} Devuelve un objeto con la información del usuaro. 
 */

export const registerUser = async (validatedData) => {
    try {
    const { nombre, apellido, correo, password } = validatedData;
    const userDb = await userModel.findByEmail(correo);

    if (userDb) {
      throw new Error('El usuario ya existe.');
    }  

    const contrasena_hash = await bcrypt.hash(password, 10);
    const userForDB = {
      nombre,
      apellido,
      correo,
      contrasena_hash: contrasena_hash,
    };

    const userCreated = await userModel.createUser(userForDB);
    return {
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: userCreated.id_usuario,
        nombre: userCreated.nombre,
        apellido: userCreated.apellido ,
        correo: userCreated.correo,
        rol: userCreated.rol
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @function loginUser: Función que se encarga de llamar al modelo para que realice la función solicitada.
 * @description Esta función se encarga de llamar al modelo el cual verificará si el usuario existe en la base de datos, 
 * si existe creará un token de acceso y lo devolverá, sino simplemente termina su proceso, si no cuenta con una 
 * contraseña devolverá un error personalizado.
 * @param {Object} validatedData Objeto con la data validada del usuario. 
 * @returns {Promise<string>} Devuelve un token de acceso si el inicio de sesión es exitoso.
 */

export const loginUser = async (validatedData) => {
    try {
    const { correo, password } = validatedData;

    const userDb = await userModel.findByEmail(correo);

    if (!userDb) {
      throw new Error('Credenciales incorrectas.');
    } 

    if (!userDb.contrasena_hash) {
      throw new Error('password_not_set');
    }

    if (!userDb.activo) {
      throw new Error('Cuenta desactivada.')
    }

    const isPasswordCorrect = await bcrypt.compare(password, userDb.contrasena_hash);
    if (!isPasswordCorrect) {
      throw new Error('Credenciales incorrectas.');
    }

    const accessToken = tokenUtils.generateAccessToken(userDb);
    const refreshToken = tokenUtils.generateRefreshToken();
    const refreshTokenExpires = tokenUtils.getRefreshtTokenExpiration();

    await refreshTokenModel.saveRefreshToken(
      userDb.id_usuario,
      refreshToken,
      refreshTokenExpires
    );

    await userModel.updateLastLogin(userDb.id_usuario);

    return {
      accesToken,
      refreshToken,
      user: {
        id: userDb.id_usuario,
        nombre: userDb.nombre,
        apellido: userDb.apellido,
        correo: userDb.correo,
        rol: userDb.rol
      }
    }
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('refresh token es requerido');
    }

    const tokenData = await refreshTokenModel.findValidRefreshToken(refreshToken);
    if (!tokenData) {
      throw new Error('refresh token inválido o expirado');
    }

    const newAccessToken = tokenUtils.generateAccessToken({
      id_usuario: tokenData.id_usuario,
      correo: tokenData.correo,
      rol: tokenData.rol
    });

    return {
      accessToken: newAccessToken,
      user: {
        id: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol
      }
    }
  } catch (error) {
    throw error
  }
};

/**
 * @function handleOauthLogin Función encargada de llamar al modelo para que realice la función solicitada.
 * @description Esta función se encargar de llamar al modelo para verificar si ya hay un usuario asociado al correo compartido 
 * por el usuario, sino llama al modelo para crear un nuevo usuario con la informacion compartida por el proveedor ya validada.
 * @param {Object} oauthData - Objeto con la data del usuario compartida por el proveedor ya validada. 
 * @returns {Promise<string>} Devuelve el token de acceso creado.
 */

export const handleOauthLogin = async (oauthData) => {
  const { nombre, apellido, correo, id_oauth, proveedor_oauth } = oauthData;

  const userDb = await userModel.findByEmail(correo);

  if (!userDb) {
    const newUser = await userModel.createUser({
      nombre,
      apellido,
      correo,
      id_oauth,
      proveedor_oauth,
    });
    
    const token = jwt.sign({ userId: newUser.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  if (!userDb.id_oauth) {
    const updateData = {
      id_oauth: id_oauth,
      proveedor_oauth: proveedor_oauth
    };
    await userModel.updateUser(userDb.id_usuario, updateData);
    const token = jwt.sign({ userId: userDb.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token
  }

  // ? Validacion si la cuenta está vinculada a otro proveedor
  if (userDb.id_oauth !== id_oauth) { 
    throw new Error('Cuenta ya vinculada a otro proveedor.');
  }

  if (userDb.id_oauth === id_oauth) {
    const token = jwt.sign({ userId: userDb.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
};