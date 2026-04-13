"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

function CustomTick(props: Record<string, any>) {
  const { payload, x, y, textAnchor, stroke, radius } = props;
  const originalText = payload?.value || "";
  let formatted = originalText;
  if (formatted.length > 25) formatted = formatted.substring(0, 22) + '...';
  
  return (
    <text radius={radius} stroke={stroke} x={x} y={y} textAnchor={textAnchor} fill="#d5c4ab" fontSize={9} fontFamily="JetBrains Mono">
       <tspan x={x} dy="0.35em">{formatted}</tspan>
    </text>
  );
}

const chartConfig = {
  value: { label: "Rating", color: "#ffba20" },
} satisfies ChartConfig;

export default function CompareDashboard() {
  const searchParams = useSearchParams();
  const sportA = searchParams?.get("sportA") || "";
  const sportB = searchParams?.get("sportB") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [discrepancySynthesis, setDiscrepancySynthesis] = useState("");
  const [telemetryA, setTelemetryA] = useState<any[]>([]);
  const [telemetryB, setTelemetryB] = useState<any[]>([]);
  const [physicalTollProfileA, setPhysicalTollProfileA] = useState("");
  const [tippingPointA, setTippingPointA] = useState("");
  const [physicalTollProfileB, setPhysicalTollProfileB] = useState("");
  const [tippingPointB, setTippingPointB] = useState("");
  const [genderParityInsight, setGenderParityInsight] = useState("");
  const [forceSyncTrigger, setForceSyncTrigger] = useState(0);

  useEffect(() => {
    if (!sportA || !sportB) return;
    let isMounted = true;
    const isForceSync = forceSyncTrigger > 0;
    
    const fetchCompare = async () => {
      setIsLoading(true);
      setDiscrepancySynthesis("CALCULATING DUAL PARITY BOUNDS...");
      setPhysicalTollProfileA("CALCULATING...");
      setTippingPointA("CALCULATING...");
      setPhysicalTollProfileB("CALCULATING...");
      setTippingPointB("CALCULATING...");
      setGenderParityInsight("CALCULATING...");
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/compare-sports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sportA, sportB, forceSync: isForceSync })
        });
        const resData = await response.json();
        
        if (!isMounted) return;
        if (resData.success) {
           setDiscrepancySynthesis(resData.data.discrepancySynthesis);
           setPhysicalTollProfileA(resData.data.physicalTollProfileA);
           setTippingPointA(resData.data.tippingPointA);
           setPhysicalTollProfileB(resData.data.physicalTollProfileB);
           setTippingPointB(resData.data.tippingPointB);
           setGenderParityInsight(resData.data.genderParityInsight);
           setTelemetryA(resData.data.telemetryDataA);
           setTelemetryB(resData.data.telemetryDataB);
        } else {
           setDiscrepancySynthesis("FAILED DUE TO SCHEMA LIMITS OR SECURE NULLIFICATIONS.");
           setPhysicalTollProfileA("NULLIFIED");
           setTippingPointA("NULLIFIED");
           setPhysicalTollProfileB("NULLIFIED");
           setTippingPointB("NULLIFIED");
           setGenderParityInsight("NULLIFIED");
        }
      } catch(e) {
        if (isMounted) setDiscrepancySynthesis("ERROR RESOLVING PARITY ENGINE");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchCompare();
    return () => { isMounted = false; };
  }, [sportA, sportB, forceSyncTrigger]);

  // Safely Zip Arrays matching lengths dynamically natively
  const maxLen = Math.max(telemetryA.length, telemetryB.length);
  const mergedData = Array.from({ length: maxLen }).map((_, i) => ({
     name: telemetryA[i]?.name || telemetryB[i]?.name || "Unmapped Vector",
     valueA: telemetryA[i]?.value || 0,
     valueB: telemetryB[i]?.value || 0
  }));

  return (
    <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
       <div className="flex justify-between items-center mb-6 border-l-4 border-[#ff453a] pl-4">
         <h1 className="font-headline text-5xl font-black uppercase tracking-tighter text-on-surface">Parity Engine</h1>
         <button 
            onClick={() => setForceSyncTrigger(prev => prev + 1)}
            disabled={isLoading}
            className="px-4 py-2 bg-transparent border border-[#ff453a] text-[#ff453a] font-mono-data text-[10px] uppercase tracking-widest hover:bg-[#ff453a] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
         >
           Run Live Analysis
         </button>
       </div>
       
       <div className="grid grid-cols-12 gap-8">
         <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 border border-outline-variant/10 shadow-lg relative min-h-[400px]">
            {isLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-highest/80 z-50">
                  <span className="material-symbols-outlined text-[#ffba20] text-5xl animate-spin mb-4">radar</span>
                  <p className="font-mono-data text-xs uppercase tracking-widest text-[#ffba20]">Synthesizing Parity Arrays...</p>
               </div>
            ) : null}
            
            {telemetryA.length > 0 && !isLoading ? (
              <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[400px]">
                 <RadarChart outerRadius="65%" data={mergedData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <PolarGrid stroke="#514532" />
                    <PolarAngleAxis dataKey="name" tick={<CustomTick />} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#514532", fontSize: 8 }} />
                    <Radar name={sportA.toUpperCase()} dataKey="valueA" stroke="#ffba20" fill="#ffba20" fillOpacity={0.4} />
                    <Radar name={sportB.toUpperCase()} dataKey="valueB" stroke="#ff453a" fill="#ff453a" fillOpacity={0.4} />
                 </RadarChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center opacity-30 text-xs font-mono-data text-slate-400">Waiting for Parity Sync...</div>
            )}
         </section>
         
         <section className="col-span-12 lg:col-span-5 bg-surface-container-low p-8 border-t-8 border-[#ff453a] shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <h2 className="font-headline text-2xl font-black uppercase text-[#ff453a] mb-4">Discrepancy Synthesis</h2>
            <div className={`font-body text-base text-on-surface-variant ${isLoading ? 'animate-pulse' : ''} leading-relaxed`}>
               {discrepancySynthesis}
            </div>
         </section>
       </div>
       
       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#111827]/80 backdrop-blur border-l-4 border-[#ffba20] shadow-2xl rounded-none">
             <CardHeader className="pb-2">
               <CardTitle className="font-headline text-lg font-black uppercase text-on-surface">Sport A: {sportA}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-4">
               <div>
                  <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest mb-1">Physical Toll</span>
                  <p className={`font-body text-sm text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>{physicalTollProfileA}</p>
               </div>
               
               <div>
                  <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest mb-1">Tipping Point</span>
                  <p className={`font-body text-sm text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>{tippingPointA}</p>
               </div>
             </CardContent>
          </Card>
          
          <Card className="bg-[#111827]/80 backdrop-blur border-l-4 border-[#ff453a] shadow-2xl rounded-none">
             <CardHeader className="pb-2">
               <CardTitle className="font-headline text-lg font-black uppercase text-on-surface">Sport B: {sportB}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-4">
               <div>
                  <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest mb-1">Physical Toll</span>
                  <p className={`font-body text-sm text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>{physicalTollProfileB}</p>
               </div>
               
               <div>
                  <span className="font-mono-data text-[10px] text-slate-500 block uppercase tracking-widest mb-1">Tipping Point</span>
                  <p className={`font-body text-sm text-[#d5c4ab] ${isLoading ? 'animate-pulse opacity-50' : ''}`}>{tippingPointB}</p>
               </div>
             </CardContent>
          </Card>
       </div>
       
       <Card className="mt-8 bg-surface-container-low border border-outline-variant/30 shadow-2xl relative mb-12">
          <CardHeader className="pb-2 flex flex-row items-baseline gap-4 border-b border-outline-variant/10">
            <span className="material-symbols-outlined text-[#ffba20] mt-0">group</span>
            <CardTitle className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">Gender Parity Contrast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-body text-base text-on-surface-variant leading-relaxed max-w-4xl pt-6 ${isLoading ? 'animate-pulse opacity-50' : ''}`}>
               {genderParityInsight}
            </p>
          </CardContent>
       </Card>
    </main>
  );
}
