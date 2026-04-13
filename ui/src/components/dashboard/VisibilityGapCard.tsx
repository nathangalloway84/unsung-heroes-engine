import React from "react";

interface VisibilityGapCardProps {
  activeSport?: string;
  visibilityGapInsight: string;
  loading: boolean;
}

export default function VisibilityGapCard({ activeSport, visibilityGapInsight, loading }: VisibilityGapCardProps) {
  const displaySport = activeSport ? activeSport.charAt(0).toUpperCase() + activeSport.slice(1) : "monitored";

  return (
    <section className="mb-8">
      <div className="bg-surface-container-low relative border-l-8 border-[#ffba20] electric-glow overflow-hidden shadow-2xl">
        <div className="p-10 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono-data text-[10px] bg-[#ffba20] text-black px-3 py-1 font-black uppercase tracking-tighter">System Critical</span>
            </div>
            <h2 className="font-headline text-5xl font-black uppercase tracking-tighter text-on-surface mb-6">Visibility Gap</h2>
            
            {/* CSS ANIMATION IMPLEMENTED EXPLICITLY HERE VIA TAILWIND V4 RAW CONFIG */}
            <div className={`max-w-2xl text-on-surface-variant font-body leading-relaxed text-base border-l-2 border-outline-variant/30 pl-4 ${loading ? 'animate-pulse opacity-50' : 'animate-fade-pulse opacity-100'}`}>
              <p>{visibilityGapInsight}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
