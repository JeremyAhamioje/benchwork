/** Site copy and structured content. Edit here rather than inside components. */

export type Discipline = {
  id: string;
  name: string;
  index: string;
  blurb: string;
  skills: string[];
  primary?: boolean;
};

export const disciplines: Discipline[] = [
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    index: "01",
    blurb:
      "Our home department. Machines, mechanisms, structures and anything that has to physically hold together under load.",
    skills: ["CAD", "ANSYS", "Fabrication", "Welding", "Prototyping", "Machines"],
    primary: true,
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    index: "02",
    blurb:
      "Power, control and the boards that drive them — from a solar array down to a single soldered joint.",
    skills: ["Circuits", "PCB", "Soldering", "Embedded Systems", "Solar"],
  },
  {
    id: "mechatronics",
    name: "Mechatronics",
    index: "03",
    blurb:
      "Where the mechanical and the electrical meet: actuation, sensing and closed-loop control.",
    skills: ["Robotics", "Sensors", "Control Systems", "Embedded Hardware"],
  },
  {
    id: "computer",
    name: "Computer / Software Engineering",
    index: "04",
    blurb:
      "Software that has to run on something real — vision, models, dashboards and device firmware.",
    skills: ["AI / ML", "Computer Vision", "Firmware", "Web Apps", "Data"],
  },
  {
    id: "chemical",
    name: "Chemical Engineering",
    index: "05",
    blurb:
      "Process rigs, reactors and separation units — the equipment side of process work.",
    skills: ["Process Rigs", "Reactors", "Piping", "Instrumentation", "Testing"],
  },
  {
    id: "industrial",
    name: "Industrial Engineering",
    index: "06",
    blurb:
      "Production systems, material handling and the measurement work that proves an improvement.",
    skills: ["Material Handling", "Ergonomics", "Process Design", "Optimisation"],
  },
];

/* -------------------------------------------------------------------------- */

export type BuildItem = {
  name: string;
  category: string;
  blurb: string;
  tags: string[];
};

/** Filter options for the "What are you building?" explorer. */
export const buildFilters = [
  "All",
  "Mechanical",
  "Electrical",
  "AI",
  "Robotics",
  "Solar",
  "CAD",
  "ANSYS",
  "Welding / Fabrication",
  "Electronics",
  "Other",
] as const;

export type BuildFilter = (typeof buildFilters)[number];

