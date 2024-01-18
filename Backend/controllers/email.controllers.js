import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import { usersModel } from '../models/users.models.js';
import dotenv from 'dotenv';

dotenv.config();

const emailDomain = process.env.DOMAIN;
const emailApi = process.env.API_KEY;

const auth = {
  auth: {
    api_key: emailApi,
    domain: emailDomain,
  },
};
const transporter = nodemailer.createTransport(mg(auth));

export const sendMail = async (request, response) => {
  const { to } = request.body;

  try {
      const user = await usersModel.findOne({ email: to });

      if (!user) {
          response.status(404).json({
              error: 'Si tu correo electrónico está registrado, revisa tu bandeja de entrada.',
          });
          return;
      }

      // Elimina el token existente antes de generar uno nuevo
      await usersModel.findOneAndUpdate({ email: to }, { $unset: { token: 1 } });

      const token = parseInt(Math.random() * 100000);
      await usersModel.findOneAndUpdate({ email: to }, { token: token });

      const resetLink = `http://localhost:4200/forget/${token}`;

      const mailOptions = {
          from: 'jacobovallealvarez@gmail.com',
          to,
          subject: 'Restablecer contraseña',
          text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink} Si no has hecho ninguna solicitud para cambiar la contraseña de tu cuenta en "PlanOut", ignora este mensaje.`,
      };

      await transporter.sendMail(mailOptions);

      response.json({
          message: 'El correo de restablecimiento de contraseña ha sido enviado correctamente.',
      });
  } catch (error) {
      response.status(500).json({
          error: error.message,
      });
  }
};