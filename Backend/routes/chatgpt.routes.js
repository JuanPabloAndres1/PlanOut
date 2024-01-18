import express from 'express'
import { createPlan } from '../controllers/chatgpt.controllers.js'
import {verificarToken} from '../middlewares/validation.token.js'

const router = express.Router()

router.post('/crearplan',verificarToken ,createPlan)

export default router