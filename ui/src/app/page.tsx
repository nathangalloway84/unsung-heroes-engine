"use client";

import React, { useState } from "react";
import SideNavBar from "../components/layout/SideNavBar";
import TopNavBar from "../components/layout/TopNavBar";
import TelemetryVisualizer from "../components/dashboard/TelemetryVisualizer";
import VisibilityGapCard from "../components/dashboard/VisibilityGapCard";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [archetype, setArchetype] = useState("INITIALIZING...");
  const [hiddenGrind, setHiddenGrind] = useState("Awaiting narrative telemetry feed. Please activate a sector.");

  const handleAnalyze = async () => {
    setLoading(true);
    setArchetype("PROCESSING DATA...");
    setHiddenGrind("Scanning bio-mechanical anomalies and archived narrative logs...");
    
    // Auto-close menu on mobile when analyzing
    if(isMobileMenuOpen) setIsMobileMenuOpen(false);

    try {
      const response = await fetch("http://localhost:4000/api/analyze-sport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport: "wrestling" })
      });
      
      const resData = await response.json();
      if (resData.success) {
        setArchetype(resData.data.archetype);
        setHiddenGrind(resData.data.hiddenGrind);
      } else {
        setArchetype("ERROR");
        setHiddenGrind("Failed to parse narrative. Terminal blocked.");
      }
    } catch (err) {
      setArchetype("CONNECTION FAILED");
      setHiddenGrind("The API Proxy connection was severed. Please verify GCP permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideNavBar 
        loading={loading} 
        onAnalyze={handleAnalyze} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />
      <TopNavBar 
        archetype={archetype} 
        loading={loading} 
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant/10 gap-4">
          <div className="flex gap-8">
            <div>
              <span className="font-mono-data text-[10px] text-slate-500 block">ENCRYPTION</span>
              <span className="font-mono-data text-xs text-on-surface">AES-256-LEVEL-ALPHA</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className="font-mono-data text-[10px] text-slate-500 block uppercase">Engine Profile</span>
            <span className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface">UNSUNG HEROES ENGINE v2.04</span>
          </div>
        </div>

        <TelemetryVisualizer hiddenGrind={hiddenGrind} loading={loading} />
        <VisibilityGapCard />
      </main>
    </>
  );
}
