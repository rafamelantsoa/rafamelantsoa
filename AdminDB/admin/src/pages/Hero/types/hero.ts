export interface HeroImage {
    url: string;
    publicId: string;
  }
  
  export interface Hero {
    _id: string;
    title: string;
    description: string;
  
    cvUrl: string;
    cvPublicId: string;
  
    lightImage: HeroImage;
    darkImage: HeroImage;
  
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface HeroUpdateData {
    title: string;
    description: string;
  }