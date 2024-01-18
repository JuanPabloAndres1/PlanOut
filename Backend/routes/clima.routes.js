import express from 'express'
import { getTemp } from '../controllers/clima.controllers.js'

const router = express.Router()

router.get('/prediccion/:city/:year/:month/:day', getTemp)

export default router