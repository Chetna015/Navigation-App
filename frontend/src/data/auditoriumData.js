// CSJMU Smart Auditorium & AI Summit 2026 Comprehensive Dataset

export const SBM_INDOOR_DATA = {
  buildingName: "School of Business Management (SBM)",
  buildingCode: "SBM-MAIN",
  lat: 26.503022,
  lng: 80.266371,
  totalFloors: 3,
  description: "Primary venue for AI Summit 2026 Workshops, Startup Keynotes, Smart Classrooms & High-Performance Computing Labs.",
  floors: [
    {
      id: "ground",
      name: "Ground Floor (L0)",
      level: 0,
      corridorName: "Central Atrium & Main Entry Corridor",
      corridorLengthMeters: 180,
      image: "/assets/buildings/watercooler_ro.jpg",
      rooms: [
        {
          id: "SBM-01",
          name: "SBM-01: AI Keynote & Inauguration Hall",
          type: "Hall / Auditorium",
          capacity: "250 Seats",
          equipment: "Dual 4K Laser Projectors, Surround Sound, AI Live Translation",
          currentEvent: "Opening Ceremony & GenAI Keynote by Tech Leaders",
          floor: "Ground Floor",
          coordinates: { x: 120, y: 140 },
          status: "Active Session",
          tags: ["Keynote", "Hall", "Main Event"]
        },
        {
          id: "SBM-02",
          name: "SBM-02: Smart Classroom - Machine Learning Lab",
          type: "Classroom / Lab",
          capacity: "60 Seats",
          equipment: "Interactive Smart Boards, 30 Workstations",
          currentEvent: "Hands-on PyTorch & LLM Fine-Tuning Workshop",
          floor: "Ground Floor",
          coordinates: { x: 300, y: 140 },
          status: "Workshop Live",
          tags: ["Classroom", "Lab", "ML"]
        },
        {
          id: "SBM-03",
          name: "SBM-03: MBA Lecture Theatre 1",
          type: "Lecture Theatre",
          capacity: "120 Seats",
          equipment: "Tiered Seating, Smart Podiums, Audio Capture",
          currentEvent: "AI in Business Analytics Panel Discussion",
          floor: "Ground Floor",
          coordinates: { x: 480, y: 140 },
          status: "Scheduled (02:00 PM)",
          tags: ["Classroom", "MBA", "Lecture"]
        },
        {
          id: "SBM-04",
          name: "SBM-04: Digital Twin & Robotics Demo Room",
          type: "Special Lab",
          capacity: "45 Seats",
          equipment: "Quadruped Robots, LiDAR Scanners, VR Headsets",
          currentEvent: "Autonomous Navigation & Smart Campus Demos",
          floor: "Ground Floor",
          coordinates: { x: 640, y: 140 },
          status: "Open Exhibition",
          tags: ["Robotics", "Digital Twin", "Demo"]
        },
        {
          id: "SBM-05",
          name: "SBM-05: Faculty Research & Dean Secretariat",
          type: "Admin & Offices",
          capacity: "20 Seats",
          equipment: "Meeting Tables, Administrative Workstations",
          currentEvent: "VIP Delegate Reception & Lounge",
          floor: "Ground Floor",
          coordinates: { x: 800, y: 140 },
          status: "Faculty Only",
          tags: ["Office", "VIP", "Faculty"]
        }
      ],
      waterCoolers: [
        {
          id: "SBM-WC-01",
          name: "SBM Water Cooler #1 (Central Atrium RO Station)",
          type: "Heavy-Duty 5-Stage RO + UV Purifier",
          temperature: "6.0°C (Ice-Cold)",
          purity: "99.9% Purified",
          capacity: "80 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_ro.jpg",
          locationDescription: "Ground Floor Central Atrium near SBM-02 ML Lab Entrance",
          coordinates: { x: 390, y: 220 },
          features: ["Touchless Hydration", "Digital Temperature Screen", "Chilled Cold Taps", "Bottles Saved: 3,420"]
        },
        {
          id: "SBM-WC-02",
          name: "SBM Water Cooler #2 (West Entrance Smart Hydration)",
          type: "Smart Touchless Water Refill Station",
          temperature: "5.8°C (Cold)",
          purity: "99.8% Purified",
          capacity: "60 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_touchless.jpg",
          locationDescription: "Ground Floor West Gate Entrance Corridor next to Main Staircase A",
          coordinates: { x: 180, y: 220 },
          features: ["Touchless Sensor", "Filter Status Gauge", "Eco Bottle Counter (1,738 Saved)"]
        }
      ],
      corridors: [
        {
          id: "CORR-G01",
          name: "Main Ground Floor Central Marble Corridor",
          widthMeters: 4.5,
          pathPoints: [{ x: 80, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 }, { x: 750, y: 220 }, { x: 880, y: 220 }],
          description: "Main arterial walkway connecting SBM West Gate, Central Atrium, and East Fire Exit."
        }
      ],
      amenities: [
        { id: "STAIR-GA", name: "Staircase Alpha (West)", type: "Stairs", coordinates: { x: 90, y: 260 } },
        { id: "STAIR-GB", name: "Staircase Beta (East)", type: "Stairs", coordinates: { x: 860, y: 260 } },
        { id: "ELEV-G1", name: "Elevator Lobby (Central)", type: "Elevator", coordinates: { x: 490, y: 260 } },
        { id: "WASH-G1", name: "Restrooms (Gents & Ladies)", type: "Washroom", coordinates: { x: 720, y: 260 } },
        { id: "EXIT-G1", name: "Emergency Fire Exit Corridor Path", type: "Exit", coordinates: { x: 920, y: 220 } }
      ]
    },
    {
      id: "floor1",
      name: "First Floor (L1)",
      level: 1,
      corridorName: "1st Floor Academic Gallery & GPU Lab Corridor",
      corridorLengthMeters: 180,
      image: "/assets/buildings/watercooler_touchless.jpg",
      rooms: [
        {
          id: "SBM-101",
          name: "SBM-101: Executive MBA Smart Classroom",
          type: "Classroom",
          capacity: "75 Seats",
          equipment: "Dual Smart Displays, Hybrid Video Conferencing",
          currentEvent: "Executive AI Leadership Track",
          floor: "First Floor",
          coordinates: { x: 120, y: 140 },
          status: "In Use",
          tags: ["Executive", "Classroom"]
        },
        {
          id: "SBM-102",
          name: "SBM-102: Deep Learning & Data Science Computer Lab",
          type: "High-Performance GPU Lab",
          capacity: "60 High-End Workstations",
          equipment: "NVIDIA RTX 4090 GPUs, High-Speed Fiber Mesh",
          currentEvent: "AI Hackathon Model Training & Evaluation",
          floor: "First Floor",
          coordinates: { x: 300, y: 140 },
          status: "Hackathon Active",
          tags: ["GPU", "Lab", "Hackathon", "AI"]
        },
        {
          id: "SBM-103",
          name: "SBM-103: AI Summit Startup Pitch Arena",
          type: "Pitch Auditorium",
          capacity: "150 Seats",
          equipment: "Stage Lighting, Investor Panel Mic System",
          currentEvent: "Venture Capital Pitch Presentations",
          floor: "First Floor",
          coordinates: { x: 480, y: 140 },
          status: "Live Pitches",
          tags: ["Startup", "Pitch", "Arena"]
        },
        {
          id: "SBM-104",
          name: "SBM-104: Seminar Hall & Industry Workshop",
          type: "Seminar Room",
          capacity: "90 Seats",
          equipment: "Acoustic Wall Panels, Projection Array",
          currentEvent: "Cloud AI Infrastructure Workshop",
          floor: "First Floor",
          coordinates: { x: 640, y: 140 },
          status: "Scheduled",
          tags: ["Seminar", "Workshop"]
        },
        {
          id: "SBM-105",
          name: "SBM-105: HOD & Academic Affairs Office",
          type: "Admin Office",
          capacity: "15 Seats",
          equipment: "Conference Desk, Secretariat Computers",
          currentEvent: "Academic Coordination",
          floor: "First Floor",
          coordinates: { x: 800, y: 140 },
          status: "Open",
          tags: ["Office", "Admin"]
        }
      ],
      waterCoolers: [
        {
          id: "SBM-WC-03",
          name: "SBM Water Cooler #3 (1st Floor North Gallery)",
          type: "Cold RO Drinking Water Station",
          temperature: "6.2°C (Cold)",
          purity: "99.7% Purified",
          capacity: "60 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_ro.jpg",
          locationDescription: "First Floor Gallery Corridor near SBM-102 GPU Lab",
          coordinates: { x: 350, y: 220 },
          features: ["Dual Taps", "Stainless Steel Basin", "RO Purified Water"]
        },
        {
          id: "SBM-WC-04",
          name: "SBM Water Cooler #4 (East Faculty Lounge Hydration)",
          type: "Smart Touchless Water Dispenser",
          temperature: "5.5°C (Ice-Cold)",
          purity: "100.0% Purified",
          capacity: "50 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_touchless.jpg",
          locationDescription: "First Floor East Wing Faculty Lounge Passage",
          coordinates: { x: 750, y: 220 },
          features: ["Touchless Sensor", "UV Sterilizer", "Filter OK Indicator"]
        }
      ],
      corridors: [
        {
          id: "CORR-F01",
          name: "1st Floor Glass-Rail Gallery Corridor Path",
          widthMeters: 3.8,
          pathPoints: [{ x: 80, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 }, { x: 750, y: 220 }, { x: 880, y: 220 }],
          description: "Upper level balcony corridor path with glass railings overlooking Ground Floor Atrium."
        }
      ],
      amenities: [
        { id: "STAIR-F1A", name: "Staircase Alpha (West)", type: "Stairs", coordinates: { x: 90, y: 260 } },
        { id: "STAIR-F1B", name: "Staircase Beta (East)", type: "Stairs", coordinates: { x: 860, y: 260 } },
        { id: "ELEV-F1", name: "Elevator Lobby (Level 1)", type: "Elevator", coordinates: { x: 490, y: 260 } },
        { id: "WASH-F1", name: "1st Floor Restrooms", type: "Washroom", coordinates: { x: 720, y: 260 } }
      ]
    },
    {
      id: "floor2",
      name: "Second Floor (L2)",
      level: 2,
      corridorName: "2nd Floor GenAI Incubator & Executive Suite Walkway",
      corridorLengthMeters: 180,
      image: "/assets/buildings/watercooler_touchless.jpg",
      rooms: [
        {
          id: "SBM-201",
          name: "SBM-201: Generative AI & NLP Incubator Lab",
          type: "Incubator Lab",
          capacity: "40 Innovators",
          equipment: "High-density compute nodes, private cloud cluster access",
          currentEvent: "Incubator Startup Speed Mentoring",
          floor: "Second Floor",
          coordinates: { x: 160, y: 140 },
          status: "Incubation Live",
          tags: ["GenAI", "Incubator", "Lab"]
        },
        {
          id: "SBM-202",
          name: "SBM-202: Student Innovation Hub & AI Hackathon Base",
          type: "Innovation Hub",
          capacity: "80 Seats",
          equipment: "Modular Whiteboards, 3D Printers, High-speed Wifi",
          currentEvent: "24-Hour AI Summit Student Hackathon",
          floor: "Second Floor",
          coordinates: { x: 400, y: 140 },
          status: "Hackathon Active",
          tags: ["Hackathon", "Student", "Hub"]
        },
        {
          id: "SBM-203",
          name: "SBM-203: Conference Room Alpha (Board Room)",
          type: "Board Room",
          capacity: "30 Seats",
          equipment: "Executive Leather Seating, Video Wall, VC Suite",
          currentEvent: "Industry Advisory Board Meeting",
          floor: "Second Floor",
          coordinates: { x: 640, y: 140 },
          status: "Board Meeting",
          tags: ["Conference", "Boardroom"]
        },
        {
          id: "SBM-204",
          name: "SBM-204: Ph.D. Scholar Research Workstations",
          type: "Research Room",
          capacity: "25 Cubicles",
          equipment: "Dedicated Workstations, Academic Journals DB",
          currentEvent: "Paper Presentation Sessions",
          floor: "Second Floor",
          coordinates: { x: 820, y: 140 },
          status: "Research Active",
          tags: ["Research", "Ph.D."]
        }
      ],
      waterCoolers: [
        {
          id: "SBM-WC-05",
          name: "SBM Water Cooler #5 (2nd Floor Smart Touchless Dispenser)",
          type: "Smart Touchless Water Station",
          temperature: "5.8°C (Ice-Cold)",
          purity: "99.9% Purified",
          capacity: "50 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_touchless.jpg",
          locationDescription: "Second Floor Corridor between Incubator SBM-201 and Hackathon Hub SBM-202",
          coordinates: { x: 280, y: 220 },
          features: ["Touchless Hydration", "Digital Temp Display", "Eco Sensor"]
        }
      ],
      corridors: [
        {
          id: "CORR-S01",
          name: "2nd Floor Executive Corridor Path",
          widthMeters: 3.5,
          pathPoints: [{ x: 80, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 }, { x: 750, y: 220 }, { x: 880, y: 220 }],
          description: "High-level corridor connecting Innovation Hub and Board Rooms."
        }
      ],
      amenities: [
        { id: "STAIR-F2A", name: "Staircase Alpha (West)", type: "Stairs", coordinates: { x: 90, y: 260 } },
        { id: "STAIR-F2B", name: "Staircase Beta (East)", type: "Stairs", coordinates: { x: 860, y: 260 } },
        { id: "ELEV-F2", name: "Elevator Lobby (Level 2)", type: "Elevator", coordinates: { x: 490, y: 260 } }
      ]
    }
  ]
};