export const buildItems: BuildItem[] = [
  // Mechanical
  {
    name: "Automated machines",
    category: "Mechanical",
    blurb: "Motorised units that replace a manual operation end to end.",
    tags: ["Mechanical", "Welding / Fabrication", "Electronics"],
  },
  {
    name: "Graters & milling units",
    category: "Mechanical",
    blurb: "Cassava, melon and grain processing units with driven cutting drums.",
    tags: ["Mechanical", "Welding / Fabrication"],
  },
  {
    name: "Presses",
    category: "Mechanical",
    blurb: "Hydraulic, screw and lever presses sized against a real load case.",
    tags: ["Mechanical", "ANSYS", "Welding / Fabrication"],
  },
  {
    name: "Conveyors",
    category: "Mechanical",
    blurb: "Belt, roller and screw conveyors with drive and tensioning design.",
    tags: ["Mechanical", "Welding / Fabrication"],
  },
  {
    name: "Hydraulic & pneumatic systems",
    category: "Mechanical",
    blurb: "Cylinder sizing, circuit design and actuation for powered rigs.",
    tags: ["Mechanical", "CAD"],
  },
  {
    name: "Mechanisms & linkages",
    category: "Mechanical",
    blurb: "Four-bar, cam, rack-and-pinion and gear trains, motion-checked in CAD.",
    tags: ["Mechanical", "CAD"],
  },
  {
    name: "Material-handling systems",
    category: "Mechanical",
    blurb: "Trolleys, hoists, lifts and loaders designed around the load path.",
    tags: ["Mechanical", "ANSYS", "Welding / Fabrication"],
  },
  {
    name: "Machine prototypes",
    category: "Mechanical",
    blurb: "First-off working units built to prove a concept physically.",
    tags: ["Mechanical", "Welding / Fabrication"],
  },

  // Electrical
  {
    name: "Solar systems",
    category: "Electrical",
    blurb: "Load audit, panel and battery sizing, charge control and wiring.",
    tags: ["Electrical", "Solar"],
  },
  {
    name: "Power systems",
    category: "Electrical",
    blurb: "Inverters, changeover units, protection and distribution boards.",
    tags: ["Electrical", "Solar"],
  },
  {
    name: "Embedded electronics",
    category: "Electrical",
    blurb: "Arduino, ESP32 and STM32 builds with sensors and drivers.",
    tags: ["Electrical", "Electronics", "Robotics"],
  },
  {
    name: "Control systems",
    category: "Electrical",
    blurb: "Open and closed-loop control, PID tuning and instrumentation.",
    tags: ["Electrical", "Robotics"],
  },
  {
    name: "Circuit projects",
    category: "Electrical",
    blurb: "Analogue and digital circuits, simulated then built and measured.",
    tags: ["Electrical", "Electronics"],
  },
  {
    name: "IoT devices",
    category: "Electrical",
    blurb: "Connected sensing nodes with dashboards and remote logging.",
    tags: ["Electrical", "AI", "Electronics"],
  },
  {
    name: "PCB & soldering work",
    category: "Electrical",
    blurb: "Schematic capture, board layout, assembly and rework.",
    tags: ["Electronics", "Electrical"],
  },

  // AI / Software
  {
    name: "AI-powered devices",
    category: "AI / Software",
    blurb: "Physical products with a model doing the decision-making on board.",
    tags: ["AI", "Electronics", "Robotics"],
  },
  {
    name: "Computer vision",
    category: "AI / Software",
    blurb: "Detection, classification and inspection pipelines on real images.",
    tags: ["AI"],
  },
  {
    name: "Machine learning",
    category: "AI / Software",
    blurb: "Dataset preparation, training, evaluation and honest error analysis.",
    tags: ["AI"],
  },
  {
    name: "Automation software",
    category: "AI / Software",
    blurb: "Scripts, schedulers and interfaces that remove a manual loop.",
    tags: ["AI", "Other"],
  },
  {
    name: "Intelligent systems",
    category: "AI / Software",
    blurb: "Rule-based and learned systems wired into hardware and dashboards.",
    tags: ["AI", "Robotics"],
  },

  // Robotics
  {
    name: "Robotic arms",
    category: "Robotics",
    blurb: "Multi-axis arms: kinematics, structure, actuation and control.",
    tags: ["Robotics", "Mechanical", "CAD"],
  },
  {
    name: "Autonomous systems",
    category: "Robotics",
    blurb: "Line-following, obstacle-avoiding and mapping platforms.",
    tags: ["Robotics", "AI"],
  },
  {
    name: "Sensor-based robots",
    category: "Robotics",
    blurb: "Ultrasonic, IR, IMU and vision-driven behaviour.",
    tags: ["Robotics", "Electronics"],
  },
  {
    name: "Arduino / ESP32 projects",
    category: "Robotics",
    blurb: "Microcontroller builds from breadboard to finished enclosure.",
    tags: ["Robotics", "Electronics", "Electrical"],
  },
  {
    name: "Mechatronic systems",
    category: "Robotics",
    blurb: "Integrated mechanical, electrical and software subsystems.",
    tags: ["Robotics", "Mechanical", "Electrical"],
  },

  // CAD / Simulation
  {
    name: "SolidWorks / Fusion / AutoCAD",
    category: "CAD / Simulation",
    blurb: "Parts, assemblies, drawings and manufacturing-ready documentation.",
    tags: ["CAD", "Mechanical"],
  },
  {
    name: "Mechanical modelling",
    category: "CAD / Simulation",
    blurb: "Full 3D models with tolerances, fasteners and exploded views.",
    tags: ["CAD", "Mechanical"],
  },
  {
    name: "ANSYS analysis",
    category: "CAD / Simulation",
    blurb: "Meshing, boundary conditions, solve and results interpretation.",
    tags: ["ANSYS", "CAD"],
  },
  {
    name: "CFD",
    category: "CAD / Simulation",
    blurb: "Internal and external flow, pressure drop and velocity fields.",
    tags: ["ANSYS", "CAD"],
  },
  {
    name: "Structural analysis",
    category: "CAD / Simulation",
    blurb: "Stress, deflection and factor-of-safety checks on your geometry.",
    tags: ["ANSYS", "Mechanical"],
  },
  {
    name: "Thermal analysis",
    category: "CAD / Simulation",
    blurb: "Conduction, convection and steady-state or transient thermal runs.",
    tags: ["ANSYS", "CAD"],
  },

  // Fabrication
  {
    name: "Welding",
    category: "Fabrication",
    blurb: "Arc and gas welding on mild steel, stainless and section work.",
    tags: ["Welding / Fabrication", "Mechanical"],
  },
  {
    name: "Metal fabrication",
    category: "Fabrication",
    blurb: "Cutting, bending, drilling and finishing to a drawing.",
    tags: ["Welding / Fabrication", "Mechanical"],
  },
  {
    name: "Prototyping",
    category: "Fabrication",
    blurb: "Fast first builds to find out what the drawing got wrong.",
    tags: ["Welding / Fabrication", "Mechanical", "Other"],
  },
  {
    name: "Assembly & machining",
    category: "Fabrication",
    blurb: "Turning, milling, fitting and final assembly of the unit.",
    tags: ["Welding / Fabrication", "Mechanical"],
  },
  {
    name: "Material sourcing",
    category: "Fabrication",
    blurb: "Finding the stock, sections and components locally, at real prices.",
    tags: ["Other", "Welding / Fabrication"],
  },
  {
    name: "Testing & troubleshooting",
    category: "Fabrication",
    blurb: "Commissioning, measurement, fault-finding and iteration.",
    tags: ["Other", "Mechanical", "Electrical"],
  },
];

