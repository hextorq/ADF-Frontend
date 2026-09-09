export interface CampaignCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  shortRequirement: string;
  detailedRequirements: {
    pageLimit?: string;
    wordLimit?: string;
    formatting?: string;
    pages?: string;
    quantity?: string;
    notes?: string;
  };
}

export interface CampaignLanguage {
  code: string;
  name: string;
  nativeName: string;
  fontNote?: string;
  recommendedFont?: string;
}

export interface CampaignBenefit {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface CampaignChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export interface CampaignConfig {
  id: string;
  title: string;
  subtitle: string;
  volume: string;
  event: string;
  deadlineIso: string; // e.g. "2026-09-20T23:59:59+05:30"
  deadlineFormatted: string;
  tagline: string;
  posterUrl: string;
  categories: CampaignCategory[];
  languages: CampaignLanguage[];
  fees: {
    submissionFee: number;
    publicationFee: number;
    isFree: boolean;
    printDisclaimer: string;
    paymentTerms: string;
  };
  benefits: CampaignBenefit[];
  minimumSlot: string;
  checklist: CampaignChecklistItem[];
  contact: {
    email: string;
    phone: string;
    phoneFormatted: string;
  };
  social: {
    instagram: { handle: string; url: string };
    youtube: { channel: string; url: string };
    linkedin: { name: string; url: string };
  };
}

export const ART_DREAMS_FUSION_VOL_1: CampaignConfig = {
  id: "art-dreams-fusion-vol-1",
  title: "Art, Dreams & Fusion",
  subtitle: "An Anthology Celebrating Everyday Voices",
  volume: "Volume I",
  event: "Inauguration Publication by Academic Development Forum",
  deadlineIso: "2026-09-20T23:59:59+05:30",
  deadlineFormatted: "20.09.2026",
  tagline: "LET YOUR VOICE BE HEARD. LET YOUR ART INSPIRE THE WORLD.",
  posterUrl: "/campaigns/art-dreams-fusion-vol-1-poster.jpg",
  
  categories: [
    {
      id: "short-story",
      name: "Short Story",
      icon: "BookOpen",
      shortRequirement: "Up to 5 pages or below 2000 words",
      detailedRequirements: {
        pageLimit: "Page limit 5 or below 2000 words",
        wordLimit: "Max 2000 words",
        formatting: "A4 | Times New Roman 12 | Line Space 1.5",
        notes: "Narratives reflecting authentic emotions, vivid life encounters, and storytelling brilliance."
      }
    },
    {
      id: "poem",
      name: "Poem",
      icon: "Feather",
      shortRequirement: "Maximum 2 Pages",
      detailedRequirements: {
        pages: "2 Pages",
        formatting: "Original poetic works across any meter, rhyme, or free verse style.",
        notes: "Poetic reflections of everyday human feelings, passions, and inner landscapes."
      }
    },
    {
      id: "drawing",
      name: "Drawing",
      icon: "Palette",
      shortRequirement: "One Page Artwork",
      detailedRequirements: {
        pages: "One Page",
        formatting: "Clear high-resolution scan or digital export (JPEG / PNG / PDF).",
        notes: "Sketches, ink illustrations, watercolours, pencils, or modern graphic illustrations."
      }
    },
    {
      id: "photograph",
      name: "Photograph",
      icon: "Camera",
      shortRequirement: "One Page High-Res",
      detailedRequirements: {
        pages: "One Page",
        formatting: "High-resolution raw or processed photography (JPEG / PNG).",
        notes: "Evocative photography capturing human stories, nature, street life, and candid moods."
      }
    },
    {
      id: "quotes",
      name: "Quotes",
      icon: "Quote",
      shortRequirement: "Minimum of 10 Quotes",
      detailedRequirements: {
        quantity: "Minimum of 10 original quotes",
        formatting: "A collection of 10 or more impactful one-liners or short musings.",
        notes: "Philosophical insights, uplifting observations, and poignant personal truths."
      }
    },
    {
      id: "essay",
      name: "Essay",
      icon: "FileText",
      shortRequirement: "Up to 5 pages or below 2000 words",
      detailedRequirements: {
        pageLimit: "Page limit 5 or below 2000 words",
        wordLimit: "Max 2000 words",
        formatting: "A4 | Times New Roman 12 | Line Space 1.5",
        notes: "Reflective essays, cultural commentaries, literary critiques, or creative non-fiction."
      }
    }
  ],

  languages: [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      recommendedFont: "Times New Roman (12pt)"
    },
    {
      code: "ta",
      name: "Tamil",
      nativeName: "தமிழ்",
      fontNote: "Latha Font",
      recommendedFont: "Latha Font"
    }
  ],

  fees: {
    submissionFee: 0,
    publicationFee: 0,
    isFree: true,
    printDisclaimer: "If you require a printed (hard) copy of the anthology, a nominal printing cost along with courier charges must be paid after the book is finalized.",
    paymentTerms: "The payment will be collected only after the finalization of the book and upon submission of the signed Declaration Form."
  },

  benefits: [
    {
      title: "Certificate",
      subtitle: "Formal Recognition",
      description: "You will receive an official Certificate of Participation & Publication honoring your contributing work.",
      icon: "Award"
    },
    {
      title: "ISBN Registered",
      subtitle: "Official Book Record",
      description: "The anthology will be officially registered with an International Standard Book Number (ISBN) for international indexing.",
      icon: "BookMarked"
    },
    {
      title: "Be Part of a Movement",
      subtitle: "Diverse Everyday Voices",
      description: "Join an inspiring community celebrating creativity, diversity, cultural harmony, and everyday authentic voices.",
      icon: "Users"
    }
  ],

  minimumSlot: "30–50 or 100 pages for the book",

  checklist: [
    {
      id: "manuscript",
      label: "Your Creative Work",
      description: "Manuscript text, poem, essay, drawing, photograph, or quotes set.",
      required: true
    },
    {
      id: "bio",
      label: "4 to 5 Lines Author Bio",
      description: "A short, engaging introduction about yourself and your creative focus.",
      required: true
    },
    {
      id: "photo",
      label: "Clear Author Photo",
      description: "High-resolution portrait picture to feature alongside your published work.",
      required: true
    },
    {
      id: "email",
      label: "Email Address",
      description: "Active email ID for editorial correspondence and proof verification.",
      required: true
    },
    {
      id: "phone",
      label: "Phone / WhatsApp Number",
      description: "Phone number with country code for rapid communication.",
      required: true
    },
    {
      id: "instagram",
      label: "Instagram ID (Optional)",
      description: "Your Instagram handle (@yourhandle) for creator tagging and social highlights.",
      required: false
    }
  ],

  contact: {
    email: "academicdevelopmentforum24@gmail.com",
    phone: "+91 75023 98680",
    phoneFormatted: "+91 75023 98680"
  },

  social: {
    instagram: {
      handle: "@adf_publisher",
      url: "https://www.instagram.com/adf_publisher"
    },
    youtube: {
      channel: "ADF Publisher",
      url: "https://www.youtube.com/@adf_publisher"
    },
    linkedin: {
      name: "Academic Development Forum",
      url: "https://www.linkedin.com/in/academic-development-forum-adf-8a4651418"
    }
  }
};
