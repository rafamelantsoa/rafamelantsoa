import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/**
 * |--------------------------------------------------------------------------
 * | TYPES
 * |--------------------------------------------------------------------------
 */

export interface Experience {
  _id: string;
  company: string;
  role: string;
  date: string;
  missions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceSection {
  _id?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * |--------------------------------------------------------------------------
 * | GET EXPERIENCES
 * |--------------------------------------------------------------------------
 */

export const getExperiences = async (): Promise<
  Experience[]
> => {
  try {
    const response = await axios.get<Experience[]>(
      `${API_URL}/experiences`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET EXPERIENCES ERROR:",
      error
    );

    throw new Error(
      "Impossible de récupérer les expériences professionnelles."
    );
  }
};

/**
 * |--------------------------------------------------------------------------
 * | GET EXPERIENCE SECTION
 * |--------------------------------------------------------------------------
 * |
 * | Récupère le titre de la section depuis le backend.
 * |
 */

export const getExperienceSection =
  async (): Promise<ExperienceSection> => {
    try {
      const response =
        await axios.get<ExperienceSection>(
          `${API_URL}/experiences/section`
        );

      return response.data;
    } catch (error) {
      console.error(
        "GET EXPERIENCE SECTION ERROR:",
        error
      );

      throw new Error(
        "Impossible de récupérer le titre de la section des expériences."
      );
    }
  };

/**
 * |--------------------------------------------------------------------------
 * | UPDATE EXPERIENCE SECTION
 * |--------------------------------------------------------------------------
 * |
 * | Modifie le titre de la section depuis l'administration.
 * |
 */

export const updateExperienceSection =
  async (
    title: string
  ): Promise<ExperienceSection> => {
    try {
      const response =
        await axios.put<ExperienceSection>(
          `${API_URL}/experiences/section`,
          {
            title,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "UPDATE EXPERIENCE SECTION ERROR:",
        error
      );

      throw new Error(
        "Impossible de modifier le titre de la section des expériences."
      );
    }
  };