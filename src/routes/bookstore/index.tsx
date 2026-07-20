import { Search, ChevronRight, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/site/PageHeader";

export default function BookStore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Books";

  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All Books" || 
                              book.genre === activeCategory || 
                              (activeCategory === "Coming Soon" && book.badge === "COMING SOON");
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

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
                  {filteredBooks.map(book => (
                    <div key={book.id}>
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

      {/* Reader Reviews */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--mint)]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="container-academic relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-4">What Our Readers Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Discover why academics and literary enthusiasts worldwide trust ADF Publications.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Dr. Sarah Jenkins", 
                role: "Research Scholar", 
                review: "The multidisciplinary approach in these books is outstanding. Highly recommended for researchers looking for comprehensive perspectives.", 
                rating: 5
              },
              { 
                name: "Prof. Michael Chen", 
                role: "University Professor", 
                review: "ADF publications always deliver high-quality, peer-reviewed content. It has become my go-to source for academic literature.", 
                rating: 5
              },
              { 
                name: "Emily R.", 
                role: "Avid Reader", 
                review: "The novels published here are captivating and beautifully edited. The physical print quality of the paperbacks is also top-notch.", 
                rating: 5
              }
            ].map((review, i) => (
              <div 
                key={i} 
                className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-[var(--primary)]/5 hover:border-[var(--primary)]/20 transition-all duration-300 relative group flex flex-col"
              >
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 text-[var(--primary)]/5 group-hover:text-[var(--primary)]/10 transition-colors duration-300">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21v-7.391c0-5.714 4.148-9.066 9.983-9.529v3.084c-3.13 0-5.32 1.434-5.32 4.195v1.641h5.32v8h-9.983zm-14.017 0v-7.391c0-5.714 4.148-9.066 9.983-9.529v3.084c-3.13 0-5.32 1.434-5.32 4.195v1.641h5.32v8h-9.983z"/>
                  </svg>
                </div>
                
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                  ))}
                </div>
                
                <p className="text-[var(--ink-soft)] text-lg mb-10 relative z-10 leading-relaxed flex-grow">
                  "{review.review}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--mint)] flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--ink)]">{review.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">{review.role}</p>
                  </div>
                </div>
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