/**
 * Photography for the capability cards, keyed by `BuildItem.name`.
 *
 * `id` is the path segment on images.unsplash.com — every one is a free
 * Unsplash License photo. Unsplash+ (plus.unsplash.com / `premium_photo-*`) is a
 * paid licence and must never be used here. `alt` is the photographer's own
 * description, so it stays accurate if a photo is swapped.
 */
export const buildImages: Record<string, { id: string; alt: string }> = {
  "Automated machines": {
    id: "photo-1717386255773-a456c611dc4e",
    alt: "A control panel with a touchscreen on an industrial manufacturing machine in a factory",
  },
  "Graters & milling units": {
    id: "photo-1785268051248-30956986542e",
    alt: "An old wooden grain mill with metal components",
  },
  Presses: {
    id: "photo-1764114902604-2b291087fe26",
    alt: "Large industrial metal shearing machine in a workshop",
  },
  Conveyors: {
    id: "photo-1684695747561-9372850cf165",
    alt: "A conveyor belt in a large warehouse",
  },
  "Hydraulic & pneumatic systems": {
    id: "photo-1753775851957-cd7f43c7a299",
    alt: "An industrial pneumatic cylinder with gauges",
  },
  "Mechanisms & linkages": {
    id: "photo-1593062037896-764e9f52029e",
    alt: "Cogs and gears",
  },
  "Material-handling systems": {
    id: "photo-1645736315000-6f788915923b",
    alt: "A forklift driving through a warehouse filled with pallets",
  },
  "Machine prototypes": {
    id: "photo-1787039467622-ddec5c24320c",
    alt: "CNC machines and metalworking tools in a bright industrial manufacturing workshop",
  },
  "Solar systems": {
    id: "photo-1707247111552-aaf74241058b",
    alt: "A large amount of solar panels on the roof of a building",
  },
  "Power systems": {
    id: "photo-1635335874521-7987db781153",
    alt: "A bunch of wires are plugged into a switch box",
  },
  "Embedded electronics": {
    id: "photo-1555664424-778a1e5e1b48",
    alt: "Flat lay photography of circuit board",
  },
  "Control systems": {
    id: "photo-1544724569-5f546fd6f2b5",
    alt: "An electrical switch box with circuit breakers and colorful wiring in a control panel",
  },
  "Circuit projects": {
    id: "photo-1651340741844-48edcd3fe79c",
    alt: "A circuit board with many small components",
  },
  "IoT devices": {
    id: "photo-1640955785023-1854685dae05",
    alt: "Tweezers placing a small black microchip onto a green circuit board",
  },
  "PCB & soldering work": {
    id: "photo-1767448068187-5be3cbc848c7",
    alt: "Black fpv soldering pcb practice board",
  },
  "AI-powered devices": {
    id: "photo-1675602488512-bdd631490fcb",
    alt: "A close up of a computer chip on a printed circuit board",
  },
  "Computer vision": {
    id: "photo-1720958371916-03809cae5cc5",
    alt: "A close up of a camera lens with a blurry background",
  },
  "Machine learning": {
    id: "photo-1551288049-bebda4e38f71",
    alt: "Graphs of performance analytics on a laptop screen",
  },
  "Automation software": {
    id: "photo-1614741118887-7a4ee193a5fa",
    alt: "A computer monitor and laptop displaying code and a programming tutorial",
  },
  "Intelligent systems": {
    id: "photo-1518186285589-2f7649de83e0",
    alt: "A computer screen displaying a white line graph of data",
  },
  "Robotic arms": {
    id: "photo-1716191299980-a6e8827ba10b",
    alt: "Blue industrial robot arm in a factory",
  },
  "Autonomous systems": {
    id: "photo-1769839272014-089cd3bbc274",
    alt: "Several blue robotic vehicles with wheels lined up",
  },
  "Sensor-based robots": {
    id: "photo-1678225867994-e7a5b071ebfd",
    alt: "A small robot car with wheels and wires attached to it",
  },
  "Arduino / ESP32 projects": {
    id: "photo-1631378297854-185cff6b0986",
    alt: "A close up of a board with wires attached to it",
  },
  "Mechatronic systems": {
    id: "photo-1567789884554-0b844b597180",
    alt: "A vehicle being assembled inside a factory by robot machines",
  },
  "SolidWorks / Fusion / AutoCAD": {
    id: "photo-1769149068959-b11392164add",
    alt: "A person looking at a design on a computer screen",
  },
  "Mechanical modelling": {
    id: "photo-1581092160562-40aa08e78837",
    alt: "A person using a caliper to measure technical engineering drawings on a desk",
  },
  "ANSYS analysis": {
    id: "photo-1769120062502-81a154df0960",
    alt: "Wireframe shape with a grid pattern",
  },
  CFD: {
    id: "photo-1585644156378-72d15fa33be5",
    alt: "Dense white smoke swirling against a dark background",
  },
  "Structural analysis": {
    id: "photo-1745162391671-244e8d3ccd5f",
    alt: "Steel beams and roofing in a modern construction",
  },
  "Thermal analysis": {
    id: "photo-1613970351372-9804e380bd09",
    alt: "Molten metal pouring from a furnace into a large industrial ladle",
  },
  Welding: {
    id: "photo-1598302936625-6075fbd98dd7",
    alt: "A person wearing a welding helmet grinding a metal beam with sparks flying",
  },
  "Metal fabrication": {
    id: "photo-1786348931227-4f8b7f9c75bb",
    alt: "A person using an angle grinder to cut metal, creating bright orange sparks",
  },
  Prototyping: {
    id: "photo-1611117775350-ac3950990985",
    alt: "A row of 3D printers creating blue plastic cylinders on a workbench",
  },
  "Assembly & machining": {
    id: "photo-1666634157070-6fd830fb5672",
    alt: "A metal rod held in a lathe chuck being machined by a cutting tool",
  },
  "Material sourcing": {
    id: "photo-1763926025477-423847028860",
    alt: "Shelves filled with metal bars and rods",
  },
  "Testing & troubleshooting": {
    id: "photo-1517420704952-d9f39e95b43e",
    alt: "Electronic circuit boards beside a tester",
  },
};