export const AUDITORIUM_INDOOR_DATA = {
  buildingName: "CSJM Auditorium",
  buildingCode: "AUD-MAIN",
  lat: 26.504193,
  lng: 80.268463,
  totalFloors: 2,
  description: "1,500-seat Plenary Auditorium Hall, Exhibition Arena & AI Summit Hub.",
  floors: [
    {
      id: "ground",
      name: "Ground Floor (L0)",
      level: 0,
      corridorName: "Main Entrance & Exhibition Corridor",
      corridorLengthMeters: 150,
      image: "/assets/buildings/auditorium.jpg",
      rooms: [
        {
          id: "AUD-01",
          name: "AUD-01: Plenary Auditorium Hall",
          type: "Hall / Auditorium",
          capacity: "1,500 Seats",
          equipment: "4K Laser Projection, Dolby Atmos Surround Sound",
          currentEvent: "Summit Plenary & Keynotes",
          floor: "Ground Floor",
          coordinates: { x: 300, y: 140 },
          status: "In Use",
          tags: ["Keynote", "Plenary", "Auditorium"]
        },
        {
          id: "AUD-02",
          name: "AUD-02: VIP Lounge",
          type: "VIP Lounge",
          capacity: "50 Seats",
          equipment: "Premium Seating, Dining Area, VC Facilities",
          currentEvent: "VC & Speaker Private Networking",
          floor: "Ground Floor",
          coordinates: { x: 480, y: 140 },
          status: "VIP Only",
          tags: ["VIP", "Lounge"]
        },
        {
          id: "AUD-03",
          name: "AUD-03: Startup Exhibition Hall",
          type: "Exhibition Hall",
          capacity: "500 Visitors",
          equipment: "Booths S01-S20, Digital displays",
          currentEvent: "AI Summit Startup Exhibition",
          floor: "Ground Floor",
          coordinates: { x: 640, y: 140 },
          status: "Open to All",
          tags: ["Exhibition", "Startup"]
        },
        {
          id: "AUD-04",
          name: "AUD-04: Registration & Desk Area",
          type: "Registration Hall",
          capacity: "100 Visitors",
          equipment: "RFID check-in desk, badge scanners",
          currentEvent: "AI Summit Delegate Registrations",
          floor: "Ground Floor",
          coordinates: { x: 120, y: 140 },
          status: "Active Registration",
          tags: ["Registration", "Help Desk"]
        },
        {
          id: "AUD-05",
          name: "AUD-05: Press & Media Center",
          type: "Media Center",
          capacity: "40 Seats",
          equipment: "Broadcast cameras, editing rigs, high-speed fiber",
          currentEvent: "Press Briefings & Interviews",
          floor: "Ground Floor",
          coordinates: { x: 800, y: 140 },
          status: "Media Only",
          tags: ["Media", "Press"]
        }
      ],
      waterCoolers: [
        {
          id: "AUD-WC-01",
          name: "Auditorium Water Cooler #1 (Main Foyer RO)",
          type: "Touchless Smart Refill Station",
          temperature: "6.1°C (Chilled)",
          purity: "99.9% Purified",
          capacity: "80 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_touchless.jpg",
          locationDescription: "Main Foyer near AUD-04 Registration Desk",
          coordinates: { x: 200, y: 220 },
          features: ["Touchless Hydration", "Digital Temp Display", "Eco Counter (2,400 saved)"]
        },
        {
          id: "AUD-WC-02",
          name: "Auditorium Water Cooler #2 (VIP Corridor RO)",
          type: "Alkaline RO Water System",
          temperature: "5.8°C (Cold)",
          purity: "100.0% Purified",
          capacity: "40 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_ro.jpg",
          locationDescription: "VIP Lounge East Corridor passage",
          coordinates: { x: 550, y: 220 },
          features: ["Double Cup Dispenser", "Mineral Booster", "Cold Taps"]
        }
      ],
      corridors: [
        {
          id: "CORR-AUD01",
          name: "Auditorium Main Lobby Corridor Walkway",
          widthMeters: 5.0,
          pathPoints: [{ x: 80, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 }, { x: 750, y: 220 }, { x: 880, y: 220 }],
          description: "Main Foyer walkway connecting Entrance, Auditorium Hall, and Exit."
        }
      ],
      amenities: [
        { id: "STAIR-AUD-A", name: "Staircase Alpha (West)", type: "Stairs", coordinates: { x: 90, y: 260 } },
        { id: "STAIR-AUD-B", name: "Staircase Beta (East)", type: "Stairs", coordinates: { x: 860, y: 260 } },
        { id: "ELEV-AUD1", name: "Elevator Lobby (Central)", type: "Elevator", coordinates: { x: 490, y: 260 } },
        { id: "WASH-AUD1", name: "Restrooms (Gents & Ladies)", type: "Washroom", coordinates: { x: 720, y: 260 } },
        { id: "EXIT-AUD1", name: "Main Entrance Doors", type: "Exit", coordinates: { x: 920, y: 220 } }
      ]
    },
    {
      id: "floor1",
      name: "First Floor (L1)",
      level: 1,
      corridorName: "Auditorium Balcony & Tech Booth Gallery",
      corridorLengthMeters: 150,
      image: "/assets/buildings/watercooler_touchless.jpg",
      rooms: [
        {
          id: "AUD-101",
          name: "AUD-101: Balcony Seating Area",
          type: "Seating Gallery",
          capacity: "400 Seats",
          equipment: "Tiered seating, safety glass rails",
          currentEvent: "Summit Plenary Session View",
          floor: "First Floor",
          coordinates: { x: 200, y: 140 },
          status: "Open",
          tags: ["Balcony", "Seating"]
        },
        {
          id: "AUD-102",
          name: "AUD-102: Tech Control Room & Translation Hub",
          type: "Control Room",
          capacity: "15 Techs",
          equipment: "A/V mixing desks, live translation consoles",
          currentEvent: "Live translation & video mixing",
          floor: "First Floor",
          coordinates: { x: 500, y: 140 },
          status: "Authorized Only",
          tags: ["Control", "Translation"]
        },
        {
          id: "AUD-103",
          name: "AUD-103: Green Room (VIP Speakers)",
          type: "Green Room",
          capacity: "20 Seats",
          equipment: "Lounge seating, mirrors, restrooms",
          currentEvent: "Speaker preparation & briefing",
          floor: "First Floor",
          coordinates: { x: 750, y: 140 },
          status: "Speakers Only",
          tags: ["Green Room", "Speakers"]
        }
      ],
      waterCoolers: [
        {
          id: "AUD-WC-03",
          name: "Auditorium Water Cooler #3 (Balcony Passage RO)",
          type: "Standard RO Dispenser",
          temperature: "6.0°C (Cold)",
          purity: "99.8% Purified",
          capacity: "50 Litres/Hr",
          status: "Operational • Active",
          image: "/assets/buildings/watercooler_ro.jpg",
          locationDescription: "First Floor Balcony Left Entrance",
          coordinates: { x: 350, y: 220 },
          features: ["Disposable Cup Holder", "Fast Refill Basin"]
        }
      ],
      corridors: [
        {
          id: "CORR-AUD101",
          name: "First Floor Balcony Walkway",
          widthMeters: 4.0,
          pathPoints: [{ x: 80, y: 220 }, { x: 300, y: 220 }, { x: 500, y: 220 }, { x: 750, y: 220 }, { x: 880, y: 220 }],
          description: "Upper balcony corridor path connecting seating area, control booth, and green room."
        }
      ],
      amenities: [
        { id: "STAIR-AUD1A", name: "Staircase Alpha (West)", type: "Stairs", coordinates: { x: 90, y: 260 } },
        { id: "STAIR-AUD1B", name: "Staircase Beta (East)", type: "Stairs", coordinates: { x: 860, y: 260 } },
        { id: "ELEV-AUD2", name: "Elevator Lobby (First Floor)", type: "Elevator", coordinates: { x: 490, y: 260 } },
        { id: "WASH-AUD2", name: "1st Floor Restrooms", type: "Washroom", coordinates: { x: 720, y: 260 } }
      ]
    }
  ]
};

