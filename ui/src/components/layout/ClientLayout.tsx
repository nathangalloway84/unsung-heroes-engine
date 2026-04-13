"use client";

import React, { useState } from "react";
import SideNavBar from "@/components/layout/SideNavBar";
import TopNavBar from "@/components/layout/TopNavBar";
import { useParams } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const sector = (params?.sector as string) || "paralympics";
  const sport = (params?.sport as string) || "";

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
