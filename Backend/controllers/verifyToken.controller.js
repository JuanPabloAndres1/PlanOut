import jwt from "jsonwebtoken";

export const verifyToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    // El token es válido, puedes realizar acciones adicionales si es necesario
    res.status(200).json({ message: "Token válido" });
  });
};