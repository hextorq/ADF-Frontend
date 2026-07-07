import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "High" | "Normal" | "New";

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  priority: Priority;
  to: string;
  pinned: boolean;
  visible: boolean;
  type: "Announcement" | "Call for Papers" | "Call for Chapters" | "Upcoming Programmes" | "Editorial Opportunities";
}

export interface Publication {
  id: string;
  title: string;
  category: string;
  pubType: "Article" | "Book Chapter" | "Book" | "Proceeding";
  date: string;
  volume?: string;
  issue?: string;
  identifier?: string; // DOI or ISBN
  authors?: string;
  coverImage?: string;
  to: string;
  pinned: boolean;
  visible: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string; // e.g. "2 hours ago"
  category: string;
  iconName: string; // lucide icon name
  pinned: boolean;
  visible: boolean;
}

export interface JournalRelease {
  id: string;
  title: string;
  issn: string;
  volume: string;
  issue: string;
  date: string;
  coverImage: string;
  to: string;
  pinned: boolean;
  visible: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  category: "Workshop" | "Webinar" | "Conference" | "FDP" | "Training";
  date: string;
  status: "upcoming" | "archive";
  to: string;
  pinned: boolean;
  visible: boolean;
}

export interface EditorialUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  pinned: boolean;
  visible: boolean;
}

export interface StatisticsData {
  articles: number;
  chapters: number;
  books: number;
  journals: number;
  reviewers: number;
  editors: number;
  countries: number;
  authors: number;
}

interface CMSState {
  announcements: Announcement[];
  publications: Publication[];
  activities: Activity[];
  journals: JournalRelease[];
  events: EventItem[];
  editorialUpdates: EditorialUpdate[];
  statistics: StatisticsData;

  // Generic CRUD actions (simplified for brevity, we could also use specific ones)
  setAnnouncements: (data: Announcement[]) => void;
  setPublications: (data: Publication[]) => void;
  setActivities: (data: Activity[]) => void;
  setJournals: (data: JournalRelease[]) => void;
  setEvents: (data: EventItem[]) => void;
  setEditorialUpdates: (data: EditorialUpdate[]) => void;
  setStatistics: (data: StatisticsData) => void;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: "1", date: "12 Jun 2026", type: "Announcement", category: "Editorial", priority: "High", title: "ADF expands editorial board with 14 new international members", excerpt: "Welcoming scholars from 9 countries across humanities, sciences, and management.", to: "/announcements", pinned: true, visible: true },
  { id: "2", date: "08 Jun 2026", type: "Announcement", category: "Publishing", priority: "New", title: "Convergence Volume III now in production", excerpt: "Edited volume featuring 22 chapters across multidisciplinary research themes.", to: "/announcements", pinned: false, visible: true },
  { id: "3", date: "01 Jun 2026", type: "Announcement", category: "Open Access", priority: "Normal", title: "All ADF journals adopt CC BY 4.0 by default", excerpt: "Authors retain copyright; readers gain unrestricted access worldwide.", to: "/announcements", pinned: false, visible: true },
  { id: "4", date: "Open · Rolling", type: "Call for Papers", category: "Journal", priority: "High", title: "International Journal of English for Academic Excellence — Vol. 2", excerpt: "Original research articles, literature reviews, and pedagogical studies invited.", to: "/journals", pinned: false, visible: true },
  { id: "5", date: "Closes 30 Aug 2026", type: "Call for Papers", category: "Special Issue", priority: "New", title: "Special Issue: AI and the Future of Academic Writing", excerpt: "Empirical and theoretical contributions on AI in research practice.", to: "/journals", pinned: false, visible: true },
];

const INITIAL_STATISTICS: StatisticsData = {
  articles: 1250,
  chapters: 430,
  books: 12,
  journals: 4,
  reviewers: 85,
  editors: 42,
  countries: 18,
  authors: 2100,
};

const INITIAL_ACTIVITIES: Activity[] = [
  { id: "a1", title: "New manuscript submitted", description: "Submission for Journal of English for Academic Excellence", time: "2 hours ago", category: "Submission", iconName: "FileText", pinned: false, visible: true },
  { id: "a2", title: "Peer review completed", description: "Review completed for 'AI in Education' paper", time: "5 hours ago", category: "Review", iconName: "CheckCircle", pinned: false, visible: true },
  { id: "a3", title: "Chapter accepted", description: "Chapter accepted for Convergence Vol. IV", time: "Yesterday", category: "Publishing", iconName: "BookOpen", pinned: true, visible: true },
];

const INITIAL_PUBLICATIONS: Publication[] = [
  { id: "p1", title: "The Impact of AI on Academic Writing", category: "Technology", pubType: "Article", date: "15 Jun 2026", volume: "2", issue: "1", authors: "Jane Doe, John Smith", to: "/journals", pinned: true, visible: true },
  { id: "p2", title: "Sustainable Business Practices in 2026", category: "Management", pubType: "Book Chapter", date: "10 Jun 2026", authors: "Alice Johnson", to: "/chapter-publications", pinned: false, visible: true },
];

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      announcements: INITIAL_ANNOUNCEMENTS,
      publications: INITIAL_PUBLICATIONS,
      activities: INITIAL_ACTIVITIES,
      journals: [],
      events: [],
      editorialUpdates: [],
      statistics: INITIAL_STATISTICS,

      setAnnouncements: (data) => set({ announcements: data }),
      setPublications: (data) => set({ publications: data }),
      setActivities: (data) => set({ activities: data }),
      setJournals: (data) => set({ journals: data }),
      setEvents: (data) => set({ events: data }),
      setEditorialUpdates: (data) => set({ editorialUpdates: data }),
      setStatistics: (data) => set({ statistics: data }),
    }),
    {
      name: "adf-cms-storage",
    }
  )
);
