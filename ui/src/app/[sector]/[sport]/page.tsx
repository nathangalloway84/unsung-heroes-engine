"use client";

import React, { useEffect, useState } from "react";
import TelemetryVisualizer from "@/components/dashboard/TelemetryVisualizer";
import VisibilityGapCard from "@/components/dashboard/VisibilityGapCard";
import { useParams } from "next/navigation";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";

export default function SportDashboard() {
  const params = useParams();
  const sport = params.sport as string;
  
  const { cache, setCachePayload, setActiveArchetype, isLoading, setIsLoading } = useTelemetryCache();
  
  const [hiddenGrind, setHiddenGrind] = useState("");
  const [telemetryData, setTelemetryData] = useState<any[]>([]);

  useEffect(() => {
    if (!sport) return;

    if (cache[sport]) {
      setActiveArchetype(cache[sport].archetype);
      setHiddenGrind(cache[sport].hiddenGrind);
      setTelemetryData(cache[sport].telemetryData);
      return;
    }

    let isMounted = true;

    const fetchTelemetry = async () => {
      setIsLoading(true);
      setActiveArchetype("EXTRACTING RAW FEEDS...");
      setHiddenGrind(`Scraping live Team USA context URLs for ${sport.toUpperCase()} and verifying semantic safety bounds...`);
      setTelemetryData([]);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/analyze-sport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sport: sport })
        });
        
        const resData = await response.json();
        
        if (!isMounted) return;

        if (resData.success) {
          const payload = {
            archetype: resData.data.archetype,
            hiddenGrind: resData.data.hiddenGrind,
            telemetryData: resData.data.telemetryData && resData.data.telemetryData.length > 0 ? resData.data.telemetryData : [
              { name: "Synthetic Load (Fallback)", value: 40 },
              { name: "Visibility Block (Fallback)", value: 15 },
              { name: "Financial Strain (Fallback)", value: 85 }
            ]
          };
          
          setActiveArchetype(payload.archetype);
          setHiddenGrind(payload.hiddenGrind);
          setTelemetryData(payload.telemetryData);
          setCachePayload(sport, payload);
          
        } else {
          const payload = {
            archetype: "CONNECTION ERROR",
            hiddenGrind: resData.error || "Failed to parse narrative scraping feeds. Terminal blocked.",
            telemetryData: []
          };
          setActiveArchetype(payload.archetype);
          setHiddenGrind(payload.hiddenGrind);
          setTelemetryData(payload.telemetryData);
          setCachePayload(sport, payload);
        }
      } catch (err) {
        if (!isMounted) return;
        const degradePayload = {
            archetype: "PROXY DEGRADED",
            hiddenGrind: "The API Proxy connection was severed or Google Cloud quota breached.",
            telemetryData: []
        };
        setActiveArchetype(degradePayload.archetype);
        setHiddenGrind(degradePayload.hiddenGrind);
        setTelemetryData(degradePayload.telemetryData);
        setCachePayload(sport, degradePayload);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTelemetry();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sport]);

  return (
    <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant/10 gap-4">
        <div className="flex gap-8">
          <div>
            <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest">Active Model</span>
            <span className="font-mono-data text-xs text-[#ffba20] uppercase font-bold">MODEL: gemini-3-preview</span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest">Ingestion Pipeline</span>
          <span className="font-headline text-sm font-bold uppercase tracking-widest text-[#96ccff]">SOURCE: teamusa.com scraper</span>
        </div>
      </div>

      <TelemetryVisualizer hiddenGrind={hiddenGrind} loading={isLoading} telemetryData={telemetryData} />
      <VisibilityGapCard activeSport={sport} />
    </main>
  );
}
