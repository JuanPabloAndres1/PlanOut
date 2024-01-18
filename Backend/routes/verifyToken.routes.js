import express from 'express'
import { verifyToken } from '../controllers/verifyToken.controller.js'

const router = express.Router()

router.post('/verificationT', verifyToken )

export default router