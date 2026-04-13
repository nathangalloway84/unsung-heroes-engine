"use client";

import React, { useEffect, useState } from "react";
import TelemetryVisualizer from "@/components/dashboard/TelemetryVisualizer";
import VisibilityGapCard from "@/components/dashboard/VisibilityGapCard";
import { useParams } from "next/navigation";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";

export default function SportDashboard() {
  const params = useParams();
  const sport = params.sport as string;
  
  const { cache, setCachePayload, setActiveArchetype, isLoading, setIsLoading, setLatency } = useTelemetryCache();
  
  const [hiddenGrind, setHiddenGrind] = useState("");
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([]);

  useEffect(() => {
    if (!sport) return;

    if (cache[sport]) {
      setActiveArchetype(cache[sport].archetype);
      setHiddenGrind(cache[sport].hiddenGrind);
      setTelemetryData(cache[sport].telemetryData);
      setActiveSources(cache[sport].activeSources || []);
      setLatency("CACHED");
      return;
    }

    let isMounted = true;

    const fetchTelemetry = async () => {
      setIsLoading(true);
      setLatency("COMPUTING...");
      const startTime = performance.now();
      setActiveArchetype("EXTRACTING RAW FEEDS...");
      setHiddenGrind(`Scraping live Team USA context URLs for ${sport.toUpperCase()} and verifying semantic safety bounds...`);
      setTelemetryData([]);
      setActiveSources([]);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/analyze-sport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sport: sport })
        });
        
        const resData = await response.json();
        const endTime = performance.now();
        const diff = Math.round(endTime - startTime);
        
        if (!isMounted) return;

        if (resData.success) {
          setLatency(`${diff}ms`);
          const payload = {
            archetype: resData.data.archetype,
            hiddenGrind: resData.data.hiddenGrind,
            telemetryData: resData.data.telemetryData && resData.data.telemetryData.length > 0 ? resData.data.telemetryData : [
              { name: "Synthetic Load (Fallback)", value: 40 },
              { name: "Visibility Block (Fallback)", value: 15 },
              { name: "Financial Strain (Fallback)", value: 85 }
            ],
            activeSources: resData.metadata?.activeSources || []
          };
          
          setActiveArchetype(payload.archetype);
          setHiddenGrind(payload.hiddenGrind);
          setTelemetryData(payload.telemetryData);
          setActiveSources(payload.activeSources);
          setCachePayload(sport, payload);
          
        } else {
          setLatency(`ERROR (${diff}ms)`);
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
        const endTime = performance.now();
        const diff = Math.round(endTime - startTime);
        setLatency(`FAILED (${diff}ms)`);
        
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

      <TelemetryVisualizer hiddenGrind={hiddenGrind} loading={isLoading} telemetryData={telemetryData} sport={sport} activeSources={activeSources} />
      <VisibilityGapCard activeSport={sport} />
    </main>
  );
}
