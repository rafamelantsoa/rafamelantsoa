import axios from "axios";


/* =========================================================
   TYPES
========================================================= */

export interface AboutExpertise {
  _id?: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutToolLogo {
  url: string;
  publicId: string;
}

export interface AboutTool {
  _id?: string;
  name: string;
  logo: AboutToolLogo;
}

export interface About {
  _id?: string;

  title: string;

  expertise: AboutExpertise[];

  toolsTitle: string;

  tools: AboutTool[];

  createdAt?: string;

  updatedAt?: string;
}


/* =========================================================
   API BASE URL
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


/* =========================================================
   GET ABOUT
========================================================= */

export const getAbout =
  async (): Promise<About> => {

    const response =
      await axios.get<About>(
        `${API_URL}/api/about`
      );

    return response.data;

  };