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
];

export const systems: SystemCase[] = [
  {
    slug: "flow-optimization",
    title: "Flow Optimization System",
    category: "Flow Systems",
    summary:
      "Reconfigured spatial sequences to reduce queue friction and increase throughput by 34% across peak hours.",
    image: "/images/case-flow.jpg",
    context:
      "A multi-level hospitality complex experiencing severe bottlenecks during peak service hours. Guest satisfaction scores were declining despite high demand, with average wait times exceeding acceptable thresholds across all key touchpoints.",
    businessShift:
      "From static floor plan to dynamic flow architecture. The business model required the space to accommodate 40% more throughput without expanding the physical footprint, necessitating a fundamental rethinking of how movement and service intersect.",
    serviceArchitecture:
      "We mapped every touchpoint across the guest journey, identifying 12 friction points where spatial design actively worked against operational efficiency. The new service architecture introduced parallel processing zones, intuitive queue dispersal, and strategically placed decompression areas.",
    spatialTranslation:
      "Circulation paths were widened at decision points and narrowed at transition zones to create natural pacing. Material changes on the floor signal service zone boundaries without signage. Ceiling height variations create intuitive wayfinding through compression and release.",
    interactionLayer:
      "Digital queue management integrates with spatial cues, displaying real-time wait information at natural pause points. Mobile check-in zones are positioned at entry sequences where guests naturally slow their pace.",
    performanceOutcomes: [
      { metric: "Throughput increase", value: "+34%" },
      { metric: "Average wait time reduction", value: "-47%" },
      { metric: "Guest satisfaction score", value: "+22pts" },
      { metric: "Revenue per square meter", value: "+18%" },
    ],
    strategicInsight:
      "Flow is not a routing problem. It is a design language. When spatial sequences align with service choreography, friction dissolves and capacity emerges from the same footprint.",
  },
  {
    slug: "behavior-shaping",
    title: "Behavior-Shaping Environment",
    category: "Behavioral Environments",
    summary:
      "Material and spatial cues designed to guide intuitive wayfinding, increasing dwell time and engagement.",
    image: "/images/case-behavior.jpg",
    context:
      "A cultural retail destination struggling with low engagement depth. Visitors were spending time only in entry-level zones, bypassing 60% of the spatial program. The existing design treated all areas with equal visual weight, creating no narrative pull.",
    businessShift:
      "From uniform retail space to curated behavioral landscape. The commercial model shifted from square-meter leasing to experience-duration economics, where value is measured by depth of engagement rather than simple footfall.",
    serviceArchitecture:
      "We designed a progressive disclosure system where each zone reveals itself through material and light cues rather than wayfinding signage. Service touchpoints were repositioned to coincide with natural curiosity moments in the spatial journey.",
    spatialTranslation:
      "A gradient of intimacy guides visitors from public to semi-private to discovery zones. Ceiling heights drop progressively. Materials shift from polished stone to textured wood to soft textiles. Each transition signals a deepening of the experience.",
    interactionLayer:
      "Ambient digital layers respond to zone occupancy, subtly adjusting lighting temperature and content to match the behavioral state of each area. No screens dominate the experience; technology serves as an invisible choreographer.",
    performanceOutcomes: [
      { metric: "Average dwell time", value: "+62%" },
      { metric: "Deep-zone penetration", value: "+140%" },
      { metric: "Return visit rate", value: "+38%" },
      { metric: "Per-visit spend increase", value: "+24%" },
    ],
    strategicInsight:
      "Behavior is not directed. It is invited. When space creates a sequence of discoveries, people move deeper, stay longer, and return more often. The architecture becomes the experience engine.",
  },
  {
    slug: "hybrid-model",
    title: "Hybrid Physical-Digital Model",
    category: "Hybrid Models",
    summary:
      "An integrated interface layer merging physical space with digital touchpoints for seamless service delivery.",
    image: "/images/case-hybrid.jpg",
    context:
      "A professional services firm operating across physical offices and remote channels with no coherent spatial-digital strategy. The client experience fragmented at every handoff between physical and digital touchpoints, eroding trust and extending service cycles.",
    businessShift:
      "From channel-siloed operations to unified service continuum. The firm restructured its operating model around a single client journey that flows seamlessly between physical and digital environments, treating space as an interface layer rather than a container.",
    serviceArchitecture:
      "We designed a service mesh where every physical touchpoint has a digital counterpart, and every digital interaction can be spatially contextualized. Handoffs between channels became invisible through shared state and environmental continuity.",
    spatialTranslation:
      "Physical consultation rooms are equipped with spatial computing interfaces that project shared documents and data into the room. Remote participants experience the same spatial cues through calibrated digital environments that mirror the physical room's proportions and lighting.",
    interactionLayer:
      "A unified interaction protocol governs both physical and digital touchpoints. Gesture-based controls in physical space mirror touch interfaces in digital. Environmental states synchronize across channels in real time.",
    performanceOutcomes: [
      { metric: "Service cycle reduction", value: "-35%" },
      { metric: "Client satisfaction (NPS)", value: "+41pts" },
      { metric: "Cross-channel continuity", value: "98%" },
      { metric: "Operational cost reduction", value: "-22%" },
    ],
    strategicInsight:
      "The boundary between physical and digital is a design choice, not a technical constraint. When both layers share the same service logic and spatial language, the client never feels a seam.",
  },
  {
    slug: "operational-transformation",
    title: "Operational Transformation",
    category: "Operational Redesign",
    summary:
      "Full-scale spatial-service redesign that increased revenue per square meter by 28% within six months.",
    image: "/images/case-operations.jpg",
    context:
      "A flagship commercial property facing declining tenancy rates and foot traffic despite a prime urban location. The existing spatial program was a product of incremental additions over decades, resulting in dead zones, inefficient circulation, and disconnected tenant experiences.",
    businessShift:
      "From landlord model to platform model. The property transitioned from passive leasing to active experience curation, where the spatial infrastructure serves as an operating platform that generates value for all stakeholders in the ecosystem.",
    serviceArchitecture:
      "We redesigned the property as a service ecosystem with shared infrastructure, common experience standards, and coordinated operational protocols. Individual tenants contribute to and benefit from a unified guest experience rather than competing in isolation.",
    spatialTranslation:
      "Dead zones were converted into active connector spaces that serve as shared amenity infrastructure. A new primary circulation spine was introduced, creating visual connectivity between all levels and zones. Material language unifies the experience while allowing tenant expression within defined parameters.",
    interactionLayer:
      "A property-wide digital layer provides real-time wayfinding, event awareness, and service discovery. Tenant systems integrate with the platform API, enabling coordinated promotions and cross-referral mechanics embedded in the spatial experience.",
    performanceOutcomes: [
      { metric: "Revenue per square meter", value: "+28%" },
      { metric: "Foot traffic increase", value: "+45%" },
      { metric: "Tenancy occupancy rate", value: "97%" },
      { metric: "Visitor satisfaction", value: "+33pts" },
    ],
    strategicInsight:
      "Operational transformation is not renovation. It is redesigning the logic of the space itself. When the spatial infrastructure becomes a platform, every participant in the ecosystem generates and captures more value.",
  },
];
