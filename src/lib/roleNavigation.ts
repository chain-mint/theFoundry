import type { PersonaRole } from "@/context/AuthContext";

export type MenuKey =
  | "dashboard"
  | "team"
  | "matches"
  | "impact"
  | "notifications"
  | "settings";

type MenuDefinition = {
  key: MenuKey;
  title: string;
  url: string;
};

type PageIntent = {
  title: string;
  subtitle: string;
};

const MENU_DEFINITIONS: Record<MenuKey, MenuDefinition> = {
  dashboard: { key: "dashboard", title: "Dashboard", url: "/dashboard" },
  team: { key: "team", title: "Team Blueprint", url: "/team" },
  matches: { key: "matches", title: "Matches", url: "/matches" },
  impact: { key: "impact", title: "Impact Reports", url: "/impact" },
  notifications: {
    key: "notifications",
    title: "Notifications",
    url: "/notifications",
  },
  settings: { key: "settings", title: "Profile & Settings", url: "/settings" },
};

export const ROLE_LABELS: Record<PersonaRole, string> = {
  talent: "3MTT Talent",
  founder: "iDICE Founder",
  "boi-officer": "iDICE Board / BOI",
  admin: "3MTT Admin",
};

const ROLE_MENU_KEYS: Record<PersonaRole, MenuKey[]> = {
  talent: [
    "dashboard",
    "matches",
    "team",
    "notifications",
    "impact",
    "settings",
  ],
  founder: ["dashboard", "team", "matches", "impact", "settings"],
  "boi-officer": ["dashboard", "team", "matches", "impact", "settings"],
  admin: ["dashboard", "team", "matches", "impact", "settings"],
};

const ROLE_LABEL_OVERRIDES: Partial<
  Record<PersonaRole, Partial<Record<MenuKey, string>>>
> = {
  talent: {
    team: "Assigned Team Context",
    impact: "My Impact & Equity",
    settings: "My Profile",
  },
  founder: {
    matches: "Talent Matching",
    impact: "Milestone & Grant Readiness",
  },
  "boi-officer": {
    team: "Portfolio Oversight",
    impact: "Reports",
  },
  admin: {
    team: "Program Ops",
    matches: "Placement Pipeline",
  },
};

export function getRoleNavigation(role: PersonaRole): MenuDefinition[] {
  const overrides = ROLE_LABEL_OVERRIDES[role] ?? {};
  return ROLE_MENU_KEYS[role].map((key) => ({
    ...MENU_DEFINITIONS[key],
    title: overrides[key] ?? MENU_DEFINITIONS[key].title,
  }));
}

export function getAllowedMenuKeys(role: PersonaRole): MenuKey[] {
  return ROLE_MENU_KEYS[role];
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/dashboard";
  const trimmed =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return trimmed || "/dashboard";
}

export function canAccessPath(role: PersonaRole, path: string): boolean {
  const normalizedPath = normalizePath(path);
  const allowedPaths = new Set(
    ROLE_MENU_KEYS[role].map((key) => MENU_DEFINITIONS[key].url),
  );
  return allowedPaths.has(normalizedPath);
}

const TEAM_PAGE_INTENTS: Record<PersonaRole, PageIntent> = {
  talent: {
    title: "Assigned Team Context",
    subtitle: "View your assigned role, team structure, and founder context.",
  },
  founder: {
    title: "Team Blueprint",
    subtitle: "Review available talent profiles to shape your startup team.",
  },
  "boi-officer": {
    title: "Portfolio Oversight",
    subtitle:
      "Monitor finalized team composition across funded founder portfolios.",
  },
  admin: {
    title: "Program Ops",
    subtitle: "Track cohort-level team composition and placement operations.",
  },
};

const MATCHES_PAGE_INTENTS: Record<PersonaRole, PageIntent> = {
  talent: {
    title: "Matches",
    subtitle:
      "Review opportunities matched to your skills and onboarding readiness.",
  },
  founder: {
    title: "Talent Matching",
    subtitle: "Evaluate recommended fellows to fill key startup roles.",
  },
  "boi-officer": {
    title: "Matches",
    subtitle:
      "Observe talent-to-startup pairing progress across the active portfolio.",
  },
  admin: {
    title: "Placement Pipeline",
    subtitle:
      "Track matching throughput, handoffs, and conversion across cohorts.",
  },
};

const IMPACT_PAGE_INTENTS: Record<PersonaRole, PageIntent> = {
  talent: {
    title: "My Impact & Equity",
    subtitle:
      "Track your placement outcomes, growth milestones, and equity signals.",
  },
  founder: {
    title: "Milestone & Grant Readiness",
    subtitle:
      "Measure startup progress and readiness indicators for iDICE grant milestones.",
  },
  "boi-officer": {
    title: "Reports",
    subtitle:
      "Real-time portfolio tracking, compliance verification, and downloadable oversight reports.",
  },
  admin: {
    title: "Impact Reports",
    subtitle:
      "Monitor cohort quality, placement outcomes, and operational program metrics.",
  },
};

export function getTeamPageIntent(role: PersonaRole): PageIntent {
  return TEAM_PAGE_INTENTS[role];
}

export function getMatchesPageIntent(role: PersonaRole): PageIntent {
  return MATCHES_PAGE_INTENTS[role];
}

export function getImpactPageIntent(role: PersonaRole): PageIntent {
  return IMPACT_PAGE_INTENTS[role];
}
