import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/users.models.js";

export const singup = async (request, response) => {
  try {
    let body = request.body;

    body.password = bcrypt.hashSync(body.password, parseInt(process.env.MASTER_KEY));

    let newUser = await usersModel.create(body);

    const payload = { _id: newUser._id };

    let token = jwt.sign(payload, process.env.JWT_KEY);

    const userData = {
      token,
      user: newUser,
    };

    response.send(userData);
  } catch (e) {
    console.log(e);
    response.json({ error: e.message || 'Error en el servidor' });
  }
};

export const login = async (request, response) => {
  try {
    let body = request.body;
    let userExist = await usersModel.findOne({ email: body.email });

    if (!userExist) {
      return response.json({ token: null, error: "No existe un usuario con este correo electrÃ³nico" });
    }

    const validationsPassword = bcrypt.compareSync(body.password, userExist.password);

    if (validationsPassword) {
      const payload = { _id: userExist._id };
      const token = jwt.sign(payload, process.env.JWT_KEY);
      return response.send({ token });
    } else {
      return response.send({ token: null, error: "Credenciales incorrectas" });
    }
  } catch (e) {
    console.log(e);
    return response.json({ token: null, error: e.message || 'Error en el servidor' });
  }
};

export const getUser = async (request, response) => {
  let token = request.headers.authorization?.split(' ')[1];;
  let decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  let id = decodedToken._id;
  console.log(decodedToken)

  try {
    const userExist = await usersModel.findOne({ "_id": id });
    response.json(userExist);
  } catch (e) {
    console.log(e);
    response.json({ error: e.message || 'Error en el servidor' });
  }
};

export const editUsername = async (req, res) => {
  let body = req.body;

  try {
    let userExist = await usersModel.updateOne({ "_id": req.user._id }, { "$set": { "name": body.name } });

    if (!userExist) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await userExist;

    return res.status(200).json({ message: 'Nombre de usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar el nombre de usuario:', error);
    return res.status(500).json({ message: 'Hubo un error al actualizar el nombre de usuario', error: error });
  }
};