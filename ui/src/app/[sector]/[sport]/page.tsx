"use client";

import React, { useEffect, useState } from "react";
import TelemetryVisualizer from "@/components/dashboard/TelemetryVisualizer";
import VisibilityGapCard from "@/components/dashboard/VisibilityGapCard";
import { useParams } from "next/navigation";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SportDashboard() {
  const params = useParams();
  const sport = params.sport as string;
  
  const { cache, setCachePayload, setActiveArchetype, isLoading, setIsLoading, setLatency } = useTelemetryCache();
  
  const [hiddenGrind, setHiddenGrind] = useState("");
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [visibilityGapInsight, setVisibilityGapInsight] = useState("");
  const [physicalTollProfile, setPhysicalTollProfile] = useState("");
  const [tippingPoint, setTippingPoint] = useState("");
  const [forceSyncTrigger, setForceSyncTrigger] = useState(0);
  const [selectedHurdle, setSelectedHurdle] = useState<string>("");

  useEffect(() => {
    if (!sport) return;

    const isForceSync = forceSyncTrigger > 0;

    if (cache[sport] && !isForceSync) {
      setActiveArchetype(cache[sport].archetype);
      setHiddenGrind(cache[sport].hiddenGrind);
      setTelemetryData(cache[sport].telemetryData);
      setActiveSources(cache[sport].activeSources || []);
      setVisibilityGapInsight(cache[sport].visibilityGapInsight);
      setPhysicalTollProfile(cache[sport].physicalTollProfile);
      setTippingPoint(cache[sport].tippingPoint);
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
      setVisibilityGapInsight("CALCULATING LIVE MEDIA DISCREPANCY...");
      setPhysicalTollProfile("SYNTHESIZING PHYSICAL TOLL VECTORS...");
      setTippingPoint("CALCULATING TIPPING POINT THRESHOLDS...");

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/analyze-sport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sport: sport, forceSync: isForceSync, hurdle: selectedHurdle || undefined })
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
            activeSources: resData.metadata?.activeSources || [],
            visibilityGapInsight: resData.data.visibilityGapInsight || "Visibility limits calculated offline.",
            physicalTollProfile: resData.data.physicalTollProfile || "Toll data degraded offline.",
            tippingPoint: resData.data.tippingPoint || "Thresholds unavailable."
          };
          
          setActiveArchetype(payload.archetype);
          setHiddenGrind(payload.hiddenGrind);
          setTelemetryData(payload.telemetryData);
          setActiveSources(payload.activeSources);
          setVisibilityGapInsight(payload.visibilityGapInsight);
          setPhysicalTollProfile(payload.physicalTollProfile);
          setTippingPoint(payload.tippingPoint);
          setCachePayload(sport, payload);
          
        } else {
          setLatency(`ERROR (${diff}ms)`);
          const payload = {
            archetype: "CONNECTION ERROR",
            hiddenGrind: resData.error || "Failed to parse narrative scraping feeds. Terminal blocked.",
            telemetryData: [],
            activeSources: [],
            visibilityGapInsight: "FAILED TO COMPILE DUE TO UPSTREAM INVERSION.",
            physicalTollProfile: "PROXY DEGRADED - TOLL UNKNOWN.",
            tippingPoint: "PROXY DEGRADED - THRESHOLDS UNKNOWN."
          };
          setActiveArchetype(payload.archetype);
          setHiddenGrind(payload.hiddenGrind);
          setTelemetryData(payload.telemetryData);
          setActiveSources(payload.activeSources);
          setVisibilityGapInsight(payload.visibilityGapInsight);
          setPhysicalTollProfile(payload.physicalTollProfile);
          setTippingPoint(payload.tippingPoint);
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
            telemetryData: [],
            activeSources: [],
            visibilityGapInsight: "PROXY DEGRADED - VISIBILITY UNKNOWN.",
            physicalTollProfile: "PROXY DEGRADED - TOLL UNKNOWN.",
            tippingPoint: "PROXY DEGRADED - THRESHOLDS UNKNOWN."
        };
        setActiveArchetype(degradePayload.archetype);
        setHiddenGrind(degradePayload.hiddenGrind);
        setTelemetryData(degradePayload.telemetryData);
        setActiveSources(degradePayload.activeSources);
        setVisibilityGapInsight(degradePayload.visibilityGapInsight);
        setPhysicalTollProfile(degradePayload.physicalTollProfile);
        setTippingPoint(degradePayload.tippingPoint);
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
  }, [sport, forceSyncTrigger]);

  return (
    <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-outline-variant/10 gap-4">
        <div className="flex gap-8">
          <div>
            <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest">Active Model</span>
            <span className="font-mono-data text-xs text-[#ffba20] uppercase font-bold">MODEL: gemini-3-preview</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
           <Select value={selectedHurdle || "none"} onValueChange={(val) => setSelectedHurdle(val === "none" ? "" : val)} disabled={isLoading}>
             <SelectTrigger className="w-[300px] bg-[#111827] border-outline-variant/30 text-[#d5c4ab] font-body text-xs focus:ring-[#ffba20] rounded-none">
               <SelectValue placeholder="Baseline Projection" />
             </SelectTrigger>
             <SelectContent className="bg-[#111827] border-outline-variant/30 text-[#d5c4ab] font-body text-xs rounded-none">
               <SelectItem value="none">Baseline Projection</SelectItem>
               <SelectItem value="Lost Primary Grassroots Sponsor">Lost Primary Sponsor</SelectItem>
               <SelectItem value="Catastrophic Knee Injury (9-month recovery)">Catastrophic Injury (9mo)</SelectItem>
               <SelectItem value="Training Facility Relocated 1,000 miles away">Facility Relocated (1,000mi)</SelectItem>
             </SelectContent>
           </Select>
           <button 
             onClick={() => setForceSyncTrigger(prev => prev + 1)}
             disabled={isLoading}
             className="px-4 py-2 bg-[#ffba20]/10 border border-[#ffba20] text-[#ffba20] font-mono-data text-[10px] uppercase tracking-widest hover:bg-[#ffba20] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
           >
             Inject Bounds
           </button>
        </div>
      </div>

      <TelemetryVisualizer hiddenGrind={hiddenGrind} loading={isLoading} telemetryData={telemetryData} sport={sport} activeSources={activeSources} hurdleActive={!!selectedHurdle} />
      <VisibilityGapCard activeSport={sport} visibilityGapInsight={visibilityGapInsight} loading={isLoading} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
         <Card className="bg-[#111827]/80 backdrop-blur border-t-2 border-[#ffba20] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="material-symbols-outlined text-6xl">accessibility_new</span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="font-mono-data text-xs uppercase tracking-widest text-slate-500">Physical Toll Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`font-body text-sm leading-relaxed text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>
                 {physicalTollProfile}
              </p>
            </CardContent>
         </Card>

         <Card className="bg-[#111827]/80 backdrop-blur border-t-2 border-[#ff453a] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="material-symbols-outlined text-6xl">warning</span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="font-mono-data text-xs uppercase tracking-widest text-slate-500">Career Tipping Point</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`font-body text-sm leading-relaxed text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>
                 {tippingPoint}
              </p>
            </CardContent>
         </Card>
      </div>
    </main>
  );
}
