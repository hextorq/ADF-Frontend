import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { 
  BookHeart, Brush, Feather, Headphones, ScrollText, Sparkles,
  Search, ChevronRight, TrendingUp, Award, Zap, Star
} from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Store Components
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PUBLISHING_GENRES = [
  { icon: BookHeart, t: "Novels", d: "Long-form fiction across literary, commercial, and crossover." },
  { icon: ScrollText, t: "Novellas", d: "Short, focused fiction with print and digital release." },
  { icon: Feather, t: "Poetry", d: "Single-author collections and curated chapbooks." },
  { icon: Sparkles, t: "Short Stories", d: "Single-author and themed collections." },
  { icon: Headphones, t: "Anthologies", d: "Editor-curated volumes around themes or movements." },
  { icon: Brush, t: "Hybrid & Experimental", d: "Works that cross genre and form." },
];

export default function Page() {
  // Store State
  const [activeCategory, setActiveCategory] = useState("All Books");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<"publish" | "store">("publish");

  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesCategory = activeCategory === "All Books" || book.genre === activeCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBook = MOCK_BOOKS.find(b => b.badge === "BESTSELLER") || MOCK_BOOKS[0];
  const newReleases = MOCK_BOOKS.filter(b => b.badge === "NEW" || b.publicationDate.includes("2026") || b.publicationDate.includes("2025"));

  return (
    <>
      <QuickViewModal 
        book={quickViewBook} 
        isOpen={!!quickViewBook} 
        onClose={() => setQuickViewBook(null)} 
      />

      {/* Hero Section */}
      <section className="bg-slate-50 pt-20 pb-16 border-b border-border text-center">
        <div className="container-academic max-w-4xl">
          <EditableText contentKey="page.lit.eyebrow" fallback="Literary Publishing & Book Store" as="div" className="eyebrow mx-auto justify-center" label="Eyebrow" />
          <EditableText contentKey="page.lit.title" fallback="Where Great Stories Are Born and Shared" as="h1" className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--ink)] leading-tight" label="Hero Title" />
          <EditableText contentKey="page.lit.desc" fallback="Professional publishing services for visionary authors and a curated storefront for passionate readers." as="p" multiline className="mt-6 text-xl text-[var(--ink-soft)] leading-relaxed" label="Hero Description" />
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setViewMode("publish")} 
              className={viewMode === "publish" ? "btn-primary" : "btn-outline bg-white"}
            >
              <EditableText contentKey="page.lit.cta1" fallback="Publish Your Book" as="span" label="Publish CTA" />
            </button>
            <button 
              onClick={() => setViewMode("store")} 
              className={viewMode === "store" ? "btn-primary" : "btn-outline bg-white"}
            >
              <EditableText contentKey="page.lit.cta2" fallback="Browse Books" as="span" label="Browse CTA" />
            </button>
          </div>
        </div>
      </section>

      {/* VIEW MODE: PUBLISH */}
      {viewMode === "publish" && (
        <div className="animate-in fade-in duration-500">
          {/* Publishing Services Section */}
          <section id="publishing-services" className="py-20 bg-white">
        <div className="container-academic">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <EditableText contentKey="page.lit.pub.eyebrow" fallback="Our Publishing Services" as="div" className="eyebrow mx-auto justify-center" label="Pub Eyebrow" />
            <EditableText contentKey="page.lit.pub.title" fallback="Everything You Need to Publish Successfully" as="h2" className="mt-4 font-serif text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Pub Title" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PUBLISHING_GENRES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="surface-card p-6 hover:border-[var(--primary)] transition group">
                <div className="h-12 w-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] transition-colors">
                  <Icon className="h-6 w-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                </div>
                <EditableText contentKey={`page.lit.pub.genre.${t}.title`} fallback={t} as="h3" className="font-serif text-xl font-semibold text-[var(--ink)]" label="Service Title" />
                <EditableText contentKey={`page.lit.pub.genre.${t}.desc`} fallback={d} as="p" multiline className="mt-2 text-[var(--ink-soft)] leading-relaxed" label="Service Description" />
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[var(--secondary)] rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[var(--primary)]/10">
            <div className="flex-1">
              <EditableText contentKey="page.lit.pub.features.title" fallback="Comprehensive Publishing Support" as="h3" className="font-serif text-2xl font-bold text-[var(--ink)]" label="Features Title" />
              <ul className="mt-6 grid sm:grid-cols-2 gap-4 text-[var(--ink-soft)] font-medium">
                {["ISBN Assistance", "Editing & Proofreading", "Cover Design", "Typesetting & Formatting", "Copyright Guidance", "Global Distribution"].map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link to="/literary-publications/submit" className="btn-primary text-center">Submit Manuscript</Link>
              <Link to="/guidelines/author" className="btn-outline bg-white text-center">View Guidelines</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Publishing Journey Timeline */}
      <section className="py-20 bg-slate-50 border-y border-border overflow-hidden">
        <div className="container-academic">
          <div className="text-center mb-16">
            <EditableText contentKey="page.lit.timeline.title" fallback="The Publishing Journey" as="h2" className="font-serif text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Timeline Title" />
            <p className="mt-4 text-lg text-[var(--ink-soft)]">From manuscript submission to global book sales.</p>
          </div>

          <div className="relative max-w-5xl mx-auto px-4">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-[var(--primary)] to-gray-200 -translate-y-1/2 hidden md:block z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {[
                { step: "1", title: "Submit Manuscript", desc: "Send your proposal" },
                { step: "2", title: "Editorial Review", desc: "Appraisal & Editing" },
                { step: "3", title: "Design Phase", desc: "Cover & Typesetting" },
                { step: "4", title: "Publication", desc: "Print & Digital Release" },
                { step: "5", title: "Book Sales", desc: "Available Worldwide" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-0 border-border">
                  <div className="w-12 h-12 rounded-full bg-white border-4 border-[var(--primary)] flex items-center justify-center font-bold text-[var(--primary)] mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="font-serif font-bold text-[var(--ink)] mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>
      )}

      {/* VIEW MODE: STORE */}
      {viewMode === "store" && (
        <div className="animate-in fade-in duration-500">
          {/* Featured Book Store */}
          <section id="bookstore" className="pt-20 pb-10 bg-white">
        <div className="container-academic text-center mb-12">
          <EditableText contentKey="page.lit.store.eyebrow" fallback="ADF Book Store" as="div" className="eyebrow mx-auto justify-center" label="Store Eyebrow" />
          <EditableText contentKey="page.lit.store.title" fallback="Discover Our Published Works" as="h2" className="mt-4 font-serif text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Store Title" />
        </div>
      </section>

      {/* Featured Bestseller Hero within Store */}
      <section className="pb-16 bg-white">
        <div className="container-academic">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
            
            <div className="relative w-full max-w-sm lg:w-1/3 aspect-[3/4] flex-shrink-0 perspective-1000">
               <div className="absolute top-4 left-4 z-20 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                 <Award className="h-4 w-4" />
                 FEATURED BESTSELLER
               </div>
               <img 
                  src={featuredBook.coverImage} 
                  alt={featuredBook.title}
                  className="w-full h-full object-cover rounded-r-xl rounded-l-sm shadow-2xl transform rotate-y-6 hover:rotate-y-0 transition-transform duration-700"
               />
               <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10 pointer-events-none transform -skew-y-6 origin-right"></div>
            </div>

            <div className="flex-1 space-y-6 relative z-10">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Star className="h-5 w-5 fill-amber-500" />
                {featuredBook.rating} ({featuredBook.reviewCount} Reviews)
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-[var(--primary)] uppercase tracking-wider">{featuredBook.genre}</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[var(--ink)] leading-tight">
                {featuredBook.title}
              </h2>
              <p className="text-xl text-[var(--ink-soft)]">
                By <span className="font-semibold text-gray-900">{featuredBook.author}</span>
              </p>
              <p className="text-gray-600 leading-relaxed max-w-2xl text-lg">
                {featuredBook.description}
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <span className="text-4xl font-bold text-[var(--ink)]">₹{featuredBook.price}</span>
                {featuredBook.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">₹{featuredBook.originalPrice}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="btn-primary shadow-lg shadow-[var(--primary)]/20 px-8 py-4">
                  Buy Now
                </button>
                <button 
                  onClick={() => setQuickViewBook(featuredBook)}
                  className="btn-outline bg-white px-8 py-4"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Releases Carousel */}
      <section className="py-16 bg-slate-50 border-y border-border">
        <div className="container-academic">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-500" /> New Arrivals
            </h2>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4 md:-ml-6">
              {newReleases.map((book) => (
                <CarouselItem key={`new-${book.id}`} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="h-full py-2">
                    <BookCard book={book} onQuickView={setQuickViewBook} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-6">
              <CarouselPrevious className="static transform-none" />
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Full Catalog */}
      <section className="py-16 bg-white">
        <div className="container-academic">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Title or author..."
                    className="pl-9 bg-slate-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-4">Categories</h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "text-left px-4 py-2 rounded-lg text-sm font-medium transition-all group border border-transparent whitespace-nowrap",
                        activeCategory === category 
                          ? "bg-[var(--primary)] text-white shadow-md"
                          : "bg-slate-50 text-gray-600 hover:bg-gray-100 hover:border-gray-200"
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
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">
                  {searchQuery ? "Search Results" : activeCategory}
                </h2>
                <span className="text-sm text-gray-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                  {filteredBooks.length} Books
                </span>
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
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-border">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-2">No books found</h3>
                  <p className="text-gray-500">Try a different category or search term.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setActiveCategory("All Books");}}
                    className="mt-6 text-[var(--primary)] font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
      </div>
      )}

      {/* Featured Author & Reviews (Shared) */}
      <section className="py-20 bg-[var(--secondary)] border-t border-[var(--primary)]/10">
        <div className="container-academic">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Featured Author */}
            <div>
              <EditableText contentKey="page.lit.author.eyebrow" fallback="Author Spotlight" as="div" className="eyebrow" label="Author Eyebrow" />
              <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--ink)] mb-8">Meet Our Bestselling Authors</h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0 border-4 border-slate-50 shadow-inner">
                  <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop" alt="Dr. Vikram Singh" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">Dr. Vikram Singh</h3>
                  <p className="text-[var(--primary)] font-medium text-sm mb-3">Published 3 Books with ADF</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    A leading voice in mindful leadership and organizational psychology. His books have transformed modern workplace cultures globally.
                  </p>
                  <button className="text-[var(--primary)] font-bold text-sm hover:underline flex items-center justify-center sm:justify-start gap-1">
                    View Author Profile <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reader Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Reader" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex text-amber-500 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
                  </div>
                  <span className="text-sm font-bold text-[var(--ink)]">4.9/5 from 10k+ Readers</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border relative">
                <div className="absolute top-8 right-8 text-6xl text-gray-200 font-serif leading-none">"</div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed mb-6 relative z-10">
                  "ADF Publications not only supported me through the entire editing and design process but their bookstore platform made it incredibly easy for my readers worldwide to purchase my book."
                </p>
                <div className="font-bold text-[var(--ink)]">— Sarah Jenkins, Author & Reader</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
