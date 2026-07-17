import { Search, ChevronRight, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PageHeader } from "@/components/site/PageHeader";

export default function BookStore() {
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState("Editor's Picks");

  const bestSellers = MOCK_BOOKS.filter(b => b.badge === "BESTSELLER" || b.rating >= 4.8);
  const newReleases = MOCK_BOOKS.filter(b => b.badge === "NEW");

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


      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container-academic">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-2">Featured Collections</h2>
              <p className="text-gray-500">Handpicked selections by our editorial team</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 scrollbar-hide">
              {["Editor's Picks", "Award Winning", "Trending This Month", "Faculty Recommendations"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                    activeTab === tab ? "bg-[var(--primary)] text-white" : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_BOOKS.slice(0, 4).map(book => (
              <div key={book.id}>
                <BookCard book={book} onQuickView={setQuickViewBook} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-16 bg-slate-50 border-y border-border">
        <div className="container-academic">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-2">Best Sellers</h2>
              <p className="text-gray-500">Our most popular publications this year</p>
            </div>
            <Link to="/bookstore/search?sort=bestsellers" className="text-[var(--primary)] font-bold hover:underline flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-4 md:-ml-6">
              {bestSellers.map((book) => (
                <CarouselItem key={`bestseller-${book.id}`} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="h-full py-2">
                    <BookCard book={book} onQuickView={setQuickViewBook} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-6">
              <CarouselPrevious className="static transform-none bg-white hover:bg-[var(--primary)] hover:text-white transition-colors" />
              <CarouselNext className="static transform-none bg-white hover:bg-[var(--primary)] hover:text-white transition-colors" />
            </div>
          </Carousel>
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
