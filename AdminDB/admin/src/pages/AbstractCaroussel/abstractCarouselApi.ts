import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/abstract-carousel`;
/* =========================================================
   TYPES
========================================================= */

export interface CarouselSlide {
  _id: string;
  title: string;
  description: string;
  order: number;
}

export interface AbstractCarousel {
  _id: string;
  slides: CarouselSlide[];
}

/* =========================================================
   GET
========================================================= */

export const getAbstractCarousel =
  async (): Promise<AbstractCarousel> => {
    const response = await axios.get(API_URL);

    return response.data;
  };

/* =========================================================
   ADD
========================================================= */

export const addAbstractSlide = async (
  title: string,
  description: string
) => {
  const response = await axios.post(API_URL, {
    title,
    description,
  });

  return response.data;
};

/* =========================================================
   UPDATE
========================================================= */

export const updateAbstractSlide = async (
  id: string,
  title: string,
  description: string
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    {
      title,
      description,
    }
  );

  return response.data;
};

/* =========================================================
   DELETE
========================================================= */

export const deleteAbstractSlide = async (
  id: string
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};