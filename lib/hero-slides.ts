export type HeroSlideType = "image" | "video";

export interface HeroSlide {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderIndex: number;
  hidden: boolean;
  type: HeroSlideType;
  src: string;
  poster?: string | null;
  label: string;
  title: string;
  subtitle: string;
}

// Default slides that match the current hard-coded header content.
// Used to seed Supabase and as a fallback when no slides are stored yet.
export const defaultHeroSlides: Array<{
  type: HeroSlideType;
  src: string;
  poster?: string | null;
  label: string;
  title: string;
  subtitle: string;
}> = [
  {
    type: "video",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stairs-iDqt60Un21rkelbbMx9n414hrC0xn4.mp4",
    poster: "/images/poster-bude.jpg",
    label: "Comercial",
    title: "Showroom",
    subtitle: "Retail as immersive experience",
  },
  {
    type: "video",
    src: "/videos/kidsroom2.mp4",
    poster: "/images/slide-lobby.jpg",
    label: "Residential",
    title: "Kids Room",
    subtitle: "A world for imagination",
  },
  {
    type: "image",
    src: "/images/building-final.jpg",
    label: "Comercial",
    title: "Bude Building",
    subtitle: "Architecture and vibrant surroundings",
  },
  {
    type: "video",
    src: "/videos/appartment.mp4",
    poster: "/images/slide-retail.jpg",
    label: "Residential",
    title: "Urban Retreat",
    subtitle: "Quiet bedroom above the city",
  },
  {
    type: "video",
    src: "/videos/badroom.mp4",
    poster: "/images/slide-workspace.jpg",
    label: "Residential",
    title: "Family Nest",
    subtitle: "Everyday warmth of home",
  },
  {
    type: "video",
    src: "/videos/office.mp4",
    poster: "/images/poster-office.jpg",
    label: "Comercial",
    title: "Office Space",
    subtitle: "Spaces for teams to thrive",
  },
];

