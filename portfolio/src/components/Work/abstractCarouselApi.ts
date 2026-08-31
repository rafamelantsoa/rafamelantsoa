// abstractCarouselApi.ts

import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_URL = "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

export type CarouselSlide = {
  _id: string;
  title: string;
  description: string;
};

export type AbstractCarousel = {
  _id?: string;
  slides: CarouselSlide[];
  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   GET CAROUSEL
========================================================= */

export const getAbstractCarousel =
  async (): Promise<AbstractCarousel> => {
    const response = await axios.get(
      `${API_URL}/abstract-carousel`
    );

    return response.data;
  };

/* =========================================================
   ADD SLIDE
========================================================= */

export const addAbstractSlide = async (
  title: string,
  description: string
) => {
  const response = await axios.post(
    `${API_URL}/abstract-carousel/slides`,
    {
      title,
      description,
    }
  );

  return response.data;
};

/* =========================================================
   UPDATE SLIDE
========================================================= */

export const updateAbstractSlide = async (
  id: string,
  title: string,
  description: string
) => {
  const response = await axios.put(
    `${API_URL}/abstract-carousel/slides/${id}`,
    {
      title,
      description,
    }
  );

  return response.data;
};

/* =========================================================
   DELETE SLIDE
========================================================= */

export const deleteAbstractSlide = async (
  id: string
) => {
  const response = await axios.delete(
    `${API_URL}/abstract-carousel/slides/${id}`
  );

  return response.data;
};