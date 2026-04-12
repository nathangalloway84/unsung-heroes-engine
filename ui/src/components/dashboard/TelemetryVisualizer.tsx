import React from "react";

interface TelemetryVisualizerProps {
  hiddenGrind: string;
  loading: boolean;
}

export default function TelemetryVisualizer({ hiddenGrind, loading }: TelemetryVisualizerProps) {
  return (
    <div className="grid grid-cols-12 gap-8 mb-8">
      {/* Narrative Block */}
      <section className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-surface-container-low p-8 relative shadow-lg">
          <div className="absolute top-4 right-4 font-mono-data text-[10px] text-slate-600 bg-surface-container-lowest px-2 py-1 uppercase tracking-widest border border-outline-variant/30">Dossier: HG_01</div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter mb-6 text-on-surface border-l-4 border-[#ffba20] pl-4">Hidden Grind</h2>
          <div className="space-y-4 text-on-surface-variant font-body leading-relaxed text-sm">
            <p className={`${loading ? 'animate-pulse opacity-50' : 'opacity-100'} transition-opacity`}>
              {hiddenGrind}
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Visualization Interface */}
      <section className="col-span-12 lg:col-span-7">
        <div className="h-full min-h-[450px] bg-surface-container-lowest relative flex flex-col border border-outline-variant/10 overflow-hidden shadow-lg">
          <div className="flex justify-between items-center bg-surface-container-high px-4 py-2">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-error rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-[#ffba20] rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-secondary rounded-full opacity-50"></div>
            </div>
            <span className="font-mono-data text-[10px] text-slate-400 font-bold">DATA_VIZ_FEED_LIVE // AUTH_REQ</span>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center items-center relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#514532 1px, transparent 1px), linear-gradient(90deg, #514532 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="mt-12 text-center z-10 w-full max-w-md">
              <div className="bg-surface-container-high px-6 py-6 border border-amber-500/30 flex flex-col items-center shadow-xl">
                <span className={`material-symbols-outlined text-5xl text-[#ffba20] block mb-4 ${loading ? 'animate-spin' : ''}`}>analytics</span>
                <p className="font-mono-data text-xs text-[#ffba20] uppercase tracking-widest font-bold">
                  {loading ? 'Processing Bio-Mechanical Anomalies...' : 'Awaiting Input Command'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
