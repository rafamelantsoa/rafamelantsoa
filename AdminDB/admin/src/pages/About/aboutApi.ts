import axiosInstance from "../../services/axiosInstance";

import type {
  About,
  AboutUpdateData,
} from "./types/about";

/*
|--------------------------------------------------------------------------
| GET ABOUT
|--------------------------------------------------------------------------
*/

export const getAbout = async (): Promise<About> => {
  try {
    const response = await axiosInstance.get<About>(
      "/about"
    );

    return response.data;
  } catch (error) {
    console.error("GET ABOUT ERROR:", error);
    throw error;
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE ABOUT
|--------------------------------------------------------------------------
*/

export const updateAbout = async (
  data: AboutUpdateData
): Promise<{
  message: string;
  about: About;
}> => {
  try {
    const response = await axiosInstance.put(
      "/about",
      data
    );

    return response.data;
  } catch (error) {
    console.error("UPDATE ABOUT ERROR:", error);
    throw error;
  }
};


/*
|--------------------------------------------------------------------------
| ADD TOOL
|--------------------------------------------------------------------------
*/

export const addTool = async (
  name: string,
  logo: File
): Promise<{
  message: string;
  about: About;
}> => {
  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("logo", logo);

    const response = await axiosInstance.post(
      "/about/tools",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("ADD TOOL ERROR:", error);
    throw error;
  }
};


/*
|--------------------------------------------------------------------------
| DELETE TOOL
|--------------------------------------------------------------------------
*/

export const deleteTool = async (
  toolId: string
): Promise<{
  message: string;
  about: About;
}> => {
  try {
    const response = await axiosInstance.delete(
      `/about/tools/${toolId}`
    );

    return response.data;
  } catch (error) {
    console.error("DELETE TOOL ERROR:", error);
    throw error;
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE TOOL LOGO
|--------------------------------------------------------------------------
*/

export const updateToolLogo = async (
  toolId: string,
  logo: File
): Promise<{
  message: string;
  about: About;
}> => {
  try {
    const formData = new FormData();

    formData.append("logo", logo);

    const response = await axiosInstance.put(
      `/about/tools/${toolId}/logo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("UPDATE TOOL LOGO ERROR:", error);
    throw error;
  }
};