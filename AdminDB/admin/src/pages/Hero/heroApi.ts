import axiosInstance from "../../services/axiosInstance";
import type { Hero, HeroUpdateData } from "./types/hero";

/**
 * =========================================================
 * RÉCUPÉRER LE HERO
 * =========================================================
 */
export const getHero = async (): Promise<Hero> => {
  try {
    const response = await axiosInstance.get<Hero>("/hero");

    return response.data;
  } catch (error: any) {
    console.error(
      "GET HERO ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de récupérer les informations du Hero."
    );
  }
};

/**
 * =========================================================
 * MODIFIER LE TEXTE DU HERO
 * =========================================================
 */
export const updateHero = async (
  data: HeroUpdateData
): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const response = await axiosInstance.put<{
      message: string;
      hero: Hero;
    }>("/hero", data);

    return response.data;
  } catch (error: any) {
    console.error(
      "UPDATE HERO ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de modifier les informations du Hero."
    );
  }
};

/**
 * =========================================================
 * MODIFIER L'IMAGE LIGHT
 * =========================================================
 */
export const updateLightImage = async (
  file: File
): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const formData = new FormData();

    formData.append("image", file, file.name);

    console.log("LIGHT FORM DATA:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const response = await axiosInstance.put<{
      message: string;
      hero: Hero;
    }>("/hero/light-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "UPDATE LIGHT IMAGE ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de modifier l'image Light."
    );
  }
};

/**
 * =========================================================
 * SUPPRIMER L'IMAGE LIGHT
 * =========================================================
 */
export const deleteLightImage = async (): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const response = await axiosInstance.delete<{
      message: string;
      hero: Hero;
    }>("/hero/light-image");

    return response.data;
  } catch (error: any) {
    console.error(
      "DELETE LIGHT IMAGE ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de supprimer l'image Light."
    );
  }
};

/**
 * =========================================================
 * MODIFIER L'IMAGE DARK
 * =========================================================
 */
export const updateDarkImage = async (
  file: File
): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const formData = new FormData();

    formData.append("image", file, file.name);

    console.log("DARK FORM DATA:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const response = await axiosInstance.put<{
      message: string;
      hero: Hero;
    }>("/hero/dark-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "UPDATE DARK IMAGE ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de modifier l'image Dark."
    );
  }
};

/**
 * =========================================================
 * SUPPRIMER L'IMAGE DARK
 * =========================================================
 */
export const deleteDarkImage = async (): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const response = await axiosInstance.delete<{
      message: string;
      hero: Hero;
    }>("/hero/dark-image");

    return response.data;
  } catch (error: any) {
    console.error(
      "DELETE DARK IMAGE ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de supprimer l'image Dark."
    );
  }
};

/**
 * =========================================================
 * MODIFIER LE CV
 * =========================================================
 */
export const updateCV = async (
  file: File
): Promise<{
  message: string;
  hero: Hero;
}> => {
  try {
    const formData = new FormData();

    formData.append("cv", file, file.name);

    console.log("CV FORM DATA:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const response = await axiosInstance.put<{
      message: string;
      hero: Hero;
    }>("/hero/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "UPDATE CV ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Impossible de modifier le CV."
    );
  }
};