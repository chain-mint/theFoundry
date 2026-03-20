# Founder Flow Implementation Todo

This document defines a phase-by-phase implementation plan for the founder journey, aligned with the pitch deck and designed as a tab-based experience so founders can move backward and edit at any time.

## Target Flow (Tabs)

1. Problem/Solution
2. Industry Selection (or manual entry)
3. Startup Stage + Generate Team Architecture
4. Team Strategy Choice (Growth vs Lean Team)
5. Blueprint Roles (auto-generated + founder customization)
6. Talent Matching per Role (primary + alternatives)
7. Meet & Lock Team (invite, accept/reject, chat/call)
8. Finalize & Save Progress

## Phase 1: Product and UX Definition

- [ ] Finalize tab names and tab order.
- [ ] Define navigation rules:
  - Founders can go back to any previous tab.
  - Editing upstream tabs marks downstream results as stale and requires regeneration where needed.
- [ ] Define required fields and validation per tab.
- [ ] Define empty states, loading states, and error states for each tab.
- [ ] Define save model: autosave vs explicit save button.
- [ ] Define milestones for role generation and talent matching.

Acceptance:

- [ ] A single source of truth for step transitions and dependency rules exists.
- [ ] A founder can edit earlier decisions without breaking data integrity.

## Phase 2: Data Model and State Architecture

- [ ] Create a `FounderFlowState` model with sections:
  - Problem/solution
  - Industry
  - Stage
  - Selected strategy (`growth_team | lean_team`)
  - Blueprint roles (generated + custom)
  - Role-to-talent assignments
  - Talent response states (`pending | accepted | rejected`)
  - Collaboration links (chat/call metadata)
  - iDICE board visibility status (`in_progress | finalized`)
  - Flow completion status
- [ ] Add versioning/hash fields for generated outputs so stale data is detectable.
- [ ] Add persistence strategy for frontend simulation only (React state + local storage/session storage mock).
- [ ] Add tab-level completion metadata for progress UI.

Acceptance:

- [ ] Flow can be reloaded without losing progress.
- [ ] Changing Problem/Industry/Stage invalidates only dependent tabs.

## Phase 3: Tab Shell and Navigation Framework

- [ ] Build a tab container in founder dashboard UI.
- [ ] Add `Previous`, `Next`, and direct tab click behavior with guardrails.
- [ ] Show completion indicators per tab.
- [ ] Add stale-data badges on affected tabs after upstream edits.
- [ ] Add "Save Draft" and "Continue Later" behavior.

Acceptance:

- [ ] Founders can jump between completed tabs.
- [ ] Incomplete required tabs block finalization only, not drafting.

## Phase 4: Intake Tabs (1-3)

### Tab 1: Problem/Solution

- [ ] Input fields for founder problem and proposed solution.
- [ ] Validation for minimum detail quality.

### Tab 2: Industry

- [ ] Industry dropdown list.
- [ ] "Other" option with free-text industry input.

### Tab 3: Stage + Generate

- [ ] Stage selector: `Idea`, `Prototype`, `MVP`, `Growth`.
- [ ] `Generate Architecture` CTA that starts blueprint generation.
- [ ] Loading and retry UI for generation failures.

Acceptance:

- [ ] Founder cannot generate without valid inputs.
- [ ] Generation event stores source inputs for traceability.

## Phase 5: Strategy and Blueprint Tabs (4-5)

### Tab 4: Team Strategy Choice

- [ ] Present `Growth` vs `Lean Team` cards with role count and burn impact summary.
- [ ] Capture selected strategy and trigger blueprint retrieval.

### Tab 5: Blueprint Roles Customization

- [ ] Show generated role list (2-3 roles for lean by default, max of 6 for growth).
- [ ] Allow founder actions:
  - Replace role skill mix (example: `Fullstack/AI` to `Fullstack/Smart Contract`).
  - Add role.
  - Remove role.
  - Edit role priority or milestone alignment.
- [ ] Add `Save Blueprint` action before advancing.

Acceptance:

- [ ] Founder can fully customize generated blueprint.
- [ ] Final saved blueprint becomes the source for talent matching.

## Phase 6: Talent Population and Replacement (Tab 6)

- [ ] Auto-fill each blueprint role with a best-match simulated 3MTT talent.
- [ ] Show alternative qualified talents per role.
- [ ] Allow founder to replace assigned talent per role.
- [ ] Allow founder to click on the listed talent to view the talent's profile by the sidebar without leaving the current screen.
- [ ] Track replacement history for audit and later review.
- [ ] Prevent duplicate outreach to already rejected talent for the same project.

Acceptance:

- [ ] Every required role has at least one assigned talent or explicit "unfilled" status.
- [ ] Founder can swap talents and save revised assignments.

