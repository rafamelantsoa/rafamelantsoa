import axios from "axios";

/* =========================================================
   API URL
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

export interface ContactSection {
  _id: string;
  title: string;
  description: string;
  checklists: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   GET CONTACT SECTION
========================================================= */

export const getContactSection =
  async (): Promise<ContactSection> => {
    try {
      const response =
        await axios.get<ContactSection>(
          `${API_URL}/contact/section`
        );

      return response.data;
    } catch (error) {
      console.error(
        "GET CONTACT SECTION ERROR:",
        error
      );

      throw new Error(
        "Impossible de récupérer la section Contact."
      );
    }
  };

/* =========================================================
   SEND MESSAGE
========================================================= */

export const sendContactMessage =
  async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    try {
      const response =
        await axios.post(
          `${API_URL}/contact/messages`,
          data
        );

      return response.data;
    } catch (error: any) {
      console.error(
        "SEND CONTACT MESSAGE ERROR:",
        error
      );

      throw new Error(
        error?.response?.data?.message ||
          "Impossible d'envoyer le message."
      );
    }
  };