import { beforeEach, describe, expect, it, vi } from "vitest";
import { leanEfficiencyRoles } from "@/data/mockData";
import {
  getFinalizedFounderProjects,
  getIdiceBoardNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  registerFounderFinalization,
  subscribeToIdiceBoardUpdates,
  updateFounderProjectSigningStatus,
} from "@/lib/idiceBoardStore";

describe("idiceBoardStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("registers finalized projects and notifications", () => {
    const project = registerFounderFinalization({
      founderName: "Ada Founder",
      projectName: "FinTech MVP PROJECT",
      industry: "FinTech",
      stage: "mvp",
      strategy: "lean_team",
      finalizedAt: "2026-03-19T12:00:00.000Z",
      teamRoles: leanEfficiencyRoles,
    });

    const projects = getFinalizedFounderProjects();
    const notifications = getIdiceBoardNotifications();

    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe(project.id);
    expect(projects[0].teamMembers.length).toBeGreaterThan(0);
    expect(projects[0].signingStatus).toBe("pending");

    expect(notifications).toHaveLength(1);
    expect(notifications[0].projectId).toBe(project.id);
    expect(notifications[0].read).toBe(false);
  });

  it("updates signing status and marks notifications read", () => {
    const project = registerFounderFinalization({
      founderName: "Tayo Founder",
      projectName: "HealthTech Growth PROJECT",
      industry: "HealthTech",
      stage: "growth",
      strategy: "growth_team",
      finalizedAt: "2026-03-19T12:00:00.000Z",
      teamRoles: leanEfficiencyRoles,
    });

    updateFounderProjectSigningStatus(project.id, "completed");
    expect(getFinalizedFounderProjects()[0].signingStatus).toBe("completed");

    const notificationId = getIdiceBoardNotifications()[0].id;
    markNotificationAsRead(notificationId);
    expect(getIdiceBoardNotifications()[0].read).toBe(true);

    markAllNotificationsAsRead();
    expect(getIdiceBoardNotifications().every((item) => item.read)).toBe(true);
  });

  it("emits board update events via subscription", () => {
    const onUpdate = vi.fn();
    const unsubscribe = subscribeToIdiceBoardUpdates(onUpdate);

    registerFounderFinalization({
      founderName: "Kemi Founder",
      projectName: "AgriTech Prototype PROJECT",
      industry: "AgriTech",
      stage: "prototype",
      strategy: "lean_team",
      finalizedAt: "2026-03-19T12:00:00.000Z",
      teamRoles: leanEfficiencyRoles,
    });

    expect(onUpdate).toHaveBeenCalled();
    unsubscribe();
  });
});
