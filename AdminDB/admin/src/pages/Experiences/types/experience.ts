export interface Experience {
    _id: string;
    company: string;
    role: string;
    date: string;
    missions: string[];
    order: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ExperienceSection {
    _id: string;
    title: string;
  }