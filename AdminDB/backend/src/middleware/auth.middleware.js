import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | RÉCUPÉRER LE JWT DEPUIS LE COOKIE HTTPONLY
    |--------------------------------------------------------------------------
    */

    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Session manquante.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VÉRIFICATION DU JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    |--------------------------------------------------------------------------
    | ADMIN AUTHENTIFIÉ
    |--------------------------------------------------------------------------
    */

    req.admin = decoded;

    next();
  } catch (error) {
    console.error(
      "Erreur authentification :",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Session invalide ou expirée.",
    });
  }
};

export default authMiddleware;