export const STARTUP_STALLS = [
  {
    id: "S01",
    name: "NeuralHealth AI",
    founder: "Dr. Ananya Sharma",
    domain: "Healthcare AI",
    description: "Early-stage oncology diagnostic engine using edge AI ultrasound imagery and real-time cellular segmentation.",
    website: "https://neuralhealth.ai",
    demoTiming: "10:30 AM - 11:30 AM",
    logoIcon: "HeartPulse",
    stallLocation: "Startup Arena Row 1",
    x: 420,
    y: 280,
    floor: "indoor"
  },
  {
    id: "S02",
    name: "AgriVision Robotics",
    founder: "Rajesh Kumar & Team",
    domain: "Agriculture AI",
    description: "Autonomous micro-drones and hyperspectral soil sensing for real-time crop yield optimization in Uttar Pradesh.",
    website: "https://agrivision.io",
    demoTiming: "11:00 AM - 12:00 PM",
    logoIcon: "Sprout",
    stallLocation: "Startup Arena Row 1",
    x: 460,
    y: 280,
    floor: "indoor"
  },
  {
    id: "S03",
    name: "Kvantum Cyber Defense",
    founder: "Vikramaditya Verma",
    domain: "Cyber Security",
    description: "Post-quantum encryption gateway protecting critical university infrastructure and enterprise cloud workloads.",
    website: "https://kvantumcyber.com",
    demoTiming: "11:30 AM - 12:30 PM",
    logoIcon: "ShieldCheck",
    stallLocation: "Startup Arena Row 1",
    x: 500,
    y: 280,
    floor: "indoor"
  },
  {
    id: "S04",
    name: "OmniGen NLP",
    founder: "Priya Sundaram",
    domain: "Generative AI",
    description: "Indic multi-lingual LLM fine-tuned for Indian regional dialects, legal contracts, and administrative governance.",
    website: "https://omnigen.ai",
    demoTiming: "12:00 PM - 01:00 PM",
    logoIcon: "Cpu",
    stallLocation: "Startup Arena Row 1",
    x: 540,
    y: 280,
    floor: "indoor"
  },
  {
    id: "S05",
    name: "RoboFlow Dynamics",
    founder: "Prof. S. N. Mishra",
    domain: "Robotics",
    description: "Quadrupedal terrain inspection robots for industrial surveillance, disaster response, and hazardous material audit.",
    website: "https://roboflow.in",
    demoTiming: "01:30 PM - 02:30 PM",
    logoIcon: "Bot",
    stallLocation: "Startup Arena Row 1",
    x: 580,
    y: 280,
    floor: "indoor"
  },
  {
    id: "S06",
    name: "Edumind Adaptive",
    founder: "Rohan & Sneha Kapoor",
    domain: "Education AI",
    description: "Personalized AI tutoring co-pilot providing hyper-tailored STEM learning tracks for higher education students.",
    website: "https://edumind.co",
    demoTiming: "02:00 PM - 03:00 PM",
    logoIcon: "GraduationCap",
    stallLocation: "Startup Arena Row 2",
    x: 420,
    y: 330,
    floor: "indoor"
  },
  {
    id: "S07",
    name: "VisionGrid Labs",
    founder: "Deepak Tripathi",
    domain: "Computer Vision",
    description: "Real-time multi-camera crowd flow tracking, occupancy analytics, and automated security anomaly detection.",
    website: "https://visiongrid.ai",
    demoTiming: "02:30 PM - 03:30 PM",
    logoIcon: "Eye",
    stallLocation: "Startup Arena Row 2",
    x: 460,
    y: 330,
    floor: "indoor"
  },
  {
    id: "S08",
    name: "BioSynth AI",
    founder: "Dr. Kavita Singhania",
    domain: "Healthcare AI",
    description: "Generative protein design platform accelerating biopharmaceutical discovery for targeted cancer therapeutics.",
    website: "https://biosynth.tech",
    demoTiming: "03:00 PM - 04:00 PM",
    logoIcon: "Dna",
    stallLocation: "Startup Arena Row 2",
    x: 500,
    y: 330,
    floor: "indoor"
  },
  {
    id: "S09",
    name: "CleanCarbon Analytics",
    founder: "Arjun Reddy",
    domain: "CleanTech AI",
    description: "AI-driven carbon footprint accounting, IoT satellite verification, and automated ESG compliance reporting.",
    website: "https://cleancarbon.io",
    demoTiming: "03:30 PM - 04:30 PM",
    logoIcon: "Leaf",
    stallLocation: "Startup Arena Row 2",
    x: 540,
    y: 330,
    floor: "indoor"
  },
  {
    id: "S10",
    name: "AeroSpatial Dynamics",
    founder: "Captain Manish Mehta",
    domain: "Robotics",
    description: "Swarm drone navigation algorithms using optical flow and VIO for GPS-denied indoor environments.",
    website: "https://aerospatial.co.in",
    demoTiming: "04:00 PM - 05:00 PM",
    logoIcon: "Plane",
    stallLocation: "Startup Arena Row 2",
    x: 580,
    y: 330,
    floor: "indoor"
  },
  {
    id: "S11",
    name: "FinPulse Predictive",
    founder: "Karan Johar & Team",
    domain: "FinTech AI",
    description: "Micro-credit risk scoring powered by graph neural networks for rural banking and MSME financial inclusion.",
    website: "https://finpulse.ai",
    demoTiming: "10:30 AM - 11:30 AM",
    logoIcon: "TrendingUp",
    stallLocation: "Startup Arena Row 3",
    x: 420,
    y: 380,
    floor: "indoor"
  },
  {
    id: "S12",
    name: "QuantumSense Sensing",
    founder: "Dr. Alok Nath",
    domain: "DeepTech",
    description: "Ultra-precise quantum magnetometers for non-invasive neuro-imaging and mineral exploration.",
    website: "https://quantumsense.tech",
    demoTiming: "11:30 AM - 12:30 PM",
    logoIcon: "Zap",
    stallLocation: "Startup Arena Row 3",
    x: 460,
    y: 380,
    floor: "indoor"
  },
  {
    id: "S13",
    name: "LogiSmart Mobility",
    founder: "Simran Kaur",
    domain: "Logistics AI",
    description: "Dynamic route optimization and electric vehicle fleet management for intra-campus and urban transit.",
    website: "https://logismart.ai",
    demoTiming: "12:30 PM - 01:30 PM",
    logoIcon: "Truck",
    stallLocation: "Startup Arena Row 3",
    x: 500,
    y: 380,
    floor: "indoor"
  },
  {
    id: "S14",
    name: "VoiceCraft AI",
    founder: "Gaurav Sen",
    domain: "Generative AI",
    description: "Zero-shot voice cloning and real-time multi-lingual dubbing engine for educational content.",
    website: "https://voicecraft.io",
    demoTiming: "01:30 PM - 02:30 PM",
    logoIcon: "Mic",
    stallLocation: "Startup Arena Row 3",
    x: 540,
    y: 380,
    floor: "indoor"
  },
  {
    id: "S15",
    name: "MedTwin XR",
    founder: "Dr. Ritu Bhalla",
    domain: "Healthcare AI",
    description: "Interactive 3D anatomical digital twins for surgical simulation and remote medical training.",
    website: "https://medtwinxr.com",
    demoTiming: "02:30 PM - 03:30 PM",
    logoIcon: "Activity",
    stallLocation: "Startup Arena Row 3",
    x: 580,
    y: 380,
    floor: "indoor"
  },
  {
    id: "S16",
    name: "Solaris Clean Energy",
    founder: "Harsh Vardhan",
    domain: "CleanTech AI",
    description: "AI smart-grid forecasting and solar panel defect detection using micro-thermal aerial imaging.",
    website: "https://solarisenergy.in",
    demoTiming: "03:30 PM - 04:30 PM",
    logoIcon: "Sun",
    stallLocation: "Startup Arena Row 4",
    x: 420,
    y: 430,
    floor: "indoor"
  },
  {
    id: "S17",
    name: "PolymerAI Materials",
    founder: "Dr. Vikram Seth",
    domain: "DeepTech",
    description: "Machine learning guided synthesis of biodegradable polymers to replace single-use plastics.",
    website: "https://polymerai.org",
    demoTiming: "10:00 AM - 11:00 AM",
    logoIcon: "Layers",
    stallLocation: "Startup Arena Row 4",
    x: 460,
    y: 430,
    floor: "indoor"
  },
  {
    id: "S18",
    name: "SecureNode IoT",
    founder: "Neha Aggarwal",
    domain: "Cyber Security",
    description: "Zero-trust IoT device authentication hardware module for smart city and industrial sensors.",
    website: "https://securenode.io",
    demoTiming: "11:00 AM - 12:00 PM",
    logoIcon: "Lock",
    stallLocation: "Startup Arena Row 4",
    x: 500,
    y: 430,
    floor: "indoor"
  },
  {
    id: "S19",
    name: "NeuroRead BCIs",
    founder: "Siddharth Bose",
    domain: "DeepTech",
    description: "Non-invasive brain-computer interfaces for neuro-rehabilitation and prosthetic motor control.",
    website: "https://neuroread.ai",
    demoTiming: "01:00 PM - 02:00 PM",
    logoIcon: "BrainCircuit",
    stallLocation: "Startup Arena Row 4",
    x: 540,
    y: 430,
    floor: "indoor"
  },
  {
    id: "S20",
    name: "Kisaan Mitra Bot",
    founder: "Pankaj Yadav",
    domain: "Agriculture AI",
    description: "Voice-first WhatsApp AI assistant providing vernacular pest advisory and market mandi price forecasts.",
    website: "https://kisaanmitra.ai",
    demoTiming: "03:00 PM - 04:00 PM",
    logoIcon: "MessageSquare",
    stallLocation: "Startup Arena Row 4",
    x: 580,
    y: 430,
    floor: "indoor"
  }
];

