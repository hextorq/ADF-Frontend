import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { type Book } from "./store-mock-data";
import { ShoppingCart, Star, Heart, X, BookOpen, Clock, Globe, Fingerprint } from "lucide-react";
import { toast } from "sonner";

interface QuickViewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ book, isOpen, onClose }: QuickViewModalProps) {
  if (!book) return null;

  const handleAddToCart = () => {
    toast.success(`${book.title} added to cart`);
    onClose();
  };

  const handleWishlist = () => {
    toast.success(`Added to wishlist`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        <div className="grid md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Image Side */}
          <div className="bg-slate-50 p-8 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent"></div>
            
            {book.badge && (
              <div className="absolute top-6 left-6 z-20">
                <div className="text-xs font-bold px-3 py-1 text-white shadow-md uppercase tracking-wider rounded-r-full bg-[var(--primary)]">
                  {book.badge}
                </div>
              </div>
            )}
            
            <div className="relative z-10 w-full max-w-sm aspect-[3/4] shadow-2xl rounded-r-lg rounded-l-sm overflow-hidden transform hover:scale-105 transition-transform duration-500">
              {/* Spine Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-20 pointer-events-none"></div>
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content Side */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-md uppercase tracking-wide">
                {book.genre}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                {book.rating} <span className="text-gray-400 font-normal">({book.reviewCount} Reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-[var(--ink)] leading-tight mb-2">
              {book.title}
            </h2>
            <p className="text-lg text-[var(--ink-soft)] mb-6">
              By <span className="font-semibold">{book.author}</span>
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[var(--ink)]">₹{book.price}</span>
                {book.originalPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1">₹{book.originalPrice}</span>
                )}
              </div>
              {book.discount && (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  Save {book.discount}%
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
              {book.description}
            </p>

            {/* Book Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Fingerprint className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900">{book.isbn}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span>{book.pages} Pages</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Globe className="h-4 w-4 text-gray-400" />
                <span>{book.language}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{new Date(book.publicationDate).getFullYear()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[var(--primary)] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleWishlist}
                className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors"
                aria-label="Add to Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              {book.stockStatus} - Ships within 24 hours
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
