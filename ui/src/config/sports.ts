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
    { id: "archery", name: "Archery", icon: "blur_circular" },
    { id: "artistic-swimming", name: "Artistic Swimming", icon: "pool" },
    { id: "track-and-field", name: "Track and Field", icon: "directions_run" },
    { id: "badminton", name: "Badminton", icon: "sports_tennis" },
    { id: "basketball", name: "Basketball", icon: "sports_basketball" },
    { id: "boxing", name: "Boxing", icon: "sports_mma" },
    { id: "breaking", name: "Breaking", icon: "directions_run" },
    { id: "canoe-kayak", name: "Canoe / Kayak", icon: "rowing" },
    { id: "cycling", name: "Cycling", icon: "directions_bike" },
    { id: "diving", name: "Diving", icon: "pool" },
    { id: "equestrian", name: "Equestrian", icon: "pets" },
    { id: "fencing", name: "Fencing", icon: "sports_martial_arts" },
    { id: "field-hockey", name: "Field Hockey", icon: "sports_hockey" },
    { id: "golf", name: "Golf", icon: "golf_course" },
    { id: "gymnastics", name: "Gymnastics", icon: "sports_gymnastics" },
    { id: "judo", name: "Judo", icon: "sports_martial_arts" },
    { id: "modern-pentathlon", name: "Modern Pentathlon", icon: "running_with_errors" },
    { id: "rowing", name: "Rowing", icon: "rowing" },
    { id: "rugby", name: "Rugby Sevens", icon: "sports_rugby" },
    { id: "sailing", name: "Sailing", icon: "sailing" },
    { id: "shooting", name: "Shooting", icon: "center_focus_strong" },
    { id: "skateboarding", name: "Skateboarding", icon: "skateboarding" },
    { id: "sport-climbing", name: "Sport Climbing", icon: "terrain" },
    { id: "surfing", name: "Surfing", icon: "surfing" },
    { id: "swimming", name: "Swimming", icon: "pool" },
    { id: "table-tennis", name: "Table Tennis", icon: "run_circle" },
    { id: "taekwondo", name: "Taekwondo", icon: "sports_martial_arts" },
    { id: "tennis", name: "Tennis", icon: "sports_tennis" },
    { id: "triathlon", name: "Triathlon", icon: "directions_run" },
    { id: "volleyball", name: "Volleyball", icon: "sports_volleyball" },
    { id: "water-polo", name: "Water Polo", icon: "pool" },
    { id: "weightlifting", name: "Weightlifting", icon: "fitness_center" },
    { id: "wrestling", name: "Wrestling", icon: "sports_kabaddi" }
  ],
  paralympics: [
    { id: "blind-football", name: "Blind Football", icon: "sports_soccer" },
    { id: "boccia", name: "Boccia", icon: "adjust" },
    { id: "goalball", name: "Goalball", icon: "sports_volleyball" },
    { id: "para-archery", name: "Para Archery", icon: "blur_circular" },
    { id: "para-athletics", name: "Para Athletics", icon: "directions_run" },
    { id: "para-badminton", name: "Para Badminton", icon: "sports_tennis" },
    { id: "para-canoe", name: "Para Canoe", icon: "rowing" },
    { id: "para-cycling", name: "Para Cycling", icon: "directions_bike" },
    { id: "para-equestrian", name: "Para Equestrian", icon: "pets" },
    { id: "para-judo", name: "Para Judo", icon: "sports_martial_arts" },
    { id: "para-powerlifting", name: "Para Powerlifting", icon: "fitness_center" },
    { id: "para-rowing", name: "Para Rowing", icon: "rowing" },
    { id: "para-swimming", name: "Para Swimming", icon: "pool" },
    { id: "para-table-tennis", name: "Para Table Tennis", icon: "run_circle" },
    { id: "para-taekwondo", name: "Para Taekwondo", icon: "sports_martial_arts" },
    { id: "para-triathlon", name: "Para Triathlon", icon: "directions_run" },
    { id: "shooting-para-sport", name: "Shooting Para Sport", icon: "center_focus_strong" },
    { id: "sitting-volleyball", name: "Sitting Volleyball", icon: "sports_volleyball" },
    { id: "wheelchair-basketball", name: "Wheelchair Basketball", icon: "sports_basketball" },
    { id: "wheelchair-fencing", name: "Wheelchair Fencing", icon: "sports_martial_arts" },
    { id: "wheelchair-rugby", name: "Wheelchair Rugby", icon: "sports_rugby" },
    { id: "wheelchair-tennis", name: "Wheelchair Tennis", icon: "sports_tennis" }
  ]
};
