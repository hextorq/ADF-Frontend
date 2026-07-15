export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  isbn: string;
  edition: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock" | "Pre-order";
  badge?: "NEW" | "BESTSELLER" | "HOT" | "LIMITED" | "EDITOR'S PICK" | "COMING SOON" | "TOP RATED";
  language: string;
  pages: number;
  publisher: string;
  publicationDate: string;
  readers: number;
  downloads: number;
};

export const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Silent Echoes",
    author: "Dr. Arindam Chatterjee",
    genre: "Fiction",
    description: "A gripping tale of mystery and suspense set in the forgotten valleys of the Himalayas. Uncover the secrets that have remained hidden for centuries.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 120,
    price: 599,
    originalPrice: 899,
    discount: 33,
    isbn: "978-93-5520-001-1",
    edition: "First Edition",
    stockStatus: "In Stock",
    badge: "BESTSELLER",
    language: "English",
    pages: 350,
    publisher: "ADF Publications",
    publicationDate: "2025-11-15",
    readers: 15420,
    downloads: 5000,
  },
  {
    id: "2",
    title: "Verses of the Void",
    author: "Kavya Menon",
    genre: "Poetry",
    description: "A collection of contemporary poetry exploring the depths of human emotion, love, loss, and the silence in between.",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 85,
    price: 299,
    originalPrice: 399,
    discount: 25,
    isbn: "978-93-5520-002-8",
    edition: "First Edition",
    stockStatus: "Low Stock",
    badge: "NEW",
    language: "English",
    pages: 120,
    publisher: "ADF Publications",
    publicationDate: "2026-02-10",
    readers: 3200,
    downloads: 1200,
  },
  {
    id: "3",
    title: "The Quantum Enigma",
    author: "Prof. Rajesh Kumar",
    genre: "Science Fiction",
    description: "When a physics experiment goes terribly wrong, a team of scientists must navigate alternate realities to save their universe.",
    coverImage: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 210,
    price: 649,
    originalPrice: 799,
    discount: 18,
    isbn: "978-93-5520-003-5",
    edition: "Second Edition",
    stockStatus: "In Stock",
    badge: "EDITOR'S PICK",
    language: "English",
    pages: 420,
    publisher: "ADF Publications",
    publicationDate: "2024-08-20",
    readers: 25000,
    downloads: 8900,
  },
  {
    id: "4",
    title: "Echoes of the Past",
    author: "Sunita Rao",
    genre: "Historical Fiction",
    description: "Set during the Indian independence movement, this novel weaves a tale of courage, betrayal, and the quest for freedom.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 150,
    price: 499,
    isbn: "978-93-5520-004-2",
    edition: "First Edition",
    stockStatus: "In Stock",
    language: "English",
    pages: 280,
    publisher: "ADF Publications",
    publicationDate: "2025-05-05",
    readers: 8000,
    downloads: 3000,
  },
  {
    id: "5",
    title: "The Mindful Leader",
    author: "Dr. Vikram Singh",
    genre: "Motivation",
    description: "A comprehensive guide to developing emotional intelligence and mindfulness for modern leaders in high-stress environments.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 420,
    price: 399,
    originalPrice: 599,
    discount: 33,
    isbn: "978-93-5520-005-9",
    edition: "Third Edition",
    stockStatus: "In Stock",
    badge: "TOP RATED",
    language: "English",
    pages: 210,
    publisher: "ADF Publications",
    publicationDate: "2023-11-12",
    readers: 45000,
    downloads: 18000,
  },
  {
    id: "6",
    title: "Shadows of the City",
    author: "Ananya Desai",
    genre: "Thriller",
    description: "A gripping psychological thriller that will keep you guessing until the very last page. Who is watching from the shadows?",
    coverImage: "https://images.unsplash.com/photo-1587876802187-5789ee91b988?q=80&w=800&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 95,
    price: 449,
    isbn: "978-93-5520-006-6",
    edition: "First Edition",
    stockStatus: "Low Stock",
    badge: "HOT",
    language: "English",
    pages: 310,
    publisher: "ADF Publications",
    publicationDate: "2026-04-01",
    readers: 4200,
    downloads: 1500,
  }
];

export const CATEGORIES = [
  "All Books",
  "Fiction",
  "Poetry",
  "Novels",
  "Anthologies",
  "Children",
  "Biography",
  "Motivation",
  "Tamil Literature",
  "English Literature",
  "Coming Soon"
];
