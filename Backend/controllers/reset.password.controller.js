import bcrypt from 'bcrypt';
import { usersModel } from '../models/users.models.js';

export const resetearContrasena = async (req, res) => {
  const resetToken = req.body.resetToken;
  const newPassword = req.body.newPassword;

  try {
    const user = await usersModel.findOne({ token: resetToken });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (user.token !== resetToken) {
      return res.status(400).json({ error: "El token de restablecimiento de contraseña no es válido." });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await usersModel.findByIdAndUpdate(user.id, { $set: { password: hashedPassword } });
    
    await usersModel.findByIdAndUpdate(user.id, { $unset: { token: 1 } });

    res.json({ message: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      res.status(400).json({ error: "El enlace de restablecimiento de contraseña ha caducado." });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ error: "Token de restablecimiento de contraseña inválido." });
    } else {
      res.status(500).json({ error: "Error al actualizar la contraseña." });
    }
  }
};