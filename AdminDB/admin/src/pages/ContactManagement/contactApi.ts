import axios from "axios";

// ============================================================
// API URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// TYPES
// ============================================================

export interface ContactMessage {
  _id: string;

  name: string;

  email: string;

  message: string;

  read: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CreateContactData {
  name: string;

  email: string;

  message: string;
}

// ============================================================
// CREATE CONTACT
// PUBLIC PORTFOLIO
// ============================================================

export const createContact =
  async (
    data: CreateContactData
  ): Promise<ContactMessage> => {
    try {
      const response =
        await axios.post<ContactMessage>(
          `${API_URL}/contact`,
          data
        );

      return response.data;
    } catch (error) {
      console.error(
        "CREATE CONTACT ERROR:",
        error
      );

      throw new Error(
        "Impossible d'envoyer le message."
      );
    }
  };

// ============================================================
// GET CONTACTS
// ADMIN
// ============================================================

export const getContacts =
  async (): Promise<ContactMessage[]> => {
    try {
      const response =
        await axios.get<ContactMessage[]>(
          `${API_URL}/contact`,
          {
            withCredentials: true,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "GET CONTACTS ERROR:",
        error
      );

      throw new Error(
        "Impossible de récupérer les messages."
      );
    }
  };

// ============================================================
// GET ONE CONTACT
// ADMIN
// ============================================================

export const getContact =
  async (
    id: string
  ): Promise<ContactMessage> => {
    try {
      const response =
        await axios.get<ContactMessage>(
          `${API_URL}/contact/${id}`,
          {
            withCredentials: true,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "GET CONTACT ERROR:",
        error
      );

      throw new Error(
        "Impossible de récupérer le message."
      );
    }
  };

// ============================================================
// MARK AS READ
// ADMIN
// ============================================================

export const markContactAsRead =
  async (
    id: string
  ): Promise<ContactMessage> => {
    try {
      const response =
        await axios.patch<ContactMessage>(
          `${API_URL}/contact/${id}/read`,
          {},
          {
            withCredentials: true,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "MARK CONTACT READ ERROR:",
        error
      );

      throw new Error(
        "Impossible de marquer le message comme lu."
      );
    }
  };

// ============================================================
// DELETE CONTACT
// ADMIN
// ============================================================

export const deleteContact =
  async (
    id: string
  ): Promise<void> => {
    try {
      await axios.delete(
        `${API_URL}/contact/${id}`,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(
        "DELETE CONTACT ERROR:",
        error
      );

      throw new Error(
        "Impossible de supprimer le message."
      );
    }
  };