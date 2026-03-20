import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BlueprintRole } from "@/data/mockData";
import { CheckCircle2, FileSignature, Send, BellRing } from "lucide-react";
import { syncSigningStatusToBoard } from "@/lib/founderFlowSimulationService";

type SigningStatus = "not_sent" | "sent" | "viewed" | "signed" | "declined";

type SigningParticipant = {
  id: string;
  name: string;
  roleLabel: string;
  status: SigningStatus;
  remindersSent: number;
};

interface DocumentSigningPanelProps {
  founderName: string;
  teamRoles: BlueprintRole[];
  finalizedProjectId: string | null;
}

const statusLabel: Record<SigningStatus, string> = {
  not_sent: "Not Sent",
  sent: "Sent",
  viewed: "Viewed",
  signed: "Signed",
  declined: "Declined",
};

const statusVariant: Record<SigningStatus, "secondary" | "default" | "destructive"> = {
  not_sent: "secondary",
  sent: "secondary",
  viewed: "secondary",
  signed: "default",
  declined: "destructive",
};

export function DocumentSigningPanel({ founderName, teamRoles, finalizedProjectId }: DocumentSigningPanelProps) {
  const initialParticipants = useMemo<SigningParticipant[]>(() => {
    const talentParticipants = teamRoles
      .filter((role) => role.matchedTalent)
      .map((role) => ({
        id: `talent-${role.id}`,
        name: role.matchedTalent!.name,
        roleLabel: role.title,
        status: "not_sent" as SigningStatus,
        remindersSent: 0,
      }));

    return [
      {
        id: "founder",
        name: founderName,
        roleLabel: "Founder",
        status: "not_sent",
        remindersSent: 0,
      },
      ...talentParticipants,
    ];
  }, [founderName, teamRoles]);

  const [participants, setParticipants] = useState<SigningParticipant[]>(initialParticipants);

  const summary = useMemo(() => {
    const total = participants.length;
    const signed = participants.filter((item) => item.status === "signed").length;
    const pending = participants.filter((item) => item.status !== "signed").length;
    return { total, signed, pending };
  }, [participants]);

  const aggregateSigningStatus = useMemo(() => {
    if (participants.length === 0) return "pending" as const;
    const allNotSent = participants.every((item) => item.status === "not_sent");
    if (allNotSent) return "pending" as const;
    const allSigned = participants.every((item) => item.status === "signed");
    if (allSigned) return "completed" as const;
    return "in_progress" as const;
  }, [participants]);

  useEffect(() => {
    if (!finalizedProjectId) return;
    syncSigningStatusToBoard(finalizedProjectId, aggregateSigningStatus);
  }, [aggregateSigningStatus, finalizedProjectId]);

  const updateStatus = (participantId: string, nextStatus: SigningStatus) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === participantId
          ? { ...participant, status: nextStatus }
          : participant,
      ),
    );
  };

  const sendPacket = (participantId: string) => {
    updateStatus(participantId, "sent");
  };

  const resendPacket = (participantId: string) => {
    updateStatus(participantId, "sent");
  };

  const remindParticipant = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === participantId
          ? {
              ...participant,
              remindersSent: participant.remindersSent + 1,
              status: participant.status === "not_sent" ? "sent" : participant.status,
            }
          : participant,
      ),
    );
  };

  const markViewed = (participantId: string) => {
    updateStatus(participantId, "viewed");
  };

  const markSigned = (participantId: string) => {
    updateStatus(participantId, "signed");
  };

  const markDeclined = (participantId: string) => {
    updateStatus(participantId, "declined");
  };

  return (
    <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "420ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <FileSignature className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Document Signing</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Team formation is done. This phase simulates sending and tracking agreement signatures for founder and selected talents.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-md border border-border/50 bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Participants</p>
          <p className="text-sm font-semibold">{summary.total}</p>
        </div>
        <div className="rounded-md border border-border/50 bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Signed</p>
          <p className="text-sm font-semibold text-accent">{summary.signed}</p>
        </div>
        <div className="rounded-md border border-border/50 bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-sm font-semibold">{summary.pending}</p>
        </div>
      </div>

      <div className="space-y-3">
        {participants.map((participant) => {
          const isSigned = participant.status === "signed";
          const canResend = participant.status === "sent" || participant.status === "viewed" || participant.status === "declined";
          const canProgress = participant.status === "sent" || participant.status === "viewed";

          return (
            <div key={participant.id} className="rounded-lg border border-border/50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">{participant.roleLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[participant.status]}>{statusLabel[participant.status]}</Badge>
                  {isSigned && <CheckCircle2 className="h-4 w-4 text-accent" />}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {participant.status === "not_sent" && (
                  <Button size="sm" onClick={() => sendPacket(participant.id)}>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Send Packet
                  </Button>
                )}

                {canResend && (
                  <Button size="sm" variant="outline" onClick={() => resendPacket(participant.id)}>
                    Re-send
                  </Button>
                )}

                {canProgress && (
                  <Button size="sm" variant="outline" onClick={() => markViewed(participant.id)}>
                    Mark Viewed
                  </Button>
                )}

                {canProgress && (
                  <Button size="sm" variant="outline" onClick={() => markSigned(participant.id)}>
                    Mark Signed
                  </Button>
                )}

                {canProgress && (
                  <Button size="sm" variant="outline" onClick={() => markDeclined(participant.id)}>
                    Mark Declined
                  </Button>
                )}

                {!isSigned && (
                  <Button size="sm" variant="outline" onClick={() => remindParticipant(participant.id)}>
                    <BellRing className="h-3.5 w-3.5 mr-1" />
                    Remind ({participant.remindersSent})
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
