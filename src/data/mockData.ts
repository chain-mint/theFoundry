export const talents = [
  {
    id: 1,
    name: "Amina Bello",
    skills: ["Fullstack", "React", "Node.js"],
    matchScore: 94,
    status: "Available",
    cohort: "3MTT Cohort 3",
  },
  {
    id: 2,
    name: "Tunde Adeyemi",
    skills: ["ML", "Python", "Data Science"],
    matchScore: 89,
    status: "Matched",
    cohort: "3MTT Cohort 2",
  },
  {
    id: 3,
    name: "Ngozi Eze",
    skills: ["UI/UX", "Figma", "Design Systems"],
    matchScore: 87,
    status: "Available",
    cohort: "3MTT Cohort 3",
  },
  {
    id: 4,
    name: "Emeka Nwosu",
    skills: ["DevOps", "AWS", "Docker"],
    matchScore: 82,
    status: "In Review",
    cohort: "3MTT Cohort 1",
  },
  {
    id: 5,
    name: "Fatima Abdullahi",
    skills: ["Mobile", "Flutter", "Firebase"],
    matchScore: 91,
    status: "Available",
    cohort: "3MTT Cohort 3",
  },
  {
    id: 6,
    name: "David Ogunlade",
    skills: ["Blockchain", "Solidity", "Web3"],
    matchScore: 78,
    status: "Matched",
    cohort: "3MTT Cohort 2",
  },
];

export const startups = [
  {
    id: 1,
    name: "AgriTech Pro",
    founder: "Chidi Okafor",
    stage: "Seed",
    sector: "AgriTech",
    equity: "12%",
    teamSize: 4,
    milestone: "MVP Launched",
  },
  {
    id: 2,
    name: "EduBridge AI",
    founder: "Kemi Afolabi",
    stage: "Pre-Seed",
    sector: "EdTech",
    equity: "15%",
    teamSize: 2,
    milestone: "Prototype Ready",
  },
  {
    id: 3,
    name: "HealthLink NG",
    founder: "Yusuf Bala",
    stage: "Series A",
    sector: "HealthTech",
    equity: "8%",
    teamSize: 7,
    milestone: "10K Users",
  },
  {
    id: 4,
    name: "PayFlow Africa",
    founder: "Ada Nnaji",
    stage: "Seed",
    sector: "FinTech",
    equity: "10%",
    teamSize: 5,
    milestone: "Revenue $50K MRR",
  },
];

export const matchData = [
  {
    talent: "Amina Bello",
    startup: "AgriTech Pro",
    score: 94,
    role: "Lead Frontend Dev",
    status: "Pending",
  },
  {
    talent: "Tunde Adeyemi",
    startup: "EduBridge AI",
    score: 89,
    role: "ML Engineer",
    status: "Accepted",
  },
  {
    talent: "Ngozi Eze",
    startup: "PayFlow Africa",
    score: 87,
    role: "UI/UX Lead",
    status: "Pending",
  },
  {
    talent: "Fatima Abdullahi",
    startup: "HealthLink NG",
    score: 91,
    role: "Mobile Developer",
    status: "Interview",
  },
];

export const impactStats = {
  totalMatches: 1247,
  activeStartups: 89,
  talentsPlaced: 834,
  avgMatchScore: 86,
  equityDistributed: "₦2.4B",
  jobsCreated: 3200,
};

export const monthlyData = [
  { month: "Jan", matches: 45, placements: 32, startups: 8 },
  { month: "Feb", matches: 62, placements: 48, startups: 12 },
  { month: "Mar", matches: 78, placements: 55, startups: 15 },
  { month: "Apr", matches: 95, placements: 71, startups: 18 },
  { month: "May", matches: 120, placements: 89, startups: 22 },
  { month: "Jun", matches: 145, placements: 108, startups: 27 },
];

export const sectorDistribution = [
  { name: "FinTech", value: 28 },
  { name: "AgriTech", value: 22 },
  { name: "HealthTech", value: 18 },
  { name: "EdTech", value: 16 },
  { name: "LogiTech", value: 10 },
  { name: "Other", value: 6 },
];
export const talentApplications = [
  {
    id: 1,
    startup: "AgriTech Pro",
    stage: "Seed",
    equity: "8%",
    milestonefit: "High",
    role: "Lead Frontend Dev",
    status: "Under Review",
    appliedDate: "2025-03-01",
  },
  {
    id: 2,
    startup: "EduBridge AI",
    stage: "Pre-Seed",
    equity: "10%",
    milestonefit: "Very High",
    role: "Fullstack Engineer",
    status: "Interview",
    appliedDate: "2025-02-18",
  },
  {
    id: 3,
    startup: "PayFlow Africa",
    stage: "Seed",
    equity: "6%",
    milestonefit: "Medium",
    role: "Frontend Dev",
    status: "Offered",
    appliedDate: "2025-01-22",
  },
];

export const discoverOpportunities = [
  {
    id: 10,
    name: "GreenGrid Energy",
    founder: "Bola Adesanya",
    stage: "Pre-Seed",
    sector: "CleanTech",
    equity: "9%",
    teamSize: 3,
    milestone: "Prototype Built",
    matchScore: 96,
    role: "Lead Fullstack Engineer",
    description: "Building decentralized solar micro-grids for rural Nigeria.",
  },
  {
    id: 11,
    name: "LogiMove",
    founder: "Tayo Ojo",
    stage: "Seed",
    sector: "LogiTech",
    equity: "7%",
    teamSize: 5,
    milestone: "Pilot Complete",
    matchScore: 91,
    role: "Senior React Developer",
    description: "Last-mile logistics optimization powered by AI routing.",
  },
  {
    id: 12,
    name: "FarmChain",
    founder: "Hauwa Garba",
    stage: "Pre-Seed",
    sector: "AgriTech",
    equity: "10%",
    teamSize: 2,
    milestone: "Concept Validated",
    matchScore: 88,
    role: "Fullstack Engineer",
    description: "Blockchain-based farm produce traceability platform.",
  },
  {
    id: 13,
    name: "MediTrack",
    founder: "Olu Bakare",
    stage: "Seed",
    sector: "HealthTech",
    equity: "6%",
    teamSize: 6,
    milestone: "Beta Live",
    matchScore: 85,
    role: "Frontend Engineer",
    description: "Real-time patient data tracking for rural clinics.",
  },
  {
    id: 14,
    name: "SkillBridge",
    founder: "Amaka Eze",
    stage: "Pre-Seed",
    sector: "EdTech",
    equity: "8%",
    teamSize: 3,
    milestone: "MVP Launched",
    matchScore: 82,
    role: "Fullstack Developer",
    description: "AI-driven career path recommendation for African youth.",
  },
];

export const talentNotifications = [
  {
    id: 1,
    type: "match",
    message:
      "New match from iDICE founder Bola Adesanya – 8% equity proposed for GreenGrid Energy",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "update",
    message:
      "Your application to EduBridge AI has been moved to Interview stage",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "equity",
    message:
      "PayFlow Africa has updated their equity offer to 6% – review the new terms",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "milestone",
    message:
      "AgriTech Pro completed their MVP milestone – your match score increased to 94%",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "system",
    message:
      "Welcome to theFoundry! Complete your profile to unlock more matches",
    time: "3 days ago",
    read: true,
  },
  {
    id: 6,
    type: "match",
    message:
      "LogiMove founder Tayo Ojo viewed your profile – 7% equity role available",
    time: "3 days ago",
    read: true,
  },
];

export const talentProfile = {
  name: "Amina Bello",
  email: "amina.bello@demo.foundry.ng",
  cohort: "3MTT Cohort 3",
  skills: ["Fullstack", "React", "Node.js", "TypeScript", "PostgreSQL"],
  bio: "Passionate fullstack developer with 3+ years of experience building scalable web applications. 3MTT Fellow focused on AgriTech and FinTech innovation.",
  equityVested: 2.4,
  equityTotal: 8,
  vestingMonths: 8,
  vestingTotalMonths: 24,
  foundingEngineerStatus: "Active",
  matchesReceived: 6,
  applicationsActive: 3,
  interviewsScheduled: 1,
};

// ── Founder-specific mock data ──

export interface BlueprintRole {
  id: string;
  title: string;
  skills: string[];
  equityAsk: string;
  matchedTalent: {
    name: string;
    avatar: string;
    matchScore: number;
    cohort: string;
  } | null;
}

export const maxGrowthRoles: BlueprintRole[] = [
  {
    id: "mg1",
    title: "Lead Fullstack Engineer",
    skills: ["React", "Node.js", "PostgreSQL"],
    equityAsk: "8%",
    matchedTalent: {
      name: "Amina Bello",
      avatar: "AB",
      matchScore: 96,
      cohort: "Cohort 3",
    },
  },
  {
    id: "mg2",
    title: "ML / Data Engineer",
    skills: ["Python", "TensorFlow", "Data Pipelines"],
    equityAsk: "7%",
    matchedTalent: {
      name: "Tunde Adeyemi",
      avatar: "TA",
      matchScore: 92,
      cohort: "Cohort 2",
    },
  },
  {
    id: "mg3",
    title: "UI/UX Design Lead",
    skills: ["Figma", "Design Systems", "User Research"],
    equityAsk: "6%",
    matchedTalent: {
      name: "Ngozi Eze",
      avatar: "NE",
      matchScore: 89,
      cohort: "Cohort 3",
    },
  },
  {
    id: "mg4",
    title: "DevOps / Infra Engineer",
    skills: ["AWS", "Docker", "CI/CD"],
    equityAsk: "6%",
    matchedTalent: {
      name: "Emeka Nwosu",
      avatar: "EN",
      matchScore: 85,
      cohort: "Cohort 1",
    },
  },
  {
    id: "mg5",
    title: "Mobile Developer",
    skills: ["Flutter", "Firebase", "React Native"],
    equityAsk: "7%",
    matchedTalent: {
      name: "Fatima Abdullahi",
      avatar: "FA",
      matchScore: 91,
      cohort: "Cohort 3",
    },
  },
  {
    id: "mg6",
    title: "Growth / Product Analyst",
    skills: ["Analytics", "SQL", "Growth Hacking"],
    equityAsk: "5%",
    matchedTalent: {
      name: "Kola Adebayo",
      avatar: "KA",
      matchScore: 83,
      cohort: "Cohort 2",
    },
  },
];

export const leanEfficiencyRoles: BlueprintRole[] = [
  {
    id: "le1",
    title: "Fullstack + DevOps Engineer",
    skills: ["React", "Node.js", "AWS", "Docker"],
    equityAsk: "10%",
    matchedTalent: {
      name: "Amina Bello",
      avatar: "AB",
      matchScore: 96,
      cohort: "Cohort 3",
    },
  },
  {
    id: "le2",
    title: "ML + Data Analyst",
    skills: ["Python", "TensorFlow", "SQL", "Analytics"],
    equityAsk: "9%",
    matchedTalent: {
      name: "Tunde Adeyemi",
      avatar: "TA",
      matchScore: 92,
      cohort: "Cohort 2",
    },
  },
  {
    id: "le3",
    title: "Design + Mobile Engineer",
    skills: ["Figma", "Flutter", "UI/UX", "Firebase"],
    equityAsk: "8%",
    matchedTalent: {
      name: "Ngozi Eze",
      avatar: "NE",
      matchScore: 89,
      cohort: "Cohort 3",
    },
  },
];

export const founderMilestones = [
  {
    id: "m1",
    name: "Team Formation",
    status: "complete" as const,
    desc: "Founding team assembled via AI matchmaking",
  },
  {
    id: "m2",
    name: "NSA 2026 Compliance",
    status: "complete" as const,
    desc: "All team members pass security & compliance checks",
  },
  {
    id: "m3",
    name: "MVP Development",
    status: "active" as const,
    desc: "Build and launch minimum viable product",
  },
  {
    id: "m4",
    name: "User Acquisition",
    status: "pending" as const,
    desc: "Reach 1,000 active users",
  },
  {
    id: "m5",
    name: "Revenue Milestone",
    status: "pending" as const,
    desc: "Generate ₦500K monthly recurring revenue",
  },
];

export const burnReductionData = [
  { month: "Month 1", traditional: 4200000, foundry: 2800000 },
  { month: "Month 2", traditional: 4500000, foundry: 2700000 },
  { month: "Month 3", traditional: 5100000, foundry: 2900000 },
  { month: "Month 4", traditional: 5400000, foundry: 3000000 },
  { month: "Month 5", traditional: 5800000, foundry: 3200000 },
  { month: "Month 6", traditional: 6200000, foundry: 3500000 },
];

export const complianceChecks = [
  { label: "NSA 2026 Security Clearance", passed: true },
  { label: "NITDA Data Protection Compliance", passed: true },
  { label: "BOI Grant Eligibility Verified", passed: true },
  { label: "iDICE Milestone Framework Aligned", passed: true },
  { label: "Equity Pool Within 40% Cap", passed: true },
];

export interface BoiPortfolioRecord {
  id: string;
  founder: string;
  startup: string;
  teamType: "Max Growth" | "Lean Efficiency";
  cohort: "Cohort 1" | "Cohort 2" | "Cohort 3";
  state: "Lagos" | "Abuja FCT" | "Kano" | "Rivers" | "Kaduna" | "Oyo";
  milestone:
    | "Team Formation"
    | "MVP Development"
    | "User Acquisition"
    | "Revenue Milestone";
  grantStatus: "Unlocked" | "In Review" | "At Risk";
  talentPlaced: number;
  jobsCreated: number;
  compliance: "Verified" | "Pending";
  lastSync: string;
}

export const boiPortfolioOverview: BoiPortfolioRecord[] = [
  {
    id: "boi-1",
    founder: "Chidi Okafor",
    startup: "AgriTech Pro",
    teamType: "Max Growth",
    cohort: "Cohort 3",
    state: "Lagos",
    milestone: "MVP Development",
    grantStatus: "In Review",
    talentPlaced: 6,
    jobsCreated: 21,
    compliance: "Verified",
    lastSync: "2 min ago",
  },
  {
    id: "boi-2",
    founder: "Kemi Afolabi",
    startup: "EduBridge AI",
    teamType: "Lean Efficiency",
    cohort: "Cohort 2",
    state: "Abuja FCT",
    milestone: "Team Formation",
    grantStatus: "In Review",
    talentPlaced: 3,
    jobsCreated: 9,
    compliance: "Verified",
    lastSync: "5 min ago",
  },
  {
    id: "boi-3",
    founder: "Yusuf Bala",
    startup: "HealthLink NG",
    teamType: "Max Growth",
    cohort: "Cohort 1",
    state: "Kano",
    milestone: "User Acquisition",
    grantStatus: "Unlocked",
    talentPlaced: 5,
    jobsCreated: 26,
    compliance: "Verified",
    lastSync: "1 min ago",
  },
  {
    id: "boi-4",
    founder: "Ada Nnaji",
    startup: "PayFlow Africa",
    teamType: "Max Growth",
    cohort: "Cohort 3",
    state: "Rivers",
    milestone: "Revenue Milestone",
    grantStatus: "Unlocked",
    talentPlaced: 4,
    jobsCreated: 18,
    compliance: "Verified",
    lastSync: "3 min ago",
  },
  {
    id: "boi-5",
    founder: "Tayo Ojo",
    startup: "LogiMove",
    teamType: "Lean Efficiency",
    cohort: "Cohort 2",
    state: "Kaduna",
    milestone: "MVP Development",
    grantStatus: "At Risk",
    talentPlaced: 2,
    jobsCreated: 7,
    compliance: "Pending",
    lastSync: "8 min ago",
  },
  {
    id: "boi-6",
    founder: "Amaka Eze",
    startup: "SkillBridge",
    teamType: "Lean Efficiency",
    cohort: "Cohort 3",
    state: "Oyo",
    milestone: "Team Formation",
    grantStatus: "In Review",
    talentPlaced: 3,
    jobsCreated: 11,
    compliance: "Verified",
    lastSync: "4 min ago",
  },
];

export interface BoiStatePlacement {
  state: "Lagos" | "Abuja FCT" | "Kano" | "Rivers" | "Kaduna" | "Oyo";
  cohort: "Cohort 1" | "Cohort 2" | "Cohort 3";
  placements: number;
  jobsCreated: number;
  activeStartups: number;
  complianceRate: number;
}

export const boiTalentHeatmap: BoiStatePlacement[] = [
  {
    state: "Lagos",
    cohort: "Cohort 3",
    placements: 148,
    jobsCreated: 620,
    activeStartups: 18,
    complianceRate: 98,
  },
  {
    state: "Abuja FCT",
    cohort: "Cohort 2",
    placements: 96,
    jobsCreated: 351,
    activeStartups: 12,
    complianceRate: 96,
  },
  {
    state: "Kano",
    cohort: "Cohort 1",
    placements: 74,
    jobsCreated: 268,
    activeStartups: 9,
    complianceRate: 94,
  },
  {
    state: "Rivers",
    cohort: "Cohort 3",
    placements: 88,
    jobsCreated: 312,
    activeStartups: 11,
    complianceRate: 95,
  },
  {
    state: "Kaduna",
    cohort: "Cohort 2",
    placements: 61,
    jobsCreated: 214,
    activeStartups: 8,
    complianceRate: 91,
  },
  {
    state: "Oyo",
    cohort: "Cohort 3",
    placements: 79,
    jobsCreated: 286,
    activeStartups: 10,
    complianceRate: 93,
  },
];

export interface TalentLeaderboardRecord {
  id: string;
  fellow: string;
  cohort: "Cohort 1" | "Cohort 2" | "Cohort 3";
  retentionScore: number;
  equityAlignment: number;
  matchScore: number;
  startup: string;
}

export const talentPerformanceLeaderboard: TalentLeaderboardRecord[] = [
  {
    id: "tl-1",
    fellow: "Amina Bello",
    cohort: "Cohort 3",
    retentionScore: 97,
    equityAlignment: 95,
    matchScore: 96,
    startup: "GreenGrid Energy",
  },
  {
    id: "tl-2",
    fellow: "Tunde Adeyemi",
    cohort: "Cohort 2",
    retentionScore: 94,
    equityAlignment: 92,
    matchScore: 92,
    startup: "EduBridge AI",
  },
  {
    id: "tl-3",
    fellow: "Ngozi Eze",
    cohort: "Cohort 3",
    retentionScore: 92,
    equityAlignment: 90,
    matchScore: 89,
    startup: "PayFlow Africa",
  },
  {
    id: "tl-4",
    fellow: "Fatima Abdullahi",
    cohort: "Cohort 3",
    retentionScore: 90,
    equityAlignment: 88,
    matchScore: 91,
    startup: "HealthLink NG",
  },
  {
    id: "tl-5",
    fellow: "Emeka Nwosu",
    cohort: "Cohort 1",
    retentionScore: 87,
    equityAlignment: 84,
    matchScore: 85,
    startup: "AgriTech Pro",
  },
];

export interface GraduatePipelineRecord {
  id: string;
  fellow: string;
  cohort: "Cohort 1" | "Cohort 2" | "Cohort 3";
  status: "Matched" | "In Startup" | "Vesting Active";
  startup: string;
  equityVested: number;
  inStartup: boolean;
}

export const graduatePipeline: GraduatePipelineRecord[] = [
  {
    id: "gp-1",
    fellow: "Amina Bello",
    cohort: "Cohort 3",
    status: "In Startup",
    startup: "GreenGrid Energy",
    equityVested: 3.1,
    inStartup: true,
  },
  {
    id: "gp-2",
    fellow: "Tunde Adeyemi",
    cohort: "Cohort 2",
    status: "Vesting Active",
    startup: "EduBridge AI",
    equityVested: 4.2,
    inStartup: true,
  },
  {
    id: "gp-3",
    fellow: "Ngozi Eze",
    cohort: "Cohort 3",
    status: "Matched",
    startup: "PayFlow Africa",
    equityVested: 1.4,
    inStartup: true,
  },
  {
    id: "gp-4",
    fellow: "Emeka Nwosu",
    cohort: "Cohort 1",
    status: "Vesting Active",
    startup: "AgriTech Pro",
    equityVested: 2.6,
    inStartup: true,
  },
  {
    id: "gp-5",
    fellow: "Fatima Abdullahi",
    cohort: "Cohort 3",
    status: "In Startup",
    startup: "HealthLink NG",
    equityVested: 3.8,
    inStartup: true,
  },
  {
    id: "gp-6",
    fellow: "David Ogunlade",
    cohort: "Cohort 2",
    status: "Matched",
    startup: "LogiMove",
    equityVested: 1.1,
    inStartup: false,
  },
];

export const trainingRoiData = [
  {
    month: "Jan",
    trained: 180,
    foundingEngineers: 42,
    retainedAfter90Days: 37,
  },
  {
    month: "Feb",
    trained: 205,
    foundingEngineers: 53,
    retainedAfter90Days: 46,
  },
  {
    month: "Mar",
    trained: 230,
    foundingEngineers: 66,
    retainedAfter90Days: 58,
  },
  {
    month: "Apr",
    trained: 245,
    foundingEngineers: 71,
    retainedAfter90Days: 63,
  },
  {
    month: "May",
    trained: 268,
    foundingEngineers: 84,
    retainedAfter90Days: 76,
  },
  {
    month: "Jun",
    trained: 290,
    foundingEngineers: 97,
    retainedAfter90Days: 88,
  },
];
