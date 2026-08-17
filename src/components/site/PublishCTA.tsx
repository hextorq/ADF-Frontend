import { ArrowRight, BookOpen, PenTool, Globe, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { EditableText } from "@/components/cms/EditableText";
import { useEffect, useState } from "react";

export default function PublishCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--deep)] text-white border-y border-[var(--primary)]/20">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)]/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--mint)]/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 mix-blend-screen pointer-events-none" />

      {/* Animated subtle grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="container-academic relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Content Pane */}
          <div className={`max-w-xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[var(--mint)] text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>Author Journey</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Publish Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mint)] to-blue-400">First Book</span> With ADF
            </h2>
            
            <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-md">
              Transform your manuscript into a globally recognized publication. We provide end-to-end editorial support, stunning designs, and international distribution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/literary-publications/submit" 
                className="inline-flex items-center justify-center gap-2 bg-[var(--mint)] text-[var(--deep)] hover:bg-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-[0_0_30px_rgba(46,204,113,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1"
              >
                <PenTool className="w-5 h-5" />
                Submit Manuscript
              </Link>
              <Link 
                to="/guidelines/author" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-md"
              >
                Read Guidelines
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Interactive/Visual Pane */}
          <div className={`relative h-[500px] flex items-center justify-center lg:justify-end transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative w-full max-w-[400px] aspect-[3/4] group perspective-[1000px]">
              
              {/* Glowing Book Mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-8 transform transition-transform duration-700 ease-out group-hover:rotate-y-12 group-hover:scale-105 preserve-3d">
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--mint)] flex items-center justify-center shadow-lg mb-8 animate-pulse-slow">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                
                <div className="w-3/4 h-3 bg-white/20 rounded-full mb-4"></div>
                <div className="w-1/2 h-3 bg-white/20 rounded-full mb-8"></div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-auto">
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <Globe className="w-6 h-6 text-blue-300 mb-2" />
                    <span className="text-xs font-medium text-white/80">Global ISBN</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <Award className="w-6 h-6 text-yellow-300 mb-2" />
                    <span className="text-xs font-medium text-white/80">Peer Reviewed</span>
                  </div>
                </div>

              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-bounce-slow" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[var(--mint)]/30 rounded-full blur-xl animate-bounce-slow" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Custom perspective utility */}
            <style dangerouslySetInnerHTML={{__html: `
              .perspective-\\[1000px\\] { perspective: 1000px; }
              .preserve-3d { transform-style: preserve-3d; }
              .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
              .animate-bounce-slow { animation: bounce 6s infinite; }
              .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}} />
          </div>
        </div>
      </div>
    </section>
  );
}
