import { Search, ChevronRight, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle, BookOpen, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/site/PageHeader";

import { useAuthStore } from "@/store/useAuthStore";

export default function BookStore() {
  const isAdmin = useAuthStore(s => s.isAdmin);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Books";

  const [localBooks, setLocalBooks] = useState(MOCK_BOOKS);
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

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

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
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
                <div className="flex flex-col gap-1.5">
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
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 font-medium">
                    Showing <span className="text-[var(--ink)] font-bold">{filteredBooks.length}</span> results
                  </span>
                  <select className="text-sm border-gray-200 rounded-lg bg-slate-50 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                    <option>Best Sellers</option>
                  </select>
                </div>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        const newBook: Book = {
                          id: Date.now().toString(),
                          title: "New Book Title",
                          author: "New Author",
                          genre: "Fiction",
                          description: "New book description.",
                          coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
                          rating: 0,
                          reviewCount: 0,
                          price: 0,
                          isbn: "000-00-0000-000-0",
                          edition: "First Edition",
                          stockStatus: "In Stock",
                          language: "English",
                          pages: 0,
                          publisher: "ADF Publications",
                          publicationDate: "2026-01-01",
                          readers: 0,
                          downloads: 0
                        };
                        setLocalBooks([newBook, ...localBooks]);
                      }}
                      className="surface-card flex min-h-[350px] flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors rounded-xl"
                    >
                      <span className="text-4xl font-light">+</span>
                      <span className="font-semibold">Add New Book</span>
                    </button>
                  )}
                  {filteredBooks.map(book => (
                    <div key={book.id} className="relative">
                      {isAdmin && (
                        <button
                          onClick={() => setLocalBooks(localBooks.filter(b => b.id !== book.id))}
                          className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <BookCard book={book} onQuickView={setQuickViewBook} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-16 text-center border border-border shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--ink)] mb-3">No books found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any books matching your current filters. Try adjusting your search or category selection.
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(""); setActiveCategory("All Books");}}
                    className="mt-8 bg-[var(--primary)] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[var(--deep)] transition-colors shadow-md cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Why Buy From ADF */}

      <section className="py-20 bg-white">
        <div className="container-academic">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-4">Why Buy From ADF Publications?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We are committed to delivering the highest quality academic and literary content with a seamless purchasing experience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Original Publications", desc: "100% authentic and peer-reviewed academic works." },
              { icon: Globe, title: "Worldwide Access", desc: "Digital and physical delivery available globally." },
              { icon: Truck, title: "Fast Delivery", desc: "Expedited shipping for physical paperback editions." },
              { icon: PlayCircle, title: "Book Preview", desc: "Read the first chapter free before making a purchase." },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-[var(--primary)] rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[var(--ink)] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Author CTA */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="container-academic text-center max-w-3xl mx-auto">
          <div className="eyebrow justify-center mb-4">Publishing Services</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--ink)] mb-4">Have a manuscript?</h2>
          <p className="text-lg text-[var(--ink-soft)] mb-8">
            Join hundreds of authors who have successfully published their research, literature, and academic books with ADF.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/literary-publications" className="btn-primary">
              Publish with ADF
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
