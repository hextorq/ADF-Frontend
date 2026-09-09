import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterUrl: string;
  title: string;
}

export function PosterModal({ isOpen, onClose, posterUrl, title }: PosterModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      setZoom(1);
      setIsFullscreen(false);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} - Official Campaign Poster`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "max-w-4xl w-full max-h-[94vh]"
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur text-white z-20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-semibold truncate text-slate-200">
              {title} — Official Call Poster
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono text-slate-400 w-10 text-center select-none hidden sm:inline-block">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0 hidden sm:inline-flex"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <a
              href={posterUrl}
              download="ADF-Art-Dreams-Fusion-Volume-I-Poster.jpg"
              className="inline-flex items-center justify-center rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 h-8 px-2 sm:px-2.5 transition-colors gap-1.5"
              title="Download Original Poster"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-rose-900/50 hover:text-rose-200 h-8 w-8 p-0 ml-1 rounded-full"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable / Zoomable Image Stage */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/60 select-none cursor-grab active:cursor-grabbing">
          <div
            className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={posterUrl}
              alt={title}
              className="max-h-[82vh] w-auto object-contain rounded-lg shadow-2xl border border-slate-800/80 pointer-events-auto"
              draggable={false}
            />
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Promotional Call · Academic Development Forum (ADF)</span>
          <span className="hidden sm:inline">Click backdrop or press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
