export interface SystemCase {
  slug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  context: string;
  businessShift: string;
  serviceArchitecture: string;
  spatialTranslation: string;
  interactionLayer: string;
  performanceOutcomes: {
    metric: string;
    value: string;
  }[];
  strategicInsight: string;
}

export const systemCategories = [
  "All",
  "Flow Systems",
  "Behavioral Environments",
  "Hybrid Models",
  "Operational Redesign",
  "Commercial",
  "Residential",
];

export const systems: SystemCase[] = [
  {
    slug: "commercial-showroom",
    title: "Commercial Showroom",
    category: "Commercial",
    summary: "Retail as immersive experience",
    image: "/images/case-showroom.jpg",
    context:
      "A flagship retail destination transformed from traditional showroom to experiential commerce. The space now serves as a living catalog where products become protagonists in curated scenes rather than static displays.",
    businessShift:
      "From passive product presentation to active experience commerce. The commercial model shifted from inventory turnover to experience duration economics, where value is measured by depth of engagement rather than transaction volume.",
    serviceArchitecture:
      "We designed a spatial narrative system where each zone tells part of the brand story through material, lighting, and spatial sequence. Service touchpoints are embedded in the experience itself rather than separate from it.",
    spatialTranslation:
      "Customer journeys flow through discovery zones, interaction areas, and decision points in a choreographed sequence. Ceiling heights vary to create hierarchy and intimacy gradients.",
    interactionLayer:
      "Digital interfaces are seamlessly integrated into physical surfaces, allowing customers to access product information, customization tools, and checkout directly within the experience zones.",
    performanceOutcomes: [
      { metric: "Dwell time increase", value: "+45%" },
      { metric: "Cross-category engagement", value: "+62%" },
      { metric: "Sales per square meter", value: "+38%" },
    ],
    strategicInsight:
      "When space becomes the experience, customers don't just buy products—they participate in a brand story that unfolds through spatial design.",
  },
  {
    slug: "residential-kids-room",
    title: "Kids Room",
    category: "Residential",
    summary: "A world for imagination",
    image: "/images/case-kids-room.jpg",
    context:
      "A children's bedroom designed as a microcosm of imagination. The space adapts to different play patterns through modular furniture and interactive elements that respond to creative activities.",
    businessShift:
      "From standardized children's room to adaptive play environment. The design recognizes that children's needs change rapidly and incorporates flexible elements that can be reconfigured by the children themselves.",
    serviceArchitecture:
      "We created a system of interactive elements that respond to different play modes—creative, rest, and social. Each element has multiple functions and can be repositioned to support evolving play patterns.",
    spatialTranslation:
      "Scale is carefully calibrated to child proportions, with furniture at two heights. Storage solutions are integrated into play elements, and safety features are embedded in the design itself rather than added as afterthoughts.",
    interactionLayer:
      "Physical elements respond to touch and movement, while projection surfaces can transform walls into interactive canvases. The room can shift between different themed environments through lighting and sound.",
    performanceOutcomes: [
      { metric: "Play time increase", value: "+67%" },
      { metric: "Creative engagement", value: "+84%" },
      { metric: "Space utilization", value: "+92%" },
    ],
    strategicInsight:
      "Children's spaces should not be miniature versions of adult spaces. They need their own scale, their own logic, and their own magic.",
  },
  {
    slug: "commercial-office-space",
    title: "Office Space",
    category: "Commercial",
    summary: "Spaces for teams to thrive",
    image: "/images/case-office-space.jpg",
    context:
      "A modern office environment designed around collaborative work patterns. The space supports both focused individual work and spontaneous team collaboration through flexible zones and integrated technology.",
    businessShift:
      "From assigned seating to activity-based working. The office model evolved from fixed desk allocation to dynamic space booking, where teams choose environments based on task requirements rather than hierarchy.",
    serviceArchitecture:
      "We implemented a hot-desking system with integrated technology hubs. Each work zone has appropriate acoustic properties, lighting controls, and access to shared resources.",
    spatialTranslation:
      "Open-plan areas encourage spontaneous collaboration, while focus pods provide acoustic privacy. The space uses natural light and views to reduce dependence on artificial lighting.",
    interactionLayer:
      "Room booking systems integrate with personal environmental preferences. Digital displays show space availability and allow spontaneous team formation.",
    performanceOutcomes: [
      { metric: "Team satisfaction", value: "+28%" },
      { metric: "Space utilization", value: "+76%" },
      { metric: "Meeting efficiency", value: "+41%" },
    ],
    strategicInsight:
      "The best office design is not about desks—it's about creating environments that make people want to come to work.",
  },
  {
    slug: "commercial-bude-building",
    title: "Bude Building",
    category: "Commercial",
    summary: "Architecture and vibrant surroundings",
    image: "/images/case-bude-building.jpg",
    context:
      "A mixed-use commercial building that serves as both civic landmark and community hub. The architecture balances public functions with private commercial spaces, creating a vibrant streetscape.",
    businessShift:
      "From single-purpose commercial to mixed-use ecosystem. The building generates revenue through multiple streams—retail, office, and civic services—creating resilience through diversification.",
    serviceArchitecture:
      "We designed the building with a 'ground floor activation' strategy where retail and civic spaces create constant foot traffic that supports upper-floor commercial tenants.",
    spatialTranslation:
      "The facade uses dynamic lighting that changes character throughout the day, while interior spaces maintain consistent material language. Vertical circulation creates visual connections between different functional zones.",
    interactionLayer:
      "Public wayfinding integrates with digital directory services. The building becomes a landmark through both its architecture and its role as a community information hub.",
    performanceOutcomes: [
      { metric: "Foot traffic increase", value: "+120%" },
      { metric: "Tenant diversity", value: "+45%" },
      { metric: "Public engagement", value: "+67%" },
    ],
    strategicInsight:
      "Architecture succeeds when it serves both practical needs and cultural aspirations simultaneously.",
  },
  {
    slug: "residential-urban-retreat",
    title: "Urban Retreat",
    category: "Residential",
    summary: "Quiet bedroom above the city",
    image: "/images/case-urban-retreat.jpg",
    context:
      "A high-rise residential apartment designed as an urban sanctuary. The space provides a peaceful retreat from city bustle while maintaining connection to urban life through strategic views.",
    businessShift:
      "From isolated apartment to connected urban home. The design incorporates smart home technology and shared amenities that create community within the building.",
    serviceArchitecture:
      "We designed a layered privacy system where public zones transition to private spaces through material and spatial sequencing. The apartment serves as both home and retreat.",
    spatialTranslation:
      "Floor-to-ceiling windows frame city views while maintaining acoustic privacy. Interior spaces are arranged to maximize natural light and create different temporal experiences throughout the day.",
    interactionLayer:
      "Smart home systems control lighting, climate, and security based on occupancy patterns. The interface learns resident preferences and anticipates needs.",
    performanceOutcomes: [
      { metric: "Noise reduction", value: "-85%" },
      { metric: "Natural light optimization", value: "+92%" },
      { metric: "Urban connection score", value: "+78%" },
    ],
    strategicInsight:
      "Urban living should provide both sanctuary and connection—sometimes in the same view.",
  },
  {
    slug: "residential-family-nest",
    title: "Family Nest",
    category: "Residential",
    summary: "Everyday warmth of home",
    image: "/images/case-family-nest.jpg",
    context:
      "A family home designed around the rituals of daily life. The spaces flow from public to private zones, supporting both family activities and individual retreats.",
    businessShift:
      "From generic family home to personalized living system. The design incorporates flexible spaces that adapt to different family compositions and life stages.",
    serviceArchitecture:
      "We created a 'heart of the home' design where the kitchen becomes a social hub that connects to all living areas. Storage solutions are integrated into circulation paths rather than hidden away.",
    spatialTranslation:
      "Natural light guides daily patterns through the house, with spaces becoming more private as they move inward. Material palette creates warmth and continuity throughout the home.",
    interactionLayer:
      "The home responds to family routines through automated lighting, climate zones, and flexible furniture arrangements. Each family member has personal space within the shared environment.",
    performanceOutcomes: [
      { metric: "Family time together", value: "+43%" },
      { metric: "Storage efficiency", value: "+67%" },
      { metric: "Home satisfaction", value: "+91%" },
    ],
    strategicInsight:
      "A home should be a vessel for family life, growing and changing with the people who live in it.",
  }
];