export const MAP_LOCATIONS = [
  {
    "id": "loc_main_gate",
    "name": "CSJM Main Gate",
    "code": "Gate 1",
    "category": "Entrance",
    "lat": 26.496921,
    "lng": 80.266628,
    "x": 490,
    "y": 397,
    "floors": 1,
    "description": "Main entrance of the University (GT Road Entrance)",
    "departments": ["Main Gate Security", "Information Desk"]
  },
  {
    "id": "loc_girls_hostel",
    "name": "Girls Hostel",
    "code": "GH-01",
    "category": "Hostel",
    "lat": 26.49956,
    "lng": 80.268044,
    "x": 478,
    "y": 401,
    "floors": 3,
    "description": "Campus Girls Student Residential Hostel Complex",
    "departments": ["Hostel Warden Office", "Visitor Lounge"]
  },
  {
    "id": "loc_boys_hostel",
    "name": "Boys Hostel",
    "code": "BH-01",
    "category": "Hostel",
    "lat": 26.508417,
    "lng": 80.268779,
    "x": 327,
    "y": 490,
    "floors": 3,
    "description": "Campus Boys Student Residential Hostel Complex",
    "departments": ["Hostel Warden Office", "Recreation Hall"]
  },
  {
    "id": "loc_uiet",
    "name": "UIET Engineering Block",
    "code": "BLD-304",
    "category": "Academic",
    "lat": 26.500924,
    "lng": 80.265555,
    "x": 306,
    "y": 398,
    "floors": 3,
    "description": "University Institute of Engineering and Technology (CSE, AI, Robotics, ECE Labs)",
    "departments": ["Computer Science & AI", "Electronics & Comm", "Mechanical Engg", "Director Office"]
  },
  {
    "id": "loc_uiet_4",
    "name": "UIET Block 4",
    "code": "BLD-689",
    "category": "Academic",
    "lat": 26.502781,
    "lng": 80.265035,
    "x": 390,
    "y": 364,
    "floors": 2,
    "description": "UIET Annex Engineering Block 4 Workshops & Advanced Labs",
    "departments": ["Engineering Workshops", "Advanced Computing Lab"]
  },
  {
    "id": "loc_sbm",
    "name": "School of Business Management (SBM)",
    "code": "SBM-MAIN",
    "category": "Academic",
    "lat": 26.503031,
    "lng": 80.266371,
    "x": 429,
    "y": 428,
    "floors": 3,
    "description": "Primary venue for AI Summit 2026 Workshops, MBA Classrooms, RO Coolers & Computing Labs",
    "departments": ["MBA Dept", "AI Keynote Hall", "Dean Secretariat", "Startup Incubation"]
  },
  {
    "id": "loc_central_library",
    "name": "Central Library",
    "code": "BLD-778",
    "category": "Library",
    "lat": 26.50114,
    "lng": 80.267025,
    "x": 445,
    "y": 369,
    "floors": 3,
    "description": "Central University Library, Digital Research Hub, Reading Halls & e-Learning Center",
    "departments": ["Circulation Desk", "Reference Section", "Digital E-Library"]
  },
  {
    "id": "loc_cafeteria",
    "name": "Cafeteria & Food Court",
    "code": "BLD-102",
    "category": "Dining",
    "lat": 26.499776,
    "lng": 80.266065,
    "x": 386,
    "y": 316,
    "floors": 1,
    "description": "University Student Cafeteria, Nescafe Coffee Point & Snacks Corner",
    "departments": ["Main Dining Area", "Beverage Counter", "Outdoor Seating"]
  },
  {
    "id": "loc_auditorium",
    "name": "CSJM Auditorium",
    "code": "BLD-650",
    "category": "Auditorium",
    "lat": 26.504193,
    "lng": 80.268463,
    "x": 471,
    "y": 318,
    "floors": 2,
    "description": "Grand 1500-seat Plenary Auditorium & Convocation Complex",
    "departments": ["Main Stage", "Exhibition Foyer", "VIP Green Rooms"]
  },
  {
    "id": "loc_lhc",
    "name": "Lecture Hall Complex",
    "code": "BLD-438",
    "category": "Academic",
    "lat": 26.501216,
    "lng": 80.264579,
    "x": 411,
    "y": 499,
    "floors": 2,
    "description": "Centralized Smart Lecture Theatres & Conference Rooms",
    "departments": ["Lecture Halls 1-10", "Faculty Lounge"]
  },
  {
    "id": "loc_oat",
    "name": "Open Air Theatre",
    "code": "BLD-712",
    "category": "Auditorium",
    "lat": 26.501838,
    "lng": 80.265006,
    "x": 405,
    "y": 420,
    "floors": 1,
    "description": "Amphitheatre for Cultural Fests, Drama & Open Air Gatherings",
    "departments": ["Amphitheatre Stage", "Acoustic Arena"]
  },
  {
    "id": "loc_admin_office",
    "name": "Administration Office",
    "code": "BLD-110",
    "category": "Admin",
    "lat": 26.498396,
    "lng": 80.266183,
    "x": 408,
    "y": 385,
    "floors": 2,
    "description": "Vice Chancellor Secretariat, Registrar Office, Accounts & Admissions",
    "departments": ["VC Office", "Registrar Office", "Exam Cell", "Accounts"]
  },
  {
    "id": "loc_centre_of_academics",
    "name": "Centre of Academics",
    "code": "BLD-165",
    "category": "Academic",
    "lat": 26.499243,
    "lng": 80.266709,
    "x": 412,
    "y": 462,
    "floors": 2,
    "description": "Academic Affairs, Research Directorate & Faculty Development Center",
    "departments": ["Academic Council", "Dean Office", "Research Cell"]
  },
  {
    "id": "loc_metro_station",
    "name": "CSJMU Metro Station",
    "code": "BLD-367",
    "category": "Transit",
    "lat": 26.49648,
    "lng": 80.267272,
    "x": 367,
    "y": 478,
    "floors": 1,
    "description": "Kanpur Metro Orange Line CSJMU University Station Entrance",
    "departments": ["Ticket Counters", "Platform 1 & 2", "Feeder E-Rickshaws"]
  },
  {
    "id": "loc_open_gym",
    "name": "Open Gym & Sports Complex",
    "code": "BLD-387",
    "category": "Sports",
    "lat": 26.500837,
    "lng": 80.268307,
    "x": 449,
    "y": 458,
    "floors": 1,
    "description": "Outdoor Fitness Gym, Running Track & Multi-Sports Ground",
    "departments": ["Open Gym Arena", "Running Track", "Badminton Courts"]
  },
  {
    "id": "loc_swimming_pool",
    "name": "Olympic Swimming Pool",
    "code": "BLD-687",
    "category": "Sports",
    "lat": 26.505125,
    "lng": 80.270458,
    "x": 485,
    "y": 493,
    "floors": 1,
    "description": "University Standard Swimming Pool & Aquatic Sports Facility",
    "departments": ["Pool Deck", "Changing Rooms", "Life Guard Station"]
  },
  {
    "id": "loc_nataraj_point",
    "name": "Nataraj Point",
    "code": "BLD-711",
    "category": "Landmark",
    "lat": 26.500645,
    "lng": 80.267897,
    "x": 422,
    "y": 409,
    "floors": 1,
    "description": "Prominent Nataraj Sculpture & Central Campus Roundabout",
    "departments": ["Central Roundabout", "Campus Information Kiosk"]
  },
  {
    "id": "loc_namarta_marg",
    "name": "Namarta Marg",
    "code": "BLD-119",
    "category": "Entrance",
    "lat": 26.499831,
    "lng": 80.267597,
    "x": 381,
    "y": 456,
    "floors": 1,
    "description": "Central Campus Boulevard connecting UIET, Library and Hostels",
    "departments": ["Pedestrian Walkway", "Shuttle Stop"]
  },
  {
    "id": "loc_medical_booth",
    "name": "Health Centre & Medical Booth",
    "code": "MED-01",
    "category": "Medical",
    "lat": 26.4985,
    "lng": 80.2662,
    "x": 400,
    "y": 380,
    "floors": 1,
    "description": "24/7 University Emergency Health Centre, First Aid & Doctor on Call",
    "departments": ["Emergency First Aid", "Pharmacy", "Doctor Consultation"]
  },
  {
    "id": "custom_bld_1786258679894",
    "name": "Nataraj Point",
    "code": "BLD-711",
    "category": "Entrance",
    "lat": 26.500645,
    "lng": 80.267897,
    "x": 422,
    "y": 409,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786258694497",
    "name": "Uiet",
    "code": "BLD-445",
    "category": "Entrance",
    "lat": 26.500924,
    "lng": 80.265507,
    "x": 451,
    "y": 329,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786258709544",
    "name": "Lecture Hall Complex",
    "code": "BLD-438",
    "category": "Entrance",
    "lat": 26.501216,
    "lng": 80.264579,
    "x": 411,
    "y": 499,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786258750057",
    "name": "Open Air Theatre",
    "code": "BLD-712",
    "category": "Entrance",
    "lat": 26.501838,
    "lng": 80.265006,
    "x": 405,
    "y": 420,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786258953264",
    "name": "Boys Hostel",
    "code": "BLD-355",
    "category": "Entrance",
    "lat": 26.508427,
    "lng": 80.26879,
    "x": 363,
    "y": 430,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786259088845",
    "name": "CSJMU Metro Station",
    "code": "BLD-367",
    "category": "Entrance",
    "lat": 26.49648,
    "lng": 80.267272,
    "x": 367,
    "y": 478,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786259290495",
    "name": "Cafeteria",
    "code": "BLD-102",
    "category": "Entrance",
    "lat": 26.499776,
    "lng": 80.266065,
    "x": 386,
    "y": 316,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786259345815",
    "name": "School of Business Management(SBM)",
    "code": "BLD-973",
    "category": "Entrance",
    "lat": 26.503022,
    "lng": 80.266371,
    "x": 334,
    "y": 304,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "arrivalRadius": 25,
    "entrances": [
      {
        "id": "sbm-main-entrance-1",
        "name": "Main Entrance",
        "lat": 26.50290,
        "lng": 80.26620
      },
      {
        "id": "sbm-east-entrance-1",
        "name": "East Entrance",
        "lat": 26.50310,
        "lng": 80.26650
      }
    ],
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786259378721",
    "name": "Uiet 4",
    "code": "BLD-645",
    "category": "Entrance",
    "lat": 26.502772,
    "lng": 80.264965,
    "x": 346,
    "y": 375,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300275720",
    "name": "Administration Offuce",
    "code": "BLD-110",
    "category": "Entrance",
    "lat": 26.498396,
    "lng": 80.266183,
    "x": 408,
    "y": 385,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300306192",
    "name": "Centre of Academics",
    "code": "BLD-165",
    "category": "Entrance",
    "lat": 26.499243,
    "lng": 80.266709,
    "x": 412,
    "y": 462,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300320785",
    "name": "Girls Hostel",
    "code": "BLD-769",
    "category": "Entrance",
    "lat": 26.49956,
    "lng": 80.268044,
    "x": 478,
    "y": 401,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300348670",
    "name": "Central Library",
    "code": "BLD-778",
    "category": "Entrance",
    "lat": 26.50114,
    "lng": 80.267025,
    "x": 445,
    "y": 369,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300361943",
    "name": "Open Gym",
    "code": "BLD-387",
    "category": "Entrance",
    "lat": 26.500837,
    "lng": 80.268307,
    "x": 449,
    "y": 458,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300371977",
    "name": "UIET",
    "code": "BLD-304",
    "category": "Entrance",
    "lat": 26.500924,
    "lng": 80.265555,
    "x": 306,
    "y": 398,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300386758",
    "name": "Uiet 4",
    "code": "BLD-689",
    "category": "Entrance",
    "lat": 26.502781,
    "lng": 80.265035,
    "x": 390,
    "y": 364,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300418619",
    "name": "School of Business Management(SBM)",
    "code": "BLD-312",
    "category": "Entrance",
    "lat": 26.503031,
    "lng": 80.266371,
    "x": 429,
    "y": 428,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "arrivalRadius": 25,
    "entrances": [
      {
        "id": "sbm-main-entrance-2",
        "name": "Main Entrance",
        "lat": 26.50290,
        "lng": 80.26620
      },
      {
        "id": "sbm-east-entrance-2",
        "name": "East Entrance",
        "lat": 26.50310,
        "lng": 80.26650
      }
    ],
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300436659",
    "name": "CSJM Auditorium",
    "code": "BLD-650",
    "category": "Entrance",
    "lat": 26.504193,
    "lng": 80.268463,
    "x": 471,
    "y": 318,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "arrivalRadius": 25,
    "entrances": [
      {
        "id": "auditorium-main-entrance",
        "name": "Main Entrance",
        "lat": 26.50410,
        "lng": 80.26830
      },
      {
        "id": "auditorium-east-entrance",
        "name": "East Entrance",
        "lat": 26.50420,
        "lng": 80.26860
      }
    ],
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300466437",
    "name": "Swimming Pool",
    "code": "BLD-687",
    "category": "Entrance",
    "lat": 26.505125,
    "lng": 80.270458,
    "x": 485,
    "y": 493,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  },
  {
    "id": "custom_bld_1786300525357",
    "name": "Boys Hostel",
    "code": "BLD-739",
    "category": "Entrance",
    "lat": 26.508417,
    "lng": 80.268779,
    "x": 327,
    "y": 490,
    "floors": 1,
    "description": "Custom Plotted University Facility",
    "departments": [
      "General Dept",
      "Faculty Offices"
    ],
    "isCustom": true
  }
];

