import axiosInstance from "../../services/axiosInstance";

import type {
  Experience,
  ExperienceSection,
} from "./types/experience";

/*
|--------------------------------------------------------------------------
| SECTION
|--------------------------------------------------------------------------
*/

export const getExperienceSection =
  async (): Promise<ExperienceSection> => {
    const response =
      await axiosInstance.get(
        "/experiences/section"
      );

    return response.data;
  };

export const updateExperienceSection =
  async (
    title: string
  ): Promise<ExperienceSection> => {
    const response =
      await axiosInstance.put(
        "/experiences/section",
        {
          title,
        }
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| EXPERIENCES
|--------------------------------------------------------------------------
*/

export const getExperiences =
  async (): Promise<Experience[]> => {
    const response =
      await axiosInstance.get(
        "/experiences"
      );

    return response.data;
  };

export const createExperience =
  async (
    data: Omit<
      Experience,
      "_id" | "createdAt" | "updatedAt"
    >
  ): Promise<Experience> => {
    const response =
      await axiosInstance.post(
        "/experiences",
        data
      );

    return response.data;
  };

export const updateExperience =
  async (
    id: string,
    data: Partial<Experience>
  ): Promise<Experience> => {
    const response =
      await axiosInstance.put(
        `/experiences/${id}`,
        data
      );

    return response.data;
  };

export const deleteExperience =
  async (
    id: string
  ): Promise<void> => {
    await axiosInstance.delete(
      `/experiences/${id}`
    );
  };