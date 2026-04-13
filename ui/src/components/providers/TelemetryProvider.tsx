"use client";

import React, { createContext, useContext, useState } from "react";

export type CachedDossier = {
  archetype: string;
  hiddenGrind: string;
  telemetryData: any[];
  activeSources?: string[];
  visibilityGapInsight: string;
  physicalTollProfile: string;
  tippingPoint: string;
};

interface TelemetryContextType {
  cache: Record<string, CachedDossier>;
  setCachePayload: (sportId: string, payload: CachedDossier) => void;
  activeArchetype: string;
  setActiveArchetype: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  latency: string;
  setLatency: (val: string) => void;
  isCompareMode: boolean;
  setIsCompareMode: (val: boolean) => void;
  compareSportA: string;
  setCompareSportA: (val: string) => void;
  compareSportB: string;
  setCompareSportB: (val: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<Record<string, CachedDossier>>({});
  const [activeArchetype, setActiveArchetype] = useState("MISSION BRIEFING");
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState("STANDBY");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareSportA, setCompareSportA] = useState("");
  const [compareSportB, setCompareSportB] = useState("");

  const setCachePayload = (sportId: string, payload: CachedDossier) => {
    setCache((prev) => ({ ...prev, [sportId]: payload }));
  };

  return (
    <TelemetryContext.Provider value={{ 
        cache, setCachePayload, activeArchetype, setActiveArchetype, isLoading, setIsLoading, latency, setLatency,
        isCompareMode, setIsCompareMode, compareSportA, setCompareSportA, compareSportB, setCompareSportB
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetryCache() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetryCache must be used within a <TelemetryProvider>");
  }
  return context;
}
