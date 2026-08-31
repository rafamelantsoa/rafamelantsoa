import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * LOGIN ADMIN
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Identifiant et mot de passe requis.",
      });
    }

    // Vérification de l'identifiant
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect.",
      });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect.",
      });
    }

    // Création du JWT
    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Stockage du JWT dans un cookie HttpOnly
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      admin: {
        username: process.env.ADMIN_USERNAME,
      },
    });
  } catch (error) {
    console.error("Erreur login :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion.",
    });
  }
};

/**
 * LOGOUT ADMIN
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    console.error("Erreur logout :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la déconnexion.",
    });
  }
};

/**
 * VÉRIFICATION DU TOKEN
 */
export const me = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        username: req.admin.username,
      },
    });
  } catch (error) {
    console.error("Erreur vérification admin :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de vérifier la session.",
    });
  }
};