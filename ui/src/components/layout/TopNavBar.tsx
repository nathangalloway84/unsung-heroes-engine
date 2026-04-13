"use client";

import React from "react";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";

interface TopNavBarProps {
  activeSport?: string;
  toggleMenu: () => void;
}

export default function TopNavBar({ activeSport, toggleMenu }: TopNavBarProps) {
  const { activeArchetype, isLoading } = useTelemetryCache();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex justify-between items-center px-4 md:px-8 h-16 bg-[#0b1326]/60 backdrop-blur-md border-b border-[#514532] transition-all">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={toggleMenu}
          className="lg:hidden text-[#ffba20] p-1 flex items-center justify-center border border-outline-variant/30 bg-surface-container rounded-sm"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col hidden sm:flex">
          <span className="font-mono-data text-[10px] text-slate-500 tracking-tighter uppercase">Subject_Focus</span>
          <span className="text-[#ffba20] font-headline text-lg uppercase tracking-tight">{activeSport ? activeSport : "OVERVIEW"}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:gap-4 bg-surface-container-lowest px-2 py-1 md:px-4 md:py-2 border-b border-secondary-container">
          <span className="font-headline text-[#ffba20] text-[10px] md:text-xs font-black tracking-widest uppercase truncate max-w-[120px] md:max-w-xs">{activeArchetype}</span>
          <span className={`material-symbols-outlined text-[#ffba20] text-sm md:text-lg ${isLoading ? 'animate-pulse' : ''}`}>terminal</span>
        </div>
      </div>
    </header>
  );
}
