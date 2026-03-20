import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import type { PersonaRole } from "@/context/AuthContext";

const mockUseAuth = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggle: vi.fn(),
  }),
}));

function renderSidebarForRole(role: PersonaRole) {
  mockUseAuth.mockReturnValue({
    user: {
      name: "Test User",
      role,
      avatar: "TU",
    },
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </MemoryRouter>,
  );
}

describe("AppSidebar role visibility", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("shows talent-specific labels and notifications", () => {
    renderSidebarForRole("talent");

    expect(screen.getByText("Assigned Team Context")).toBeInTheDocument();
    expect(screen.getByText("My Impact & Equity")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("hides notifications for founder and applies founder copy", () => {
    renderSidebarForRole("founder");

    expect(screen.getByText("Talent Matching")).toBeInTheDocument();
    expect(screen.getByText("Milestone & Grant Readiness")).toBeInTheDocument();
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
  });

  it("shows admin operations labels", () => {
    renderSidebarForRole("admin");

    expect(screen.getByText("Program Ops")).toBeInTheDocument();
    expect(screen.getByText("Placement Pipeline")).toBeInTheDocument();
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
  });
});
