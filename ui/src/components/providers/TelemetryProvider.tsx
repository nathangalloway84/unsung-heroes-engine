"use client";

import React, { createContext, useContext, useState } from "react";

export type CachedDossier = {
  archetype: string;
  hiddenGrind: string;
  telemetryData: any[];
};

interface TelemetryContextType {
  cache: Record<string, CachedDossier>;
  setCachePayload: (sportId: string, payload: CachedDossier) => void;
  activeArchetype: string;
  setActiveArchetype: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<Record<string, CachedDossier>>({});
  const [activeArchetype, setActiveArchetype] = useState("MISSION BRIEFING");
  const [isLoading, setIsLoading] = useState(false);

  const setCachePayload = (sportId: string, payload: CachedDossier) => {
    setCache((prev) => ({ ...prev, [sportId]: payload }));
  };

  return (
    <TelemetryContext.Provider value={{ cache, setCachePayload, activeArchetype, setActiveArchetype, isLoading, setIsLoading }}>
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