export const SESSIONS_DATA = [
  {
    id: "sess_01",
    title: "Inaugural Keynote: AI Transformation in Indian Higher Education",
    track: "Keynote",
    time: "09:30 AM - 10:45 AM",
    speaker: "Prof. Vinay Kumar Pathak",
    designation: "Vice Chancellor, CSJMU Kanpur",
    venue: "Main Stage & Screen",
    venueId: "loc_stage",
    description: "Setting the roadmap for integrating AI research, smart campus digital twins, and national education policy initiatives.",
    isLive: false,
    completed: true,
    tags: ["education", "keynote", "vc", "csjmu", "ai transformation"]
  },
  {
    id: "sess_02",
    title: "Generative AI & Multilingual LLMs for Public Governance",
    track: "Generative AI",
    time: "11:00 AM - 12:15 PM",
    speaker: "Dr. Anish Sharma & Panelists",
    designation: "Director, AI Research Lab / MeitY Advisor",
    venue: "Main Stage & Screen",
    venueId: "loc_stage",
    description: "Exploring Indic models, voice-first citizen interaction, and sovereign AI compute infrastructure.",
    isLive: true,
    completed: false,
    tags: ["generative ai", "llm", "indic", "governance", "meity"]
  },
  {
    id: "sess_03",
    title: "AI in Healthcare: Diagnostic Imaging & Protein Design",
    track: "Healthcare AI",
    time: "12:30 PM - 01:30 PM",
    speaker: "Dr. Ananya Sharma & Dr. Kavita Singhania",
    designation: "Founders, NeuralHealth & BioSynth AI",
    venue: "Media & Broadcast Booth",
    venueId: "loc_media_booth",
    description: "Case studies in early cancer detection using edge AI ultrasound devices and alphafold structural design.",
    isLive: false,
    completed: false,
    tags: ["healthcare", "health", "cancer", "biotech", "medicine"]
  },
  {
    id: "sess_04",
    title: "VC Panel: Funding DeepTech & Robotics Startups in India",
    track: "DeepTech",
    time: "02:30 PM - 03:45 PM",
    speaker: "Leading VC Partners & Founders",
    designation: "Peak XV, Blume Ventures & UP Startup Fund",
    venue: "Speaker & VC VIP Lounge",
    venueId: "loc_speaker_lounge",
    description: "Insights on seed funding, government incubation grants, scaling hardware robotics, and international expansion.",
    isLive: false,
    completed: false,
    tags: ["vc", "funding", "investment", "robotics", "deeptech"]
  },
  {
    id: "sess_05",
    title: "Cyber Security & Post-Quantum Encryption Standards",
    track: "Cyber Security",
    time: "04:00 PM - 05:00 PM",
    speaker: "Vikramaditya Verma",
    designation: "Founder, Kvantum Cyber Defense",
    venue: "Main Stage & Screen",
    venueId: "loc_stage",
    description: "Securing financial switches, smart cities, and university databases against future quantum computing attacks.",
    isLive: false,
    completed: false,
    tags: ["cyber security", "security", "quantum", "encryption"]
  }
];

