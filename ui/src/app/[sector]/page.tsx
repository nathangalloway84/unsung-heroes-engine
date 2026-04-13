"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function SectorSplash() {
  const params = useParams();
  const sector = params.sector as string;
  
  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col justify-center items-center min-h-[80vh]">
      <div className="bg-surface-container-low p-12 lg:p-16 border border-outline-variant/30 text-center max-w-2xl shadow-2xl relative overflow-hidden group w-full">
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[300px]">explore</span>
         </div>
        <div className="relative z-10 w-full">
          <h1 className="font-headline text-5xl font-black uppercase text-[#ffba20] mb-6 tracking-tighter text-center">{sector} SECTOR</h1>
          <h2 className="font-mono-data text-sm uppercase tracking-widest text-slate-500 mb-8 border-b border-outline-variant/30 pb-4 text-center">Awaiting Dossier Selection</h2>
          <p className="font-body text-base text-[#d5c4ab] leading-relaxed mx-auto max-w-md text-center">
             Select a specific discipline from the tracking array to initialize the ingestion pipeline and synthesize deep parity vectors safely over current upstream limitations.
          </p>
        </div>
      </div>
    </main>
  );
}
