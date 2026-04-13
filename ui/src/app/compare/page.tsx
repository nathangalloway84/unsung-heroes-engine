"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

  useEffect(() => {
    if (!sportA || !sportB) return;
    let isMounted = true;
    
    const fetchCompare = async () => {
      setIsLoading(true);
      setDiscrepancySynthesis("CALCULATING DUAL PARITY BOUNDS...");
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/compare-sports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sportA, sportB })
        });
        const resData = await response.json();
        
        if (!isMounted) return;
        if (resData.success) {
           setDiscrepancySynthesis(resData.data.discrepancySynthesis);
           setTelemetryA(resData.data.telemetryDataA);
           setTelemetryB(resData.data.telemetryDataB);
        } else {
           setDiscrepancySynthesis("FAILED DUE TO SCHEMA LIMITS OR SECURE NULLIFICATIONS.");
        }
      } catch(e) {
        if (isMounted) setDiscrepancySynthesis("ERROR RESOLVING PARITY ENGINE");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchCompare();
    return () => { isMounted = false; };
  }, [sportA, sportB]);

  // Safely Zip Arrays matching lengths dynamically natively
  const maxLen = Math.max(telemetryA.length, telemetryB.length);
  const mergedData = Array.from({ length: maxLen }).map((_, i) => ({
     name: telemetryA[i]?.name || telemetryB[i]?.name || "Unmapped Vector",
     valueA: telemetryA[i]?.value || 0,
     valueB: telemetryB[i]?.value || 0
  }));

  return (
    <main className="ml-0 lg:ml-64 mt-16 p-4 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto bg-background transition-all">
       <h1 className="font-headline text-5xl font-black uppercase tracking-tighter mb-6 text-on-surface border-l-4 border-[#ff453a] pl-4">Parity Engine</h1>
       
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
    </main>
  );
}
