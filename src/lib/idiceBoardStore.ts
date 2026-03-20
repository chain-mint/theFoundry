import { type BlueprintRole } from "@/data/mockData";

export type FounderStage = "idea" | "prototype" | "mvp" | "growth";
export type FounderStrategy = "growth_team" | "lean_team";

export interface FinalizedTeamMember {
  roleId: string;
  roleTitle: string;
  talentName: string;
  matchScore: number;
}

export interface FinalizedFounderProject {
  id: string;
  founderName: string;
  projectName: string;
  industry: string;
  stage: FounderStage;
  strategy: FounderStrategy;
  finalizedAt: string;
  signingStatus: "pending" | "in_progress" | "completed";
  teamMembers: FinalizedTeamMember[];
}

export interface IdiceBoardNotification {
  id: string;
  projectId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type ProjectSigningStatus = "pending" | "in_progress" | "completed";

interface RegisterFinalizationInput {
  founderName: string;
  projectName: string;
  industry: string;
  stage: FounderStage;
  strategy: FounderStrategy;
  finalizedAt: string;
  teamRoles: BlueprintRole[];
}

const PROJECTS_KEY = "foundry.idice.projects";
const NOTIFICATIONS_KEY = "foundry.idice.notifications";
const BOARD_UPDATED_EVENT = "foundry:idice-board-updated";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const isBrowser = () => typeof window !== "undefined";

const emitBoardUpdated = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(BOARD_UPDATED_EVENT));
};

export function getFinalizedFounderProjects(): FinalizedFounderProject[] {
  if (!isBrowser()) return [];
  const projects = safeParse<FinalizedFounderProject[]>(
    window.localStorage.getItem(PROJECTS_KEY),
    [],
  );
  return projects.sort(
    (a, b) =>
      new Date(b.finalizedAt).getTime() - new Date(a.finalizedAt).getTime(),
  );
}

export function getIdiceBoardNotifications(): IdiceBoardNotification[] {
  if (!isBrowser()) return [];
  const notifications = safeParse<IdiceBoardNotification[]>(
    window.localStorage.getItem(NOTIFICATIONS_KEY),
    [],
  );
  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function registerFounderFinalization(
  input: RegisterFinalizationInput,
): FinalizedFounderProject {
  if (!isBrowser()) {
    return {
      id: "serverless-placeholder",
      founderName: input.founderName,
      projectName: input.projectName,
      industry: input.industry,
      stage: input.stage,
      strategy: input.strategy,
      finalizedAt: input.finalizedAt,
      signingStatus: "pending",
      teamMembers: [],
    };
  }

  const projects = getFinalizedFounderProjects();
  const projectId = `proj-${Date.now()}`;

  const nextProject: FinalizedFounderProject = {
    id: projectId,
    founderName: input.founderName,
    projectName: input.projectName,
    industry: input.industry,
    stage: input.stage,
    strategy: input.strategy,
    finalizedAt: input.finalizedAt,
    signingStatus: "pending",
    teamMembers: input.teamRoles
      .filter((role) => role.matchedTalent)
      .map((role) => ({
        roleId: role.id,
        roleTitle: role.title,
        talentName: role.matchedTalent!.name,
        matchScore: role.matchedTalent!.matchScore,
      })),
  };

  const nextProjects = [nextProject, ...projects];
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(nextProjects));

  const notification: IdiceBoardNotification = {
    id: `notif-${Date.now()}`,
    projectId,
    title: "Founder Team Finalized",
    message: `${input.founderName} finalized team formation for ${input.projectName}.`,
    createdAt: input.finalizedAt,
    read: false,
  };

  const notifications = getIdiceBoardNotifications();
  window.localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify([notification, ...notifications]),
  );

  emitBoardUpdated();

  return nextProject;
}

export function updateFounderProjectSigningStatus(
  projectId: string,
  signingStatus: ProjectSigningStatus,
): void {
  if (!isBrowser()) return;
  const projects = getFinalizedFounderProjects();
  const updated = projects.map((project) =>
    project.id === projectId ? { ...project, signingStatus } : project,
  );
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  emitBoardUpdated();
}

export function markNotificationAsRead(notificationId: string): void {
  if (!isBrowser()) return;
  const notifications = getIdiceBoardNotifications();
  const updated = notifications.map((item) =>
    item.id === notificationId ? { ...item, read: true } : item,
  );
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  emitBoardUpdated();
}

export function markAllNotificationsAsRead(): void {
  if (!isBrowser()) return;
  const notifications = getIdiceBoardNotifications();
  const updated = notifications.map((item) => ({ ...item, read: true }));
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  emitBoardUpdated();
}

export function subscribeToIdiceBoardUpdates(onUpdate: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(BOARD_UPDATED_EVENT, onUpdate);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROJECTS_KEY || event.key === NOTIFICATIONS_KEY) {
      onUpdate();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(BOARD_UPDATED_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}
