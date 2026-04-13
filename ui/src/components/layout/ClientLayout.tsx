"use client";

import React, { useState, useEffect } from "react";
import SideNavBar from "@/components/layout/SideNavBar";
import TopNavBar from "@/components/layout/TopNavBar";
import { useParams } from "next/navigation";
import { useTelemetryCache } from "@/components/providers/TelemetryProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const { activeSectorTracker, setActiveSectorTracker } = useTelemetryCache();
  
  const urlSector = params?.sector as string;
  const sport = (params?.sport as string) || "";
  
  useEffect(() => {
    if (urlSector) {
      setActiveSectorTracker(urlSector);
    }
  }, [urlSector, setActiveSectorTracker]);

  const activeSector = urlSector || activeSectorTracker;

  return (
    <>
      <SideNavBar 
        activeSector={sector}
        activeSport={sport}
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />
      <TopNavBar 
        activeSport={sport} 
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      {children}
    </>
  );
}
