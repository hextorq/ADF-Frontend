import { Search, ChevronRight, BookOpen, Star, Filter, Heart, ShoppingCart, ArrowRight, CheckCircle, ShieldCheck, Truck, Globe, Download, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071A8C] via-[#0A24A6] to-[#0477BF] text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="container-academic relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
              Welcome to the ADF Marketplace
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-serif mb-6 leading-tight drop-shadow-lg">
              📚 ADF <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">BOOK STORE</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl font-light">
              Discover Knowledge That Shapes the Future. Explore our collection of premium academic and literary publications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 text-sm font-medium tracking-wide uppercase text-blue-200">
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4"/> Academic</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4"/> Literary</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4"/> Research</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4"/> Open Access</span>
            </div>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105">
                Browse Books <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-[#071A8C] font-bold px-8 py-6 text-lg rounded-full transition-transform hover:scale-105">
                New Releases
              </Button>
            </div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center relative perspective-1000">
            {/* 3D Floating Book Effect */}
            <div className="relative w-72 h-96 animate-float transform rotate-y-[-20deg] rotate-x-[10deg]">
              <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover rounded-r-2xl shadow-2xl z-20 border-l-8 border-gray-300" alt="Featured Book" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-30 rounded-r-2xl"></div>
              {/* Pages */}
              <div className="absolute top-2 -right-4 w-4 h-[96%] bg-white rounded-r-md border-y border-r border-gray-200 shadow-inner z-10 transform translate-z-[-10px]"></div>
              <div className="absolute top-4 -right-8 w-4 h-[92%] bg-gray-100 rounded-r-md border-y border-r border-gray-300 shadow-inner z-0 transform translate-z-[-20px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="container-academic -mt-8 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: BookOpen, label: "Academic Books", color: "bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-500" },
            { icon: Search, label: "Research Books", color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-500" },
            { icon: Star, label: "Literary Books", color: "bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-500" },
            { icon: Download, label: "Open Access", color: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-500" },
            { icon: BookOpen, label: "Book Chapters", color: "bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-500" },
          ].map((cat, i) => (
            <Link to={`/bookstore/search?category=${cat.label}`} key={i} className={cn("flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white", cat.color)}>
              <cat.icon className="h-8 w-8 mb-3" />
              <span className="font-semibold text-center text-sm">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

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
      <section className="py-20 relative overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2000&auto=format&fit=crop')] opacity-20 object-cover mix-blend-overlay"></div>
        <div className="container-academic relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Have a manuscript?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Join hundreds of authors who have successfully published their research, literature, and academic books with ADF.
          </p>
          <Link to="/literary-publications">
            <Button size="lg" className="bg-[var(--primary)] hover:bg-blue-700 text-white font-bold px-10 py-6 text-lg rounded-full shadow-xl">
              Publish with ADF
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