export const QUICK_ACTIONS = [
  { name: "Stage", icon: "Mic2", targetId: "loc_stage", category: "indoor" },
  { name: "Registration Desk", icon: "FileCheck", targetId: "loc_registration", category: "indoor" },
  { name: "Startup Exhibition", icon: "Rocket", targetId: "loc_startup_exhibition", category: "indoor" },
  { name: "Senate Hall", icon: "Landmark", targetId: "loc_senate_hall", category: "outdoor" },
  { name: "Guest House", icon: "Hotel", targetId: "loc_guest_house", category: "outdoor" },
  { name: "Food Court", icon: "UtensilsCrossed", targetId: "loc_food_court", category: "indoor" },
  { name: "Washroom", icon: "Bath", targetId: "loc_washroom", category: "indoor" },
  { name: "Water Cooler", icon: "Droplets", targetId: "loc_water_cooler", category: "indoor" },
  { name: "Charging Station", icon: "Zap", targetId: "loc_charging_station", category: "indoor" },
  { name: "Medical Help", icon: "Cross", targetId: "loc_medical_booth", category: "indoor" },
  { name: "Parking", icon: "Car", targetId: "loc_parking_p1", category: "outdoor" },
  { name: "Today's Sessions", icon: "Calendar", action: "open_sessions" }
];

export const DEPARTMENT_AREAS = [
  {
    id: "dept_uiet_eng",
    name: "UIET - School of Engineering & Technology",
    code: "DEPT-ENG",
    color: "#991B1B",
    icon: "⚙️",
    description: "Engineering Wing: Computer Science, AI & Data Science Labs, Electronics & Robotics Labs",
    courses: ["B.Tech Computer Science", "B.Tech AI & Data Science", "B.Tech Robotics", "M.Tech CSE"],
    polygon: [
      [26.4998, 80.2668],
      [26.5012, 80.2668],
      [26.5012, 80.2682],
      [26.4998, 80.2682]
    ],
    canvasRect: { x: 380, y: 150, w: 180, h: 120 }
  },
  {
    id: "dept_pharmacy",
    name: "Institute of Pharmacy & Bio-Tech",
    code: "DEPT-PHARM",
    color: "#EF4444",
    icon: "💊",
    description: "Pharmaceutical Research & Herbal Drug Discovery Laboratories",
    courses: ["B.Pharm", "M.Pharm Pharmaceutics", "Ph.D Pharmacology", "Bio-Technology Wing"],
    polygon: [
      [26.5005, 80.2680],
      [26.5018, 80.2680],
      [26.5018, 80.2694],
      [26.5005, 80.2694]
    ],
    canvasRect: { x: 580, y: 150, w: 160, h: 120 }
  },
  {
    id: "dept_law",
    name: "School of Law & Legal Studies",
    code: "DEPT-LAW",
    color: "#F59E0B",
    icon: "⚖️",
    description: "Moot Court Hall, Constitutional Law Research Cell & Legal Aid Center",
    courses: ["BA LL.B (5 Year)", "LL.B (3 Year)", "LL.M Cyber Law", "Ph.D Legal Studies"],
    polygon: [
      [26.4990, 80.2685],
      [26.5002, 80.2685],
      [26.5002, 80.2698],
      [26.4990, 80.2698]
    ],
    canvasRect: { x: 600, y: 300, w: 160, h: 110 }
  },
  {
    id: "dept_medical",
    name: "School of Medical & Health Sciences",
    code: "DEPT-MED",
    color: "#10B981",
    icon: "🏥",
    description: "Paramedical Labs, Health Analytics & Emergency Medical Services Training Wing",
    courses: ["B.Sc Paramedical", "Bachelor of Physiotherapy (BPT)", "Medical Lab Tech (BMLT)", "Nursing"],
    polygon: [
      [26.4965, 80.2648],
      [26.4975, 80.2648],
      [26.4975, 80.2662],
      [26.4965, 80.2662]
    ],
    canvasRect: { x: 260, y: 480, w: 140, h: 100 }
  },
  {
    id: "dept_humanities_ba",
    name: "School of Humanities & Social Sciences (BA / Arts)",
    code: "DEPT-ARTS",
    color: "#8B5CF6",
    icon: "📚",
    description: "Languages, Literature, History, Political Science & Sociology Academic Block",
    courses: ["BA Honours English", "BA History", "BA Sociology", "MA Political Science"],
    polygon: [
      [26.4980, 80.2640],
      [26.4992, 80.2640],
      [26.4992, 80.2655],
      [26.4980, 80.2655]
    ],
    canvasRect: { x: 250, y: 300, w: 140, h: 120 }
  },
  {
    id: "dept_bba_management",
    name: "UIAM - School of Business & Management (BBA / MBA)",
    code: "DEPT-MGT",
    color: "#EC4899",
    icon: "💼",
    description: "Business School: Incubation Center, Financial Analytics Lab & Executive Suites",
    courses: ["BBA General", "BBA Finance & Marketing", "MBA Executive", "M.Com"],
    polygon: [
      [26.4970, 80.2665],
      [26.4982, 80.2665],
      [26.4982, 80.2680],
      [26.4970, 80.2680]
    ],
    canvasRect: { x: 380, y: 600, w: 160, h: 110 }
  },
  {
    id: "dept_basic_sciences",
    name: "School of Basic Sciences (Physics, Chemistry, Maths)",
    code: "DEPT-SCI",
    color: "#3B82F6",
    icon: "🔬",
    description: "Advanced Physical Sciences, Spectroscopy Labs & Mathematical Computation Center",
    courses: ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "M.Sc Nano-Technology"],
    polygon: [
      [26.5000, 80.2640],
      [26.5012, 80.2640],
      [26.5012, 80.2655],
      [26.5000, 80.2655]
    ],
    canvasRect: { x: 220, y: 150, w: 140, h: 120 }
  },
  {
    id: "dept_auditorium",
    name: "Grand Auditorium & Convention Complex",
    code: "DEPT-AUD",
    color: "#00F0FF",
    icon: "🏛️",
    description: "1,500-seat Plenary Auditorium Hall, Exhibition Arena & AI Summit Hub",
    courses: ["National Summits", "University Convocations", "Cultural Events"],
    polygon: [
      [26.4988, 80.2662],
      [26.4998, 80.2662],
      [26.4998, 80.2676],
      [26.4988, 80.2676]
    ],
    canvasRect: { x: 440, y: 380, w: 180, h: 180 }
  }
];
