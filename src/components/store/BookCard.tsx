import { useState } from "react";
import { Heart, Star, ShoppingCart, Eye, BookOpen } from "lucide-react";
import { type Book } from "./store-mock-data";
import { cn } from "@/lib/utils";
import { useStoreStore } from "@/store/useStoreStore";

interface BookCardProps {
  book: Book;
  onQuickView: (book: Book) => void;
}

export function BookCard({ book, onQuickView }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useStoreStore();

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleWishlist = () => {
    toggleWishlist(book);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-border shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[var(--primary)] hover:-translate-y-2 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Ribbon */}
      {book.badge && (
        <div className="absolute top-4 left-0 z-20">
          <div className={cn(
            "text-xs font-bold px-3 py-1 text-white shadow-md uppercase tracking-wider rounded-r-full",
            book.badge === "BESTSELLER" ? "bg-amber-500" :
            book.badge === "NEW" ? "bg-green-500" :
            book.badge === "HOT" ? "bg-red-500" :
            "bg-[var(--primary)]"
          )}>
            {book.badge}
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleWishlist();
        }}
        className={cn("absolute top-4 right-4 z-50 h-8 w-8 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-colors cursor-pointer", isInWishlist(book.id) ? "bg-white text-red-500" : "bg-white/90 text-gray-500 hover:text-red-500")}
        aria-label="Add to wishlist"
      >
        <Heart className={cn("h-4 w-4", isInWishlist(book.id) ? "fill-current" : "")} />
      </button>

      {/* Book Cover Area */}
      <div className="relative aspect-[3/4] w-full bg-slate-50 overflow-hidden p-6 flex items-center justify-center">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
        
        {/* Book 3D effect */}
        <div className="relative w-[70%] h-full max-h-[250px] shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-y-12 perspective-1000">
          {/* Book Spine Simulation */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent -ml-3 transform -skew-y-12 origin-right group-hover:bg-gradient-to-r group-hover:from-black/40 group-hover:to-black/5 transition-all duration-500 z-0 hidden sm:block"></div>
          
          {/* Cover Image */}
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover rounded-r-md rounded-l-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1)] relative z-10"
          />
        </div>

        {/* Hover Actions (Preview button fades in) */}
        <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(book);
            }}
            className="bg-white/95 text-[var(--ink)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 hover:bg-[var(--primary)] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer pointer-events-auto"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded uppercase tracking-wide">
            {book.genre}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            {book.rating} <span className="text-gray-400 font-normal">({book.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-[var(--ink)] leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-[var(--ink-soft)] mb-3">By {book.author}</p>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {book.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--ink)]">₹{book.price}</span>
              {book.originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{book.originalPrice}</span>
              )}
            </div>
            {book.discount && (
              <span className="text-xs text-green-600 font-semibold">{book.discount}% OFF</span>
            )}
          </div>
          
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="h-10 w-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors shadow-sm z-50 relative cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
