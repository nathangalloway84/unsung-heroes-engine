"use client";

import React, { useState } from "react";
import SideNavBar from "../components/layout/SideNavBar";
import TopNavBar from "../components/layout/TopNavBar";
import TelemetryVisualizer from "../components/dashboard/TelemetryVisualizer";
import VisibilityGapCard from "../components/dashboard/VisibilityGapCard";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [activeSport, setActiveSport] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [archetype, setArchetype] = useState("MISSION BRIEFING");
  const [hiddenGrind, setHiddenGrind] = useState("The Unsung Heroes Engine is an AI-powered telemetry dashboard designed to illuminate the hidden realities, financial strains, and extreme sacrifices of Team USA's Olympic and Paralympic athletes operating outside the mainstream media spotlight. Select a sector to initialize the data stream.");
  const [telemetryData, setTelemetryData] = useState<any[]>([]);

  const handleAnalyze = async (sport: string) => {
    setActiveSport(sport);
    setLoading(true);
    setArchetype("EXTRACTING RAW FEEDS...");
    setHiddenGrind("Scraping live Team USA context URLs and verifying semantic safety bounds...");
    setTelemetryData([]);
    
    // Auto-close menu on mobile when analyzing
    if(isMobileMenuOpen) setIsMobileMenuOpen(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/analyze-sport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport: sport })
      });
      
      const resData = await response.json();
      if (resData.success) {
        setArchetype(resData.data.archetype);
        setHiddenGrind(resData.data.hiddenGrind);
        setTelemetryData(resData.data.telemetryData || [
          { name: "Synthetic Load (Fallback)", value: 40 },
          { name: "Visibility Block (Fallback)", value: 15 },
          { name: "Financial Strain (Fallback)", value: 85 }
        ]);
      } else {
        setArchetype("CONNECTION ERROR");
        setHiddenGrind(resData.error || "Failed to parse narrative scraping feeds. Terminal blocked.");
      }
    } catch (err) {
      setArchetype("PROXY DEGRADED");
      setHiddenGrind("The API Proxy connection was severed or Google Cloud quota breached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideNavBar 
        loading={loading} 
        activeSport={activeSport}
        onAnalyze={handleAnalyze} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />
      <TopNavBar 
        archetype={archetype} 
        loading={loading}
        activeSport={activeSport} 
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant/10 gap-4">
          <div className="flex gap-8">
            <div>
              <span className="font-mono-data text-[10px] text-slate-500 block">ENCRYPTION</span>
              <span className="font-mono-data text-xs text-on-surface">AES-256-LEVEL-[NLP-SCRAPE]</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className="font-mono-data text-[10px] text-slate-500 block uppercase">Engine Profile</span>
            <span className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface">UNSUNG HEROES ENGINE v3.00</span>
          </div>
        </div>

        <TelemetryVisualizer hiddenGrind={hiddenGrind} loading={loading} telemetryData={telemetryData} />
        <VisibilityGapCard activeSport={activeSport} />
      </main>
    </>
  );
}