## Phase 7: Meet, Invite, and Lock Team (Tab 7)

- [ ] Add `Lock Team` action to send hire requests to selected talents.
- [ ] Implement notification workflow for talents.
- [ ] Add response handling:
  - `Accepted`: enable chat/schedule call CTA.
  - `Rejected`: mark candidate as rejected for this founder/project.
- [ ] Notify founder in real time when responses change.
- [ ] Show communication options per accepted talent.

Acceptance:

- [ ] Founder sees clear per-role response status.
- [ ] Rejected talents are blocked from re-invite on the same project.

## Phase 8: Finalization and Completion (Tab 8)

- [ ] Add final review summary across all tabs.
- [ ] Add `Finish Team Setup` action.
- [ ] Persist finalized team in frontend mock store and lock project snapshot.
- [ ] Keep project editable via a controlled "re-open" flow if needed.
- [ ] Trigger iDICE Board notification event when a project is finalized.

Acceptance:

- [ ] Finalized project state is saved and reloadable.
- [ ] Founder has a clear success state and next actions.

## Phase 9: Document Signing Simulation (Post-Finalization)

- [ ] Add a dedicated post-finalization phase for agreement/document signing.
- [ ] Model signing packets in frontend state (founder + selected talents).
- [ ] Add simulated document states:
  - `not_sent`
  - `sent`
  - `viewed`
  - `signed`
  - `declined`
- [ ] Add UI for sending, re-sending, and viewing signing status per participant.
- [ ] Add reminders for unsigned documents (simulated timers/events).

Acceptance:

- [ ] Signing flow is clearly separated from team formation finalization.
- [ ] Founder can track who has and has not signed.

## Phase 10: iDICE Board Tracking and Notification Experience

- [ ] Add iDICE Board notification center (frontend simulated).
- [ ] Notify iDICE Board when founders finalize team formation.
- [ ] Build Board tracking view showing:
  - Count of founders that finalized team formation.
  - List of finalized founder projects.
  - Team members per founder project (roles + selected talents).
  - Finalization timestamp and current signing status.
- [ ] Add filters/search for project, founder name, and stage.

Acceptance:

- [ ] iDICE Board can quickly see overall finalization progress.
- [ ] iDICE Board can inspect team composition for each founder project.

## Phase 11: Frontend Simulation and Integration Tasks (No Backend)

- [x] Define frontend service layer contracts (mock APIs) for:
  - Team architecture generation
  - Blueprint save/update
  - Talent match retrieval
  - Talent replacement
  - Invite/response lifecycle
  - Project finalization
  - Document signing lifecycle
  - iDICE Board notifications and summary stats
- [x] Add deterministic mock data + seeded scenarios for demos and tests.
- [x] Add mock event bus/state dispatcher for notification flows.
- [x] Add event logging for analytics and reporting (frontend only).

Acceptance:

- [x] Frontend flow works end-to-end in simulation mode without backend.

## Phase 12: QA, Analytics, and Rollout

- [x] Write unit tests for state transitions and invalidation rules.
- [x] Write integration tests for complete founder happy path.
- [ ] Write edge-case tests:
  - Generation fail/retry
  - Talent rejection and replacement
  - Upstream edit after downstream completion
- [x] Add analytics funnel events per tab.
- [ ] Run pilot with internal users before wider release.

Acceptance:

- [ ] No blocking regressions in founder flow.
- [ ] Conversion and drop-off analytics are visible per tab.
- [ ] iDICE Board metrics match finalized founder project data.
- [ ] Document signing simulation states transition correctly.

## Build Order Recommendation

1. Tab shell + shared flow state
2. Tabs 1-3 (intake + generate)
3. Tabs 4-5 (strategy + blueprint customization)
4. Tab 6 (talent matching + replacement)
5. Tab 7 (invite/response/chat scheduling)
6. Tab 8 (finalization)
7. Phase 9 document signing simulation
8. Phase 10 iDICE Board tracking + notifications
9. Phase 11 frontend simulation integration
10. Tests, analytics, and polish

## Open Questions to Resolve Before Coding

- [ ] What exact role generation logic determines when Lean Team gets 2 vs 3 roles?
- [ ] Should founder edits on Tab 5 trigger immediate rematching on Tab 6 or require a manual "Rematch" click?
- [ ] What is the SLA for talent response before a role is flagged as at risk?
- [ ] Should chat and call scheduling be in-app only, or integrated with external tools?
- [ ] Can finalized projects be edited directly, or must they clone into a new version?
- [ ] What exact documents are required for signing, and in what order should founder/talent signatures happen?
- [ ] Should iDICE Board see only finalized projects, or also in-progress projects?
