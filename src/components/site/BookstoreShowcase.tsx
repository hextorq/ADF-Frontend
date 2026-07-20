import { ArrowRight, BookOpen, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_BOOKS } from "@/components/store/store-mock-data";

export function BookstoreShowcase() {
  // Select top 3 books to feature in the interactive stack
  const featuredBooks = MOCK_BOOKS.slice(0, 3);

  return (
    <section className="py-16 relative overflow-hidden bg-white border-y border-border">
      {/* Background aesthetic blobs matching light theme */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--mint)]/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />

      <div className="container-academic relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Content Pane */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span>ADF Publications</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--ink)] leading-tight mb-6 tracking-tight">
              Discover Knowledge That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--mint)]">Shapes the Future</span>
            </h2>
            
            <p className="text-lg text-[var(--ink-soft)] mb-10 leading-relaxed">
              Explore our curated collection of premium academic and literary publications. Bridging the gap between scholarly research and captivating literature.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/bookstore" 
                className="btn-primary shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5" />
                Explore Bookstore
              </Link>
              <Link 
                to="/bookstore/search?sort=bestsellers" 
                className="btn-outline hover:-translate-y-1"
              >
                Editor's Picks
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            

          </div>

          {/* Right Interactive Pane - Pseudo 3D Book Stack */}
          <div className="relative h-[480px] flex items-center justify-center lg:justify-end perspective-[2000px]">
            <div className="relative w-full max-w-[360px] h-[450px] transform-style-3d group">
              
              {featuredBooks.map((book, index) => {
                // Calculate dynamic positioning and rotation for the stack
                const zIndex = 30 - index * 10;
                const translateY = index * 30; // pixels down
                const translateZ = index * -60; // pixels back
                const rotateX = 15;
                const rotateY = -15 + index * 5; // slight twist per book
                
                return (
                  <div 
                    key={book.id}
                    className="absolute top-0 left-0 right-0 m-auto w-[260px] h-[380px] rounded-lg shadow-2xl transition-all duration-700 ease-out origin-bottom bg-white"
                    style={{
                      zIndex,
                      transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                      boxShadow: index === 0 ? "25px 25px 50px -12px rgba(7,26,140,0.25)" : "15px 15px 35px -10px rgba(7,26,140,0.15)",
                    }}
                  >
                    {/* Hover effect styling */}
                    <Link to={`/bookstore`} className="block w-full h-full relative group/book">
                      {/* Book Cover */}
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded-lg border border-slate-200 group-hover/book:border-[var(--primary)] transition-colors"
                      />
                      
                      {/* Interactive overlay on hover - updated for light theme feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/40 to-transparent opacity-0 group-hover/book:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-6">
                        <div className="translate-y-4 group-hover/book:translate-y-0 transition-transform duration-300">
                          <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{book.title}</h4>
                          <p className="text-slate-200 text-sm mb-3 line-clamp-1">{book.author}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--mint)] font-bold">₹{book.price}</span>
                            <div className="flex items-center text-yellow-400 text-sm font-medium">
                              <Star className="w-4 h-4 fill-current mr-1" />
                              {book.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
              
              {/* Floating decorative elements matching light theme */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-10 -left-10 w-32 h-32 bg-[var(--mint)]/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Custom CSS for 3D perspective since Tailwind doesn't have it built-in natively */}
            <style dangerouslySetInnerHTML={{__html: `
              .perspective-\\[2000px\\] {
                perspective: 2000px;
              }
              .transform-style-3d {
                transform-style: preserve-3d;
              }
              /* Interactive stack effect */
              .group:hover > div:nth-child(1) {
                transform: translateY(-20px) translateZ(50px) rotateX(5deg) rotateY(-5deg) !important;
              }
              .group:hover > div:nth-child(2) {
                transform: translateY(20px) translateZ(-30px) rotateX(10deg) rotateY(-10deg) !important;
              }
              .group:hover > div:nth-child(3) {
                transform: translateY(60px) translateZ(-110px) rotateX(15deg) rotateY(-15deg) !important;
              }
            `}} />
          </div>
        </div>
      </div>
    </section>
  );
}
