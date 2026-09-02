import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/store/BookCard";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { PageHeader } from "@/components/site/PageHeader";
import { MOCK_BOOKS, CATEGORIES, type Book } from "@/components/store/store-mock-data";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";

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

  const searchTitle = searchQuery 
    ? `Search: "${searchQuery}" | ADF Bookstore` 
    : "Search Bookstore Catalog | ADF";

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SEO
        title={searchTitle}
        description="Search across ADF's published books, edited volumes, author monographs, and academic series."
        noindex={true}
        nofollow={false}
      />
      {quickViewBook && (
        <QuickViewModal isOpen={true} book={quickViewBook} onClose={() => setQuickViewBook(null)} />
      )}
      
      <PageHeader
        cmsKey="page.bookstore.search"
        eyebrow="Browse Catalog"
        title="Browse Books"
        description="Explore our extensive catalog of academic research, literary fiction, poetry, and educational resources."
        crumbs={[{ label: "Book Store", to: "/bookstore" }, { label: "Search" }]}
      />

      <div className="container-academic mt-12">
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

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-border shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                {searchQuery ? `Results for "${searchQuery}"` : activeCategory}
              </h2>
              <span className="text-sm font-medium text-slate-500">
                Showing {filteredBooks.length} results
              </span>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-border shadow-sm">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-[var(--ink)] mb-2">No books found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn't find any books matching your criteria. Try adjusting your search query or category filter.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All Books"); }}
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onQuickView={(b) => setQuickViewBook(b)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
