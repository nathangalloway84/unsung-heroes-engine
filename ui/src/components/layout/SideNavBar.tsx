"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPORTS_CONFIG } from "@/config/sports";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";

interface SideNavBarProps {
  activeSector: string;
  activeSport: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function SideNavBar({ activeSector, activeSport, isOpen, setIsOpen }: SideNavBarProps) {
  const router = useRouter();
  const { 
    latency, 
    isCompareMode, setIsCompareMode, 
    compareSportA, setCompareSportA, 
    compareSportB, setCompareSportB 
  } = useTelemetryCache();
  
  const sportsList = SPORTS_CONFIG[activeSector] || SPORTS_CONFIG["paralympics"];

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSector = e.target.value;
    router.push(`/${newSector}`);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full flex flex-col py-6 w-64 bg-slate-950 dark:bg-[#0b1326] border-r border-[#514532] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div className="px-6 mb-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-black uppercase tracking-tighter text-[#ffba20] font-headline">UNSUNG HEROES</h1>
            </Link>
            <button className="lg:hidden text-slate-400" onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex flex-col">
            <label className="font-mono-data text-[10px] text-slate-500 tracking-widest mb-1">SECTOR FEED:</label>
            <select 
              value={activeSector} 
              onChange={handleSectorChange}
              className="bg-surface-container-low border border-outline-variant/30 text-xs font-mono-data uppercase p-2 text-on-surface focus:outline-none focus:border-[#ffba20] w-full"
            >
              <option value="paralympics">PARALYMPICS</option>
              <option value="olympics">OLYMPICS</option>
            </select>
          </div>
          
          <div className="flex flex-col mt-4">
             <button 
                onClick={() => {
                   setIsCompareMode(!isCompareMode);
                   setCompareSportA("");
                   setCompareSportB("");
                   if (isCompareMode) router.push(`/${activeSector}`);
                }}
                className={`font-mono-data text-[10px] tracking-widest uppercase p-2 border transition-all ${isCompareMode ? 'bg-[#ffba20] text-black border-[#ffba20]' : 'bg-transparent text-slate-500 border-outline-variant/30 hover:text-[#ffba20]'}`}
             >
                [TOGGLE COMPARE MODE]
             </button>
             {isCompareMode && (
                <div className="mt-2 text-[8px] font-mono-data tracking-widest text-[#96ccff]">
                   A: {compareSportA || 'PENDING'} | B: {compareSportB || 'PENDING'}
                </div>
             )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
          {sportsList.map((sport) => {
            const isActive = activeSport === sport.id || (isCompareMode && (compareSportA === sport.id || compareSportB === sport.id));
            
            const handleSportClick = (e: React.MouseEvent) => {
              if (isCompareMode) {
                 e.preventDefault();
                 if (!compareSportA) {
                    setCompareSportA(sport.id);
                 } else if (!compareSportB && sport.id !== compareSportA) {
                    setCompareSportB(sport.id);
                    setIsOpen(false);
                    router.push(`/compare?sportA=${compareSportA}&sportB=${sport.id}`);
                 } else {
                    setCompareSportA(sport.id);
                    setCompareSportB("");
                 }
              } else {
                 setIsOpen(false);
              }
            };

            return (
              <Link 
                key={sport.id}
                href={`/${activeSector}/${sport.id}`}
                onClick={handleSportClick}
                className={`w-full text-left group flex items-center px-6 py-3 transition-all duration-100 font-bold border-l-2 ${isActive ? 'border-[#ffba20] bg-[#131b2e] text-[#ffba20]' : 'border-transparent text-slate-400 hover:text-[#ffba20] hover:bg-[#131b2e]/50'}`}
              >
                <span className="material-symbols-outlined mr-4">{sport.icon}</span>
                <span className="font-headline tracking-tighter uppercase">{sport.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto px-6 space-y-4">
          <div className="flex justify-center p-3 bg-surface-container-lowest border border-outline-variant/10 w-full text-center">
            <p className="font-mono-data text-[10px] text-slate-500 uppercase">GEMINI_ENGINE // LATENCY: {latency || "STANDBY"}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
