import { Youtube, ExternalLink, PlayCircle } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import { useContentStore } from "@/store/useContentStore";
import { useAuthStore } from "@/store/useAuthStore";

export function FeaturedVideo() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  // Client: Paste your latest YouTube video ID here. 
  // For example, if your video URL is https://www.youtube.com/watch?v=abc123xyz, the ID is "abc123xyz".
  const LATEST_VIDEO_ID = "FSzhc4Q30Hw"; // The client's latest video ID
  const videoId = useContentStore((s) => s.getContent("home.video.youtubeId", LATEST_VIDEO_ID));

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-[var(--secondary)] rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-[var(--mint)] rounded-full blur-3xl opacity-10 pointer-events-none" />

      <div className="container-academic relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="max-w-xl">
            <div className="eyebrow flex items-center gap-2 mb-4">
              <Youtube className="h-5 w-5 text-red-600" />
              <EditableText contentKey="home.video.eyebrow" fallback="ADF PUBLISHER CHANNEL" as="span" className="text-red-600" label="Video eyebrow" />
            </div>
            <EditableText
              contentKey="home.video.title"
              fallback="Learn with ADF"
              as="h2"
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--ink)] leading-tight mb-6"
              label="Video title"
            />
            <EditableText
              contentKey="home.video.description"
              fallback="Watch tutorials, publishing guidelines, webinars, author interviews, and research insights from the Academic Development Forum YouTube Channel."
              as="p"
              multiline
              className="text-lg text-[var(--ink-soft)] leading-relaxed mb-8"
              label="Video description"
            />
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="https://www.youtube.com/@adf_publisher?sub_confirmation=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3.5 rounded-lg font-semibold shadow-sm hover:bg-red-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                Subscribe Now
              </a>
              <a 
                href="https://www.youtube.com/@adf_publisher/videos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[var(--ink)] border border-border px-6 py-3.5 rounded-lg font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
              >
                View All Videos
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            
            {/* Quick feature list */}
            <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
                <PlayCircle className="h-5 w-5 text-[var(--primary)] shrink-0" />
                <EditableText contentKey="home.video.feature.1" fallback="Step-by-step submission guides" as="span" label="Video feature" />
              </div>
              <div className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
                <PlayCircle className="h-5 w-5 text-[var(--primary)] shrink-0" />
                <EditableText contentKey="home.video.feature.2" fallback="Expert webinar recordings" as="span" label="Video feature" />
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Video */}
          <div className="relative group perspective">
            <div className="absolute -inset-2 bg-gradient-to-r from-[var(--primary)] to-[var(--mint)] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white bg-white p-2">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="ADF Publisher YouTube Channel" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              {isAdmin && (
                <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <EditableText contentKey="home.video.youtubeId" fallback={LATEST_VIDEO_ID} as="span" label="YouTube video ID" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

