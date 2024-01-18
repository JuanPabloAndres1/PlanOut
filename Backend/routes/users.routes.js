import express from 'express'
import { singup, login, getUser, editUsername } from '../controllers/users.controllers.js'
import { verificarToken } from '../middlewares/validation.token.js'

const router = express.Router()

// Ruta para el singup de los usuarios
router.post('/singupUsers', singup)

// Ruta para el login de los usuarios
router.post('/loginUsers', login)

// Rutas para obtener los usuarios
router.get('/getUsers', getUser)

router.put('/editUsername', verificarToken, editUsername)

export default router