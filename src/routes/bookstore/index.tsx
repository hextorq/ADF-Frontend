import { Search, ChevronRight, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle, BookOpen, Trash2, PenTool, Users, Lightbulb, Leaf, Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/site/PageHeader";
import { SEO } from "@/components/SEO";
import { buildBreadcrumbSchema } from "@/lib/seo";

import { useAuthStore } from "@/store/useAuthStore";

export default function BookStore() {
  const isAdmin = useAuthStore(s => s.isAdmin);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Books";

  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    fetch("/api/publications/literary/admin")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const published = data.filter(b => b.current_stage === 'Book Store');
          const fetchedBooks: Book[] = published.map(b => ({
            id: b.id.toString(),
            title: b.book_title,
            author: b.author_name,
            genre: b.book_genre,
            description: b.synopsis || "",
            coverImage: b.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
            rating: 5.0,
            reviewCount: 0,
            price: 999, // default
            isbn: b.isbn || "N/A",
            edition: "First Edition",
            stockStatus: "In Stock",
            badge: "NEW",
            language: b.book_language || "English",
            pages: b.page_count || 0,
            publisher: "ADF Publications",
            publicationDate: new Date(b.created_at).toISOString().split('T')[0],
            readers: 0,
            downloads: 0
          }));
          setLocalBooks(fetchedBooks);
        }
      })
      .catch(err => {
        console.error(err);
        setLocalBooks([]); // Fallback on error
      });
  }, []);

  const filteredBooks = useMemo(() => {
    return localBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All Books" || 
                              book.genre === activeCategory || 
                              (activeCategory === "Coming Soon" && book.badge === "COMING SOON");
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, localBooks]);

  const bookstoreSchema = [
    {
      "@type": "CollectionPage",
      "name": "Academic Bookstore & Published Volumes | Academic Development Forum",
      "description": "Browse and order peer-reviewed academic books, edited volumes, monographs, and conference proceedings published by ADF.",
      ...(localBooks.length > 0 ? {
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": localBooks.slice(0, 10).map((b, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "Book",
              "name": b.title,
              "author": { "@type": "Person", "name": b.author },
              ...(b.isbn && b.isbn !== "N/A" ? { "isbn": b.isbn } : {}),
              ...(b.coverImage ? { "image": b.coverImage } : {})
            }
          }))
        }
      } : {})
    },
    buildBreadcrumbSchema([{ name: "Book Store", path: "/bookstore" }])
  ];

  const pageTitle = searchQuery 
    ? `Search: "${searchQuery}" | ADF Bookstore` 
    : (activeCategory !== "All Books" ? `${activeCategory} Books | ADF Bookstore` : "Academic Bookstore & Published Volumes | Academic Development Forum");

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO
        title={pageTitle}
        description="Browse and order peer-reviewed academic books, edited volumes, monographs, and conference proceedings published by ADF."
        keywords="academic bookstore, buy academic books, published volumes, monographs, conference proceedings, ADF books"
        noindex={Boolean(searchQuery)}
        structuredData={bookstoreSchema}
      />

      {/* Quick View Modal */}
      {quickViewBook && (
        <QuickViewModal isOpen={true} book={quickViewBook} onClose={() => setQuickViewBook(null)} />
      )}

      {/* Page Header */}
      <PageHeader
        cmsKey="page.bookstore"
        eyebrow="ADF Marketplace"
        title="Book Store"
        description="Discover Knowledge That Shapes the Future. Explore our collection of premium academic and literary publications."
        crumbs={[{ label: "Book Store" }]}
      />

      {/* Browse Catalog */}
      <section id="browse-catalog" className="py-20 bg-slate-50">
        <div className="container-academic">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4" /> Search
                </h3>
                <Input 
                  placeholder="Title, author, or ISBN..."
                  className="bg-slate-50 border-slate-200 focus-visible:ring-[var(--primary)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Categories
                </h3>

                {/* Mobile Categories (Horizontal Scroll) */}
                <div className="block lg:hidden -mx-6 px-6">
                  <div className="flex gap-2 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all snap-start shadow-sm border",
                          activeCategory === category 
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  <style dangerouslySetInnerHTML={{__html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  `}} />
                </div>

                {/* Desktop List */}
                <div className="hidden lg:flex flex-col gap-1.5">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all group flex justify-between items-center cursor-pointer",
                        activeCategory === category 
                          ? "bg-[var(--primary)] text-white shadow-md" 
                          : "text-gray-600 hover:bg-slate-100 hover:text-[var(--ink)]"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-border shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory}
                </h2>
              </div>
              
              <div className="bg-white rounded-[2rem] p-10 lg:p-20 text-center shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col items-center overflow-hidden relative">
                {/* Decorative sparkles */}
                <div className="absolute top-16 left-1/2 -translate-x-32 w-2 h-2 text-yellow-400 rotate-45 border-t border-r border-yellow-400"></div>
                <div className="absolute top-24 left-1/2 translate-x-24 w-3 h-3 text-yellow-400 rotate-45 border-t border-r border-yellow-400"></div>

                <BookOpen className="w-12 h-12 text-[#1e3a8a] mb-6" />
                <div className="text-sm font-bold text-[#1e3a8a] tracking-[0.25em] uppercase mb-4">ADF Bookstore</div>
                <h3 className="text-4xl md:text-[3.5rem] leading-none font-serif font-bold text-slate-900 mb-6">
                  Your book could be <span className="text-[#1d4ed8]">here.</span>
                </h3>
                
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-20 leading-relaxed">
                  The ADF Bookstore is launching soon.<br className="hidden sm:block" />
                  We're currently accepting manuscripts for our first collection of authors and ideas.
                </p>
                
                {/* Bookshelf */}
                <div className="relative w-full max-w-4xl mx-auto mb-24 px-4 sm:px-12">
                  <div className="flex justify-center items-end gap-2 sm:gap-6 md:gap-8 relative z-10">
                    
                    {/* Book 1 */}
                    <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-56 bg-[#172554] rounded-r-lg rounded-l-sm shadow-xl flex flex-col items-center justify-center p-3 sm:p-5 border-l-[3px] border-black/20 text-white relative group">
                      <div className="absolute top-2 bottom-2 left-1.5 border-l border-white/10"></div>
                      <div className="absolute top-2 bottom-2 right-2 border-r border-white/10"></div>
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-[#eab308] opacity-80 stroke-[1.5]" />
                      <div className="text-[10px] sm:text-xs font-serif font-bold text-[#eab308] tracking-widest mb-1 text-center">IDEAS</div>
                      <div className="text-[7px] sm:text-[9px] font-sans text-white/70 tracking-widest text-center uppercase">That Inspire</div>
                      <div className="w-8 h-[1px] bg-white/20 mt-4 sm:mt-6"></div>
                    </div>

                    {/* Book 2 */}
                    <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-56 bg-[#14532d] rounded-r-lg rounded-l-sm shadow-xl flex flex-col items-center justify-center p-3 sm:p-5 border-l-[3px] border-black/20 text-white relative group">
                      <div className="absolute top-2 bottom-2 left-1.5 border-l border-white/10"></div>
                      <div className="absolute top-2 bottom-2 right-2 border-r border-white/10"></div>
                      <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-[#fcd34d] opacity-80 stroke-[1.5]" />
                      <div className="text-[10px] sm:text-xs font-serif font-bold text-[#fcd34d] tracking-widest mb-1 text-center">KNOWLEDGE</div>
                      <div className="text-[7px] sm:text-[9px] font-sans text-white/70 tracking-widest text-center uppercase">That Empowers</div>
                      <div className="w-8 h-[1px] bg-white/20 mt-4 sm:mt-6"></div>
                    </div>

                    {/* Book 3 */}
                    <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-56 bg-[#78350f] rounded-r-lg rounded-l-sm shadow-xl flex flex-col items-center justify-center p-3 sm:p-5 border-l-[3px] border-black/20 text-white relative group hidden xs:flex">
                      <div className="absolute top-2 bottom-2 left-1.5 border-l border-white/10"></div>
                      <div className="absolute top-2 bottom-2 right-2 border-r border-white/10"></div>
                      <Globe className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-[#fdba74] opacity-80 stroke-[1.5]" />
                      <div className="text-[10px] sm:text-xs font-serif font-bold text-[#fdba74] tracking-widest mb-1 text-center">STORIES</div>
                      <div className="text-[7px] sm:text-[9px] font-sans text-white/70 tracking-widest text-center uppercase">That Connect</div>
                      <div className="w-8 h-[1px] bg-white/20 mt-4 sm:mt-6"></div>
                    </div>

                    {/* Book 4 (Empty State) */}
                    <Link to="/literary-publications" className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-56 bg-white rounded-r-lg rounded-l-sm flex flex-col items-center justify-center p-3 sm:p-5 border-2 border-dashed border-[#93c5fd] text-[#1e40af] hover:bg-blue-50 transition-colors shadow-sm relative group cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-xs font-bold tracking-wider text-center uppercase">Your Book</div>
                      <div className="text-[9px] text-blue-400 mt-1 uppercase tracking-widest font-semibold">Publish Today</div>
                    </Link>
                  </div>
                  
                  {/* Wooden Shelf Graphic */}
                  <div className="w-full h-4 bg-[#b45309] rounded-sm shadow-md border-t border-amber-400/40 relative z-20"></div>
                  <div className="w-[96%] mx-auto h-3 bg-[#78350f] rounded-b-sm shadow-lg opacity-90 relative z-10"></div>
                  <div className="w-[90%] mx-auto h-4 bg-black/10 blur-sm rounded-full mt-1"></div>
                </div>

                {/* Submissions Open Banner */}
                <div className="w-full max-w-3xl bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                  <div>
                    <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                      Submissions Open
                    </div>
                    <div className="font-serif font-bold text-xl text-slate-900 mb-1">
                      Are you an author, researcher, or poet?
                    </div>
                    <div className="text-sm text-slate-600">
                      We offer ISBN assignment, professional cover design, and international distribution.
                    </div>
                  </div>
                  <Link to="/literary-publications/submit" className="whitespace-nowrap btn-primary px-6 py-3 font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                    Submit Manuscript
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

