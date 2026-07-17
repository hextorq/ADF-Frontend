import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";

export default function BookSearch() {
  const [searchParams] = useSearchParams();
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
    <div className="bg-slate-50 min-h-screen py-12">
      {quickViewBook && (
        <QuickViewModal isOpen={true} book={quickViewBook} onClose={() => setQuickViewBook(null)} />
      )}
      
      <div className="container-academic">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-bold text-[var(--ink)] mb-4">Browse Books</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our extensive catalog of academic research, literary fiction, poetry, and educational resources.
          </p>
        </div>

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
                      "text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all group flex justify-between items-center",
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
            
            {/* Additional filters (mock UI) */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
               <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-4">Price Range</h3>
               <div className="space-y-4">
                 <input type="range" className="w-full accent-[var(--primary)]" min="0" max="2000" />
                 <div className="flex justify-between text-sm text-gray-500 font-medium">
                   <span>₹0</span>
                   <span>₹2000+</span>
                 </div>
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
                  className="mt-8 bg-[var(--primary)] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
