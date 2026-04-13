export type SportDefinition = {
  id: string;
  name: string;
  icon: string;
};

export type SectorConfig = {
  [key: string]: SportDefinition[];
};

export const SPORTS_CONFIG: SectorConfig = {
  olympics: [
    { id: "wrestling", name: "Wrestling", icon: "sports_kabaddi" },
    { id: "judo", name: "Judo", icon: "sports_martial_arts" },
    { id: "breaking", name: "Breaking", icon: "directions_run" }
  ],
  paralympics: [
    { id: "goalball", name: "Goalball", icon: "sports_volleyball" },
    { id: "wheelchair-rugby", name: "Wheelchair Rugby", icon: "sports_rugby" },
    { id: "boccia", name: "Boccia", icon: "adjust" }
  ]
};
