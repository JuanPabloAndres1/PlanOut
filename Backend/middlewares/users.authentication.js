import jwt from 'jsonwebtoken'

export const authVerification = (request, response, next) => {

    try {
        if (!request.headers.authorization) {
            return response.json({ error: 'Debes enviar un token de autenticación' })
        }

        let token = ''

        if (request.headers.authorization.includes('key')) {
            token = request.headers.authorization.split(' ')[1]
        } else {
            return response.json({ error: 'El formato del token es incorrecto' })
        }

        let decoded = jwt.verify(token, process.env.JWT_KEY);

        request.user = decoded
        next()

    } catch (e) {
        return response.json(e)
    }
}