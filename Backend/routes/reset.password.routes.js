// import express from 'express'
// import bcrypt from 'bcrypt'
// import { usersModel } from '../models/users.models';
// import {verificarToken}from '../middlewares/validation.token'


// const router = express.Router();

// router.post('/resetpassword', verificarToken, async (req, res) => {
//   const { userId } = req.user;
//   const { password } = req.body;

//   try {
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     await usersModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
//     res.send("Contraseña actualizada con éxito.");
//   } catch (error) {
//     res.status(500).send("Error al actualizar la contraseña.");
//   }
// });

// export default router

import express from 'express'
import {verificarToken} from '../middlewares/validation.token.js'
import { resetearContrasena } from '../controllers/reset.password.controller.js'

const router = express.Router()

router.post('/reset-password', resetearContrasena)


export default router