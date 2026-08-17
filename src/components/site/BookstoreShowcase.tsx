import { ArrowRight, BookOpen, Sparkles, Star, Heart, ShoppingCart, Gift, Globe, Medal, BarChart3, Feather, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_BOOKS } from "@/components/store/store-mock-data";
import { useStoreStore } from "@/store/useStoreStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { EditableText } from "@/components/cms/EditableText";

// Toggle for future when the actual bookstore launches
const SHOW_PRE_PUBLICATION = true;

export function BookstoreShowcase() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  
  // Get book IDs from CMS, fallback to 1, 2, 3
  const book1Id = useContentStore((s) => s.getContent("home.bookstore.featured.1", "1"));
  const book2Id = useContentStore((s) => s.getContent("home.bookstore.featured.2", "2"));
  const book3Id = useContentStore((s) => s.getContent("home.bookstore.featured.3", "3"));
  
  const { addToCart, toggleWishlist, isInWishlist } = useStoreStore();

  // Select the 3 books to feature (for old UI)
  const featuredBooks = [
    MOCK_BOOKS.find((b) => b.id === book1Id) || MOCK_BOOKS[0],
    MOCK_BOOKS.find((b) => b.id === book2Id) || MOCK_BOOKS[1],
    MOCK_BOOKS.find((b) => b.id === book3Id) || MOCK_BOOKS[2],
  ];

  if (SHOW_PRE_PUBLICATION) {
    return (
      <section className="py-20 relative overflow-hidden bg-slate-50/50 border-y border-slate-200/60 font-sans">
        <div className="container-academic relative z-10 max-w-7xl mx-auto px-4">
          <div className="bg-[#f4f7fc] rounded-[32px] p-8 md:p-12 lg:p-16 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
              <div className="absolute bottom-[0%] right-[30%] w-[400px] h-[400px] bg-white/60 rounded-full blur-[80px]" />
              {/* Dot grid pattern (simplified) */}
              <div className="absolute top-10 right-[40%] w-32 h-32 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e3a8a 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
            </div>

            <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-8 items-center relative z-10">
              
              {/* Left Content */}
              <div className="max-w-2xl">
                {/* Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-blue-800 text-xs font-bold tracking-wide uppercase border border-blue-100 shadow-sm mb-8">
                  <Feather className="w-3.5 h-3.5 text-blue-600" />
                  <span>ADF Publishing</span>
                </div>
                
                {/* Title */}
                <h2 className="text-[40px] md:text-[52px] lg:text-[64px] font-serif font-bold text-[#0f172a] leading-[1.1] mb-6">
                  Publish Your <br/>
                  <span className="text-[#1e3a8a]">First Book</span> <span className="font-[cursive] text-yellow-500 font-normal text-5xl md:text-6xl -ml-2 italic relative -top-2">with</span> <span className="text-[#1e3a8a]">ADF</span>
                </h2>
                
                {/* Description */}
                <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
                  ADF helps authors turn their ideas into impactful books and reach readers around the world.
                </p>

                {/* Info Banner */}
                <div className="flex items-center gap-4 bg-[#eff4fa] border border-blue-100/50 p-4 rounded-2xl mb-10 max-w-xl">
                  <div className="w-12 h-12 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Gift className="w-6 h-6" />
                  </div>
                  <p className="text-[15px] text-slate-700 leading-snug">
                    Be one of our <strong className="text-blue-800">founding authors</strong> and <br className="hidden sm:block" />get featured in our upcoming bookstore.
                  </p>
                </div>
                
                {/* Features Row */}
                <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 mb-10">
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-700 flex items-center justify-center"><Feather className="w-4 h-4"/></div>
                      <span className="font-bold text-sm text-slate-900 leading-tight">Expert<br/>Guidance</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">End-to-end support for authors</p>
                  </div>
                  <div className="w-px bg-slate-200/60 hidden md:block" />
                  
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-700 flex items-center justify-center"><Globe className="w-4 h-4"/></div>
                      <span className="font-bold text-sm text-slate-900 leading-tight">Global<br/>Visibility</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Reach readers worldwide</p>
                  </div>
                  <div className="w-px bg-slate-200/60 hidden md:block" />
                  
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-700 flex items-center justify-center"><Medal className="w-4 h-4"/></div>
                      <span className="font-bold text-sm text-slate-900 leading-tight">Quality<br/>Publishing</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Professional editing & publishing</p>
                  </div>
                  <div className="w-px bg-slate-200/60 hidden md:block" />
                  
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-700 flex items-center justify-center"><BarChart3 className="w-4 h-4"/></div>
                      <span className="font-bold text-sm text-slate-900 leading-tight">Higher<br/>Impact</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Build your brand as an author</p>
                  </div>
                </div>

                {/* Buttons & Bottom Info */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                  <div className="flex gap-4">
                    <Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b2169] px-6 text-[15px] font-bold text-white transition hover:bg-blue-900 shadow-lg shadow-blue-900/20 whitespace-nowrap">
                      Publish Your First Book
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/guidelines/author" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-[15px] font-bold text-slate-700 transition hover:bg-slate-50 whitespace-nowrap">
                      Learn More
                    </Link>
                  </div>
                  
                  <div className="bg-white border border-slate-200/60 p-4 rounded-2xl flex items-start gap-4 max-w-sm shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-[#eff4fa] text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      We are currently accepting manuscripts for our upcoming collection. Don't miss your chance to be part of the <strong className="text-blue-800">ADF author community!</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Interactive Pane - Pseudo 3D Book Stack */}
              <div className="relative h-[500px] flex items-center justify-center perspective-[2000px] mt-10 lg:mt-0">
                <div className="relative w-full max-w-[400px] h-[450px] transform-style-3d group">
                  
                  {/* The Pedestal Base */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-white rounded-[100%] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-b-8 border-slate-100 z-0"></div>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] h-24 bg-slate-50 rounded-[100%] border border-white z-0"></div>

                  {/* Left Book (White) */}
                  <div 
                    className="absolute top-10 left-0 w-[200px] h-[300px] rounded-r-lg rounded-l-sm shadow-xl transition-all duration-700 ease-out origin-center bg-[#f8f9fa] border-l-[12px] border-[#e2e8f0] flex flex-col items-center justify-center p-6 text-center"
                    style={{ zIndex: 10, transform: `translateX(-70px) translateY(30px) rotateZ(-10deg) rotateY(-20deg)` }}
                  >
                    <BookOpen className="w-8 h-8 text-slate-400 mb-2" />
                    <div className="text-xs font-bold tracking-widest text-slate-500 mb-6">ADF</div>
                    <div className="text-sm font-bold text-slate-700 leading-relaxed tracking-wider">SHARE<br/>YOUR IDEAS<br/><span className="text-slate-400">SHAPE<br/>TOMORROW</span></div>
                    <Feather className="w-10 h-10 text-slate-300 absolute bottom-6 right-6 opacity-50" />
                  </div>

                  {/* Right Book (Green) */}
                  <div 
                    className="absolute top-10 right-0 w-[200px] h-[300px] rounded-r-lg rounded-l-sm shadow-xl transition-all duration-700 ease-out origin-center bg-[#1b4332] border-l-[12px] border-[#081c15] flex flex-col items-center justify-center p-6 text-center"
                    style={{ zIndex: 10, transform: `translateX(70px) translateY(30px) rotateZ(10deg) rotateY(20deg)` }}
                  >
                    <BookOpen className="w-8 h-8 text-emerald-400/70 mb-2" />
                    <div className="text-xs font-bold tracking-widest text-emerald-200 mb-6">ADF</div>
                    <div className="text-sm font-bold text-white/90 leading-relaxed tracking-wider">KNOWLEDGE<br/>TODAY<br/><span className="text-emerald-400">IMPACT<br/>FOREVER</span></div>
                    {/* Simple tree/leaf decor */}
                    <div className="absolute bottom-6 w-16 h-16 border-t-2 border-emerald-500/30 rounded-t-full"></div>
                  </div>

                  {/* Center Book (Navy) */}
                  <div 
                    className="absolute top-0 left-0 right-0 m-auto w-[240px] h-[350px] rounded-r-xl rounded-l-sm shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)] transition-all duration-700 ease-out origin-center bg-[#0f172a] border-l-[16px] border-[#020617] border-y border-r border-[#1e293b] flex flex-col items-center justify-center p-8 text-center"
                    style={{ zIndex: 30, transform: `translateY(-10px)` }}
                  >
                    {/* Gold accents */}
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-blue-900/50 rounded-r-lg pointer-events-none"></div>
                    
                    <BookOpen className="w-10 h-10 text-yellow-500 mb-2" />
                    <div className="text-sm font-bold tracking-widest text-white mb-8">ADF</div>
                    <div className="text-2xl font-serif text-white leading-tight mb-2">YOUR <br/><span className="text-yellow-500">BOOK</span></div>
                    <div className="text-lg font-serif text-white/90 mb-8">COULD BE<br/>NEXT</div>
                    
                    <div className="w-12 h-px bg-yellow-500/50 relative mb-8">
                      <Star className="w-4 h-4 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current" />
                    </div>

                    <div className="text-xs text-blue-200/70 italic">Let your story<br/>inspire the world.</div>

                    {/* Yellow Sticker */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#fcd34d] rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-white rotate-12 z-40 transform hover:scale-105 transition-transform cursor-pointer">
                      <div className="text-sm font-bold text-amber-900 leading-tight text-center">SUBMIT<br/>TODAY!</div>
                      <Star className="w-3 h-3 text-amber-900 mt-1 fill-current" />
                      {/* Decorative lines around sticker */}
                      <div className="absolute -top-3 left-1/2 w-1 h-3 bg-yellow-400 rounded-full rotate-12"></div>
                      <div className="absolute top-2 -right-2 w-3 h-1 bg-yellow-400 rounded-full -rotate-12"></div>
                    </div>
                  </div>

                </div>
                
                <style dangerouslySetInnerHTML={{__html: `
                  .perspective-\\[2000px\\] { perspective: 2000px; }
                  .transform-style-3d { transform-style: preserve-3d; }
                `}} />
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- OLD LOOK BELOW ---
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
                className="btn-primary shadow-lg shadow-[var(--primary)]/20"
              >
                <BookOpen className="w-5 h-5" />
                Explore Bookstore
              </Link>
              <Link 
                to="/bookstore/search?sort=bestsellers" 
                className="btn-outline"
              >
                Editor's Picks
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {isAdmin && (
              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Featured Books (Admin)</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-medium">Book 1:</span>
                    <EditableText contentKey="home.bookstore.featured.1" fallback="1" as="span" label="Book 1 ID" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-medium">Book 2:</span>
                    <EditableText contentKey="home.bookstore.featured.2" fallback="2" as="span" label="Book 2 ID" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-medium">Book 3:</span>
                    <EditableText contentKey="home.bookstore.featured.3" fallback="3" as="span" label="Book 3 ID" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Interactive Pane - Pseudo 3D Book Stack */}
          <div className="relative h-[480px] flex items-center justify-center lg:justify-end perspective-[2000px]">
            <div className="relative w-full max-w-[360px] h-[450px] transform-style-3d group">
              
              {featuredBooks.map((book, index) => {
                let zIndex = 30;
                let translateX = 0;
                let translateY = 0;
                let rotateZ = 0;
                
                if (index === 0) {
                  zIndex = 30;
                  translateX = 0;
                  translateY = 0;
                  rotateZ = 0;
                } else if (index === 1) {
                  zIndex = 20;
                  translateX = -130;
                  translateY = 30;
                  rotateZ = -12;
                } else if (index === 2) {
                  zIndex = 10;
                  translateX = 130;
                  translateY = 30;
                  rotateZ = 12;
                }
                
                return (
                  <div 
                    key={book.id}
                    className="absolute top-0 left-0 right-0 m-auto w-[260px] h-[380px] rounded-lg shadow-2xl transition-all duration-700 ease-out origin-center bg-white"
                    style={{
                      zIndex,
                      transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg)`,
                      boxShadow: index === 0 ? "0 25px 50px -12px rgba(7,26,140,0.25)" : "0 15px 35px -10px rgba(7,26,140,0.15)",
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
                          <div className="flex items-center justify-between mb-3">
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
            `}} />
          </div>
        </div>
      </div>
    </section>
  );
}
