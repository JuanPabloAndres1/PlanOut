import express from 'express'
import { sendMail } from '../controllers/email.controllers.js'

const router = express.Router()

router.post('/send-email', sendMail)



export default router