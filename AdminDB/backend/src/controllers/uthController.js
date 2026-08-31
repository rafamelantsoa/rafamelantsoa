import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = () => {
  return jwt.sign(
    {
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Identifiant et mot de passe requis.",
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME
    ) {
      return res.status(401).json({
        message: "Identifiant ou mot de passe incorrect.",
      });
    }

    const passwordIsValid =
      await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Identifiant ou mot de passe incorrect.",
      });
    }

    const token = createToken();

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      user: {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Erreur login:",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

export const me = async (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: {
      username: process.env.ADMIN_USERNAME,
      role: "admin",
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Déconnexion réussie.",
  });
};