export interface ResearchArea {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  topics: string[];
}

export interface CallForAbstractData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  theme: string;
  publisher: string;
  publisherTagline: string;
  targetAudience: string[];
  publicationFormat: string;
  dates: {
    opensDate: string;
    opensDateIso: string;
    deadlineDate: string;
    deadlineIso: string;
  };
  fees: {
    amount: number;
    currency: string;
    formatted: string;
    disclaimer: string;
    upiId: string;
    receiverName: string;
    qrCodeUrl: string;
  };
  guidelines: {
    wordCount: { min: number; max: number; label: string };
    keywordsCount: { min: number; max: number; label: string };
    language: string;
    format: string;
    font: string;
    lineSpacing: string;
    authorRule: string;
  };
  benefits: {
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
  }[];
  hardCopyPolicy: {
    available: boolean;
    terms: string;
  };
  contact: {
    phone: string;
    phoneFormatted: string;
    whatsappUrl: string;
    email: string;
    website: string;
  };
  posterUrl: string;
  researchAreas: ResearchArea[];
}

export const INTERDISCIPLINARY_HORIZONS_CALL: CallForAbstractData = {
  id: "interdisciplinary-horizons-2026",
  posterUrl: "/posters/call-for-abstracts-2026.jpg",
  badge: "CALL FOR ABSTRACT SUBMISSION",
  title: "INTERDISCIPLINARY HORIZONS",
  subtitle: "Emerging Trends in Research, Innovation, and Sustainable Development",
  theme: "Multidisciplinary E-Book of Abstracts",
  publisher: "Academic Development Forum (ADF)",
  publisherTagline: "Encouraging Research | Connecting Disciplines | Inspiring Innovation",
  targetAudience: [
    "Research Scholars",
    "Students",
    "Faculty Members",
    "Academicians",
    "Independent Researchers",
  ],
  publicationFormat: "Multidisciplinary E-Book of Abstracts with ISBN & Registered DOI",
  dates: {
    opensDate: "5 November 2026",
    opensDateIso: "2026-11-05T00:00:00+05:30",
    deadlineDate: "15 December 2026",
    deadlineIso: "2026-12-15T23:59:59+05:30",
  },
  fees: {
    amount: 50,
    currency: "INR",
    formatted: "₹50 per abstract",
    disclaimer: "Nominal administrative processing fee of ₹50 per submitted abstract.",
    upiId: "7502398680@sbi",
    receiverName: "ATTRAIT DOVIN FEDRICK SELVARAJ",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3D7502398680%40sbi%26pn%3DATTRAIT%20DOVIN%20FEDRICK%20SELVARAJ%26cu%3DINR%26am%3D50",
  },
  guidelines: {
    wordCount: {
      min: 200,
      max: 300,
      label: "200–300 words",
    },
    keywordsCount: {
      min: 4,
      max: 6,
      label: "4–6 keywords",
    },
    language: "English",
    format: "PDF (.pdf) or Word (.docx / .doc)",
    font: "Times New Roman, 12 pt",
    lineSpacing: "1.5 line spacing",
    authorRule: "One author per abstract; co-authorship is not permitted.",
  },
  benefits: [
    {
      title: "Multidisciplinary E-Book Publication",
      description: "Publication of all accepted abstracts in a professionally formatted, curated international e-book.",
      icon: "BookOpen",
      highlight: true,
    },
    {
      title: "Official ISBN Assignment",
      description: "International Standard Book Number (ISBN) assigned to the published volume for global indexing.",
      icon: "BookMarked",
      highlight: true,
    },
    {
      title: "Registered DOI",
      description: "Digital Object Identifier (DOI) assigned for the entire volume, subject to official registration.",
      icon: "Globe",
      highlight: true,
    },
    {
      title: "Individual E-Certificate",
      description: "Personalized, verifiable electronic certificate of publication issued to every accepted author.",
      icon: "Award",
      highlight: true,
    },
    {
      title: "Free Digital Copy",
      description: "Complimentary high-resolution digital edition of the full e-book delivered to every contributor.",
      icon: "Download",
    },
    {
      title: "Official Website Archive",
      description: "Permanent open-access publication repository listing on the official Academic Development Forum portal.",
      icon: "CheckCircle2",
    },
  ],
  hardCopyPolicy: {
    available: true,
    terms: "Hard copy volume available upon author request. Physical printing and domestic/international courier charges must be borne by the author.",
  },
  contact: {
    phone: "+91 75023 98680",
    phoneFormatted: "+91 75023 98680",
    whatsappUrl: "https://wa.me/917502398680?text=Hello%20Academic%20Development%20Forum,%20I%20am%20inquiring%20about%20the%20Call%20for%20Abstract%20Submission%20-%20Interdisciplinary%20Horizons%202026.",
    email: "academicdevelopmentforum24@gmail.com",
    website: "https://www.adf.ijeae.com",
  },
  researchAreas: [
    {
      id: "english-languages",
      name: "English and Languages",
      shortName: "Languages",
      iconName: "Languages",
      description: "Literary theory, linguistics, comparative literature, ELT, translation studies, and discourse analysis.",
      topics: ["Comparative Literature", "Applied Linguistics", "English Language Teaching", "Cultural Studies", "Translation & Discourse"],
    },
    {
      id: "arts-humanities",
      name: "Arts and Humanities",
      shortName: "Humanities",
      iconName: "Palette",
      description: "Philosophy, history, archaeology, cultural heritage, performing arts, aesthetics, and ethics.",
      topics: ["Philosophy & Ethics", "History & Heritage", "Visual & Performing Arts", "Religious Studies", "Cultural Anthropology"],
    },
    {
      id: "education",
      name: "Education",
      shortName: "Education",
      iconName: "GraduationCap",
      description: "Pedagogy, digital learning, educational policy, curriculum design, inclusive education, and teacher training.",
      topics: ["Higher Education Pedagogy", "EdTech & AI in Learning", "Curriculum Design", "Special Education", "Educational Assessment"],
    },
    {
      id: "social-sciences",
      name: "Social Sciences",
      shortName: "Social Sciences",
      iconName: "Users",
      description: "Sociology, psychology, political science, public administration, international relations, and community studies.",
      topics: ["Sociology of Development", "Applied Psychology", "Public Policy", "International Relations", "Human Rights"],
    },
    {
      id: "science",
      name: "Science",
      shortName: "Pure Science",
      iconName: "Atom",
      description: "Physics, chemistry, mathematics, biological sciences, biochemistry, and applied sciences.",
      topics: ["Applied Physics", "Chemical Sciences", "Mathematical Modeling", "Biosciences", "Biotechnology"],
    },
    {
      id: "engineering-technology",
      name: "Engineering and Technology",
      shortName: "Engineering",
      iconName: "Cpu",
      description: "Mechanical, civil, electrical, chemical, electronics engineering, materials science, and robotics.",
      topics: ["Smart Materials", "Renewable Energy Tech", "Robotics & Automation", "Structural Engineering", "IoT Systems"],
    },
    {
      id: "computer-science",
      name: "Computer Science",
      shortName: "Computer Science",
      iconName: "Binary",
      description: "Artificial intelligence, machine learning, data science, cybersecurity, software engineering, and cloud computing.",
      topics: ["Generative AI & LLMs", "Cybersecurity", "Data Analytics & Big Data", "Cloud Computing", "Human-Computer Interaction"],
    },
    {
      id: "commerce-management",
      name: "Commerce and Management",
      shortName: "Management",
      iconName: "Briefcase",
      description: "Marketing, human resources, organizational behavior, business analytics, entrepreneurship, and corporate strategy.",
      topics: ["Strategic Management", "Digital Marketing", "FinTech & Banking", "Supply Chain", "Corporate Governance"],
    },
    {
      id: "economics",
      name: "Economics",
      shortName: "Economics",
      iconName: "TrendingUp",
      description: "Microeconomics, macroeconomics, development economics, behavioral economics, and public finance.",
      topics: ["Sustainable Economic Growth", "Financial Econometrics", "Public Finance", "Development Economics", "Monetary Policy"],
    },
    {
      id: "environmental-studies",
      name: "Environmental Studies",
      shortName: "Environment",
      iconName: "Leaf",
      description: "Climate change, ecological conservation, environmental policy, renewable resources, and waste management.",
      topics: ["Climate Resilience", "Biodiversity Conservation", "Circular Economy", "Environmental Impact Assessment", "Water Resource Mgmt"],
    },
    {
      id: "health-sciences",
      name: "Health Sciences",
      shortName: "Health Sciences",
      iconName: "HeartPulse",
      description: "Public health, epidemiology, nursing, pharmacy, clinical research, mental health, and biomedical sciences.",
      topics: ["Public Health Systems", "Epidemiological Studies", "Mental Health Wellbeing", "Pharmaceutical Sciences", "Nutrition & Healthcare"],
    },
    {
      id: "law-governance",
      name: "Law and Governance",
      shortName: "Law & Governance",
      iconName: "Scale",
      description: "Constitutional law, corporate law, cyber law, intellectual property rights, environmental law, and legal reform.",
      topics: ["Cyber Laws & AI Ethics", "IPR & Patent Regimes", "Constitutional Jurisprudence", "International Law", "Judicial Reforms"],
    },
    {
      id: "media-communication",
      name: "Media and Communication",
      shortName: "Media",
      iconName: "Tv",
      description: "Journalism, mass communication, digital media trends, public relations, cinema studies, and social media impacts.",
      topics: ["Digital Journalism", "Social Media Dynamics", "Media Ethics & Law", "Broadcasting & Film", "Communication Theory"],
    },
    {
      id: "agriculture-food-science",
      name: "Agriculture and Food Science",
      shortName: "Agriculture",
      iconName: "Sprout",
      description: "Agronomy, sustainable farming, food security, post-harvest technology, agricultural economics, and soil health.",
      topics: ["Precision Agriculture", "Food Security & Safety", "Soil Conservation", "Agri-Business Management", "Organic Farming"],
    },
    {
      id: "interdisciplinary-studies",
      name: "Interdisciplinary Studies",
      shortName: "Interdisciplinary",
      iconName: "Layers",
      description: "Cross-domain research combining technical, humanities, socio-economic, and scientific perspectives.",
      topics: ["Digital Humanities", "AI in Healthcare", "Bio-Ethics & Law", "Techno-Economic Systems", "Sustainable Innovation"],
    },
  ],
};

