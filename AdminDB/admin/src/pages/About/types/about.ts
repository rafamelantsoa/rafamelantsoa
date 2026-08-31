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
    _id: string;
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
  
  export interface AboutUpdateData {
    title: string;
    expertise: AboutExpertise[];
    toolsTitle: string;
  }