"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

function CustomTick(props: Record<string, any>) {
  const { payload, x, y, textAnchor, stroke, radius } = props;
  const originalText = payload?.value || "";
  
  const words = originalText.split(' ');
  const splitIndex = Math.ceil(words.length / 2);
  let line1 = words.slice(0, splitIndex).join(' ');
  let line2 = words.slice(splitIndex).join(' ');
  
  if (line1.length > 25) line1 = line1.substring(0, 22) + '...';
  if (line2.length > 25) line2 = line2.substring(0, 22) + '...';

  return (
    <text
      radius={radius}
      stroke={stroke}
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="#d5c4ab"
      fontSize={10}
      fontFamily="JetBrains Mono"
      style={{ pointerEvents: 'auto' }}
    >
      <title>{originalText}</title>
      <tspan x={x} dy={line2 ? "-0.5em" : "0.35em"}>{line1}</tspan>
      {line2 && <tspan x={x} dy="1em">{line2}</tspan>}
    </text>
  );
}

interface TelemetryVisualizerProps {
  hiddenGrind: string;
  loading: boolean;
  telemetryData?: any[];
  sport?: string;
  activeSources?: string[];
}

const chartConfig = {
  value: {
    label: "Rating",
    color: "#ffba20",
  },
} satisfies ChartConfig;

export default function TelemetryVisualizer({ hiddenGrind, loading, telemetryData = [], sport, activeSources = [] }: TelemetryVisualizerProps) {
  return (
    <div className="grid grid-cols-12 gap-8 mb-8">
      {/* Narrative Block */}
      <section className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-surface-container-low p-8 relative shadow-lg">
          <div className="absolute top-4 right-4 font-mono-data text-[10px] text-slate-600 bg-surface-container-lowest px-2 py-1 uppercase tracking-widest border border-outline-variant/30">Dossier: HG_01</div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter mb-6 text-on-surface border-l-4 border-[#ffba20] pl-4">Hidden Grind</h2>
          <div className="space-y-4 text-on-surface-variant font-body leading-relaxed text-sm">
            <p className={`${loading ? 'animate-pulse opacity-50' : 'opacity-100'} transition-opacity`}>
              {hiddenGrind}
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Visualization Interface */}
      <section className="col-span-12 lg:col-span-7">
        <div className="h-full min-h-[450px] bg-surface-container-lowest relative flex flex-col border border-outline-variant/10 overflow-hidden shadow-lg">
          <div className="flex justify-between items-center bg-surface-container-high px-4 py-2 relative z-20">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-error rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-[#ffba20] rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-secondary rounded-full opacity-50"></div>
            </div>
            <span className="font-mono-data text-[10px] text-slate-400 font-bold">
              {sport && !loading && telemetryData.length > 0 ? `DATA_VIZ // SOURCES: ${activeSources.join(", ")}` : 'DATA_VIZ // STANDBY'}
            </span>
          </div>
          
          <div className="flex-1 p-8 flex flex-col justify-center items-center relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#514532 1px, transparent 1px), linear-gradient(90deg, #514532 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {!telemetryData || telemetryData.length === 0 ? (
              <div className="mt-12 text-center z-10 w-full max-w-md">
                <div className="bg-surface-container-high px-6 py-6 border border-amber-500/30 flex flex-col items-center shadow-xl">
                  <span className={`material-symbols-outlined text-5xl text-[#ffba20] block mb-4 ${loading ? 'animate-spin' : ''}`}>analytics</span>
                  <p className="font-mono-data text-xs text-[#ffba20] uppercase tracking-widest font-bold">
                    {loading ? 'Processing Systemic Telemetry Arrays...' : 'Awaiting Input Command'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full z-10 relative flex flex-col justify-center max-h-[350px]">
                  <div className="absolute top-0 left-0 font-mono-data text-[10px] text-[#ffba20] tracking-widest uppercase border border-[#ffba20]/30 px-2 py-1 bg-surface-container z-30">Live Sector Inference Matrix</div>
                  <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[350px]">
                    <RadarChart outerRadius="68%" data={telemetryData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <PolarGrid stroke="#514532" />
                      <PolarAngleAxis dataKey="name" tick={<CustomTick />} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#514532", fontSize: 8 }} />
                      <Radar
                        name="Sector Strain"
                        dataKey="value"
                        stroke="#ffba20"
                        fill="#96ccff"
                        fillOpacity={0.4}
                        isAnimationActive={true}
                      />
                    </RadarChart>
                  </ChartContainer>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