/** Builds a sized, format-negotiated URL for a capability photo. */
export function buildImageUrl(id: string, width = 640): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=70`;
}

/* -------------------------------------------------------------------------- */

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  detail: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Tell us what you're building",
    body: "Upload your brief or describe the project in your own words.",
    detail: ["Project brief", "Supervisor requirements", "Deadline"],
  },
  {
    number: "02",
    title: "We break it down",
    body: "We identify components, materials, engineering requirements and the parts most likely to give trouble.",
    detail: ["Bill of materials", "Engineering scope", "Risk list"],
  },
  {
    number: "03",
    title: "Get an estimate",
    body: "A preliminary estimate covering materials, workmanship and timeline — so you know what you are walking into.",
    detail: ["Materials", "Workmanship", "Timeline"],
  },
  {
    number: "04",
    title: "We build",
    body: "Design, simulation, fabrication, assembly and testing. This is the part that gets our hands dirty.",
    detail: ["CAD & analysis", "Fabrication", "Assembly & testing"],
  },
  {
    number: "05",
    title: "You receive the result",
    body: "A functional project or prototype, the technical documentation behind it, and support while you present it.",
    detail: ["Working unit", "Drawings & data", "Handover support"],
  },
];

/* -------------------------------------------------------------------------- */

export type SampleProject = {
  ref: string;
  type: string;
  title: string;
  /** What such a build would consist of — not a record of one that happened. */
  scope: string;
  skills: string[];
  spec: { label: string; value: string }[];
};

/**
 * Illustrative examples of the kind of project this studio is set up for.
 *
 * NOT a portfolio. Nothing here has been built, so every surface that renders
 * these must say so — no job numbers, no past tense, no "selected work". Once
 * real builds exist they can replace these entries, and the copy in
 * `showcase.tsx` should change with them.
 */
export const sampleProjects: SampleProject[] = [
  {
    ref: "Sample 01",
    type: "Renewable energy",
    title: "Standalone solar power bench",
    scope:
      "A load-audited solar bench with panel array, charge controller, battery bank and a metered distribution board for laboratory demonstration.",
    skills: ["Load audit", "Panel sizing", "Wiring", "Metering"],
    spec: [
      { label: "Discipline", value: "Electrical" },
      { label: "Typical build time", value: "5 weeks" },
      { label: "Deliverable", value: "Working rig + data" },
    ],
  },
  {
    ref: "Sample 02",
    type: "Automated machine",
    title: "Motorised cassava grating unit",
    scope:
      "Driven grating drum, welded mild-steel frame, guarded belt drive and a hopper sized to a target throughput.",
    skills: ["Welding", "Drive design", "Fabrication", "Testing"],
    spec: [
      { label: "Discipline", value: "Mechanical" },
      { label: "Typical build time", value: "6 weeks" },
      { label: "Deliverable", value: "Functional machine" },
    ],
  },
  {
    ref: "Sample 03",
    type: "CAD & simulation",
    title: "Structural analysis of a lifting frame",
    scope:
      "Full parametric model, static structural study in ANSYS, mesh convergence check and a factor-of-safety report against the design load.",
    skills: ["SolidWorks", "ANSYS", "Meshing", "Reporting"],
    spec: [
      { label: "Discipline", value: "Mechanical" },
      { label: "Typical build time", value: "2 weeks" },
      { label: "Deliverable", value: "Model + analysis report" },
    ],
  },
  {
    ref: "Sample 04",
    type: "Robotics",
    title: "4-axis pick-and-place arm",
    scope:
      "Servo-driven arm with 3D-printed links, inverse-kinematics firmware and a repeatability test across a fixed pick grid.",
    skills: ["Kinematics", "Firmware", "3D printing", "Control"],
    spec: [
      { label: "Discipline", value: "Mechatronics" },
      { label: "Typical build time", value: "5 weeks" },
      { label: "Deliverable", value: "Working prototype" },
    ],
  },
  {
    ref: "Sample 05",
    type: "AI-powered device",
    title: "Vision-based sorting station",
    scope:
      "Camera module, on-device classifier and a solenoid diverter, with a labelled dataset and a confusion matrix to evaluate it.",
    skills: ["Computer vision", "Embedded", "Actuation", "Evaluation"],
    spec: [
      { label: "Discipline", value: "Computer / Mechatronics" },
      { label: "Typical build time", value: "6 weeks" },
      { label: "Deliverable", value: "Device + dataset" },
    ],
  },
  {
    ref: "Sample 06",
    type: "Fabrication",
    title: "Hydraulic bench press frame",
    scope:
      "Welded box-section frame with a bottle jack actuator, bolted platen and a deflection check under rated load.",
    skills: ["Welding", "Frame design", "Load testing", "Finishing"],
    spec: [
      { label: "Discipline", value: "Mechanical" },
      { label: "Typical build time", value: "3 weeks" },
      { label: "Deliverable", value: "Fabricated unit" },
    ],
  },
];

/* -------------------------------------------------------------------------- */

/**
 * The university whose students the studio primarily works with. The crest is a
 * marker of who the service is for, not a claim of endorsement — anywhere it is
 * shown, `independenceNote` has to be shown with it.
 */
export const servedUniversity = {
  name: "Lagos State University",
  crest: "/lasu-crest.png",
  crestWidth: 235,
  crestHeight: 243,
  independenceNote:
    "Independent studio — not affiliated with or endorsed by the university.",
};

/* -------------------------------------------------------------------------- */

/** Selectable service cards on the onboarding form. */
export const serviceOptions = [
  "Full Project Build",
  "Custom Build",
  "CAD / Design",
  "ANSYS / Simulation",
  "Fabrication / Welding",
  "Electronics / Soldering",
  "AI / Robotics",
  "Research & Technical Collaboration",
  "Material Sourcing",
  "Other",
] as const;

export const complexityOptions = [
  "Not sure yet",
  "Straightforward",
  "Moderate",
  "Advanced",
  "Very complex",
] as const;

export const aboutCapabilities = [
  "CAD",
  "ANSYS",
  "Mechanical design",
  "Fabrication",
  "Welding",
  "Prototyping",
  "Robotics",
  "Electronics",
  "Solar systems",
  "AI-powered engineering projects",
  "Full-stack web development",
];
