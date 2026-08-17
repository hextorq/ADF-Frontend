import { Search, ChevronRight, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle, BookOpen, Trash2, PenTool, Users, Lightbulb, Leaf, Plus } from "lucide-react";
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
                      <div className="text-[10px] sm:text-xs font-bold tracking-widest text-center leading-tight">
                        YOUR BOOK<br/>HERE
                      </div>
                    </Link>
                  </div>
                  
                  {/* The Wooden Shelf Base */}
                  <div className="absolute bottom-0 translate-y-full left-0 w-full h-4 sm:h-5 bg-gradient-to-r from-[#e6c28f] via-[#f3dcb1] to-[#e6c28f] rounded-sm shadow-[0_20px_30px_-10px_rgba(0,0,0,0.4)] z-0">
                    <div className="absolute bottom-0 w-full h-1/2 bg-black/10 rounded-b-sm"></div>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-12 w-full max-w-3xl">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Submit</div>
                      <div className="text-slate-500 text-sm">your manuscript</div>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Get reviewed</div>
                      <div className="text-slate-500 text-sm">by our editorial team</div>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Reach readers</div>
                      <div className="text-slate-500 text-sm">around the world</div>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/literary-publications"
                  className="bg-[#0b249a] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-900 transition-all hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-3 mb-6"
                >
                  Submit Your Manuscript <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Trusted by authors. Driven by purpose.
                </div>
              </div>
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
