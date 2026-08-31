import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export interface HeroImage {
  url: string;
  publicId: string;
}

export interface Hero {
  _id: string;

  title: string;

  description: string;

  lightImage: HeroImage;

  darkImage: HeroImage;

  cvUrl: string;

  cvPublicId: string;

  createdAt: string;

  updatedAt: string;
}


/*
|--------------------------------------------------------------------------
| GET HERO
|--------------------------------------------------------------------------
*/

export const getHero = async (): Promise<Hero> => {
  try {
    const response = await axios.get<Hero>(
      `${API_URL}/hero`
    );

    return response.data;

  } catch (error) {
    console.error(
      "GET HERO ERROR:",
      error
    );

    throw new Error(
      "Impossible de récupérer le Hero."
    );
  }
};