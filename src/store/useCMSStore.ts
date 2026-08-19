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

export interface JournalInfo {
  id: string;
  abbr: string;
  title: string;
  issn: string;
  scope: string;
  frequency: string;
  access: string;
  submitUrl?: string;
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
  journalList: JournalInfo[];

  // Generic CRUD actions (simplified for brevity, we could also use specific ones)
  setAnnouncements: (data: Announcement[]) => void;
  setPublications: (data: Publication[]) => void;
  setActivities: (data: Activity[]) => void;
  setJournals: (data: JournalRelease[]) => void;
  setEvents: (data: EventItem[]) => void;
  setEditorialUpdates: (data: EditorialUpdate[]) => void;
  setStatistics: (data: StatisticsData) => void;
  setJournalList: (data: JournalInfo[]) => void;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
const INITIAL_STATISTICS: StatisticsData = {
  articles: 0,
  chapters: 0,
  books: 0,
  journals: 0,
  reviewers: 0,
  editors: 0,
  countries: 0,
  authors: 0,
};
const INITIAL_ACTIVITIES: Activity[] = [];
const INITIAL_PUBLICATIONS: Publication[] = [];
const INITIAL_JOURNALS: JournalRelease[] = [];
const INITIAL_JOURNAL_LIST: JournalInfo[] = [];

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      announcements: INITIAL_ANNOUNCEMENTS,
      publications: INITIAL_PUBLICATIONS,
      activities: INITIAL_ACTIVITIES,
      journals: INITIAL_JOURNALS,
      events: [],
      editorialUpdates: [],
      statistics: INITIAL_STATISTICS,
      journalList: INITIAL_JOURNAL_LIST,

      setAnnouncements: (data) => set({ announcements: data }),
      setPublications: (data) => set({ publications: data }),
      setActivities: (data) => set({ activities: data }),
      setJournals: (data) => set({ journals: data }),
      setEvents: (data) => set({ events: data }),
      setEditorialUpdates: (data) => set({ editorialUpdates: data }),
      setStatistics: (data) => set({ statistics: data }),
      setJournalList: (data) => set({ journalList: data }),
    }),
    {
      name: "adf-cms-storage",
    }
  )
);
