"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayerSlot } from "@/components/features/team-builder/player-slot";
import { SynergyPanel } from "@/components/features/team-builder/synergy-panel";
import { TeamMember, ROLES } from "@/lib/schemas";
import { calculateTeamSynergy } from "@/lib/scoring-engine";
import { RefreshCcw, Save, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const createEmptyTeam = (): TeamMember[] =>
  Array(5)
    .fill(null)
    .map((_, i) => ({
      id: `slot-${i}`,
      nickname: "",
      role: null,
      stats: { elo: 0, kd: 0, hsPercentage: 0, winrate: 0 },
    }));

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<TeamMember[]>(createEmptyTeam());
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then(setAvailablePlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateMember = (index: number, updates: Partial<TeamMember>) => {
    const newTeam = [...team];
    newTeam[index] = { ...newTeam[index], ...updates };
    setTeam(newTeam);
  };

  const removeMember = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = {
      id: `slot-${index}`,
      nickname: "",
      role: null,
      stats: { elo: 0, kd: 0, hsPercentage: 0, winrate: 0 },
    };
    setTeam(newTeam);
  };

  const activePlayers = team.filter((p) => p.nickname !== "");
  const synergy = calculateTeamSynergy(activePlayers);
  const avgElo = activePlayers.length
    ? Math.round(activePlayers.reduce((acc, p) => acc + p.stats.elo, 0) / activePlayers.length)
    : 0;

  const takenRoles = activePlayers.map((p) => p.role).filter(Boolean);
  const takenPlayerNames = activePlayers.map((p) => p.nickname);

  const handleSaveTeam = async () => {
    if (!teamName.trim() || activePlayers.length < 2) return;

    setSaving(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          synergy,
          members: activePlayers,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setSaveDialogOpen(false);
          setTeamName("");
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save team");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Builder</h2>
          <p className="text-muted-foreground">
            Construct your dream roster and analyze synergy.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTeam(createEmptyTeam())}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Reset
          </Button>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={activePlayers.length < 2}>
                <Save className="mr-2 h-4 w-4" /> Save Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Team</DialogTitle>
                <DialogDescription>
                  Give your team a name to save it to the database.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Team name, e.g. Dream Squad"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <DialogFooter>
                <Button
                  onClick={handleSaveTeam}
                  disabled={!teamName.trim() || saving || saved}
                >
                  {saved ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Saved!
                    </>
                  ) : saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {team.map((member, index) => (
            <PlayerSlot
              key={member.id}
              member={member}
              index={index}
              onUpdate={(updates) => updateMember(index, updates)}
              onRemove={() => removeMember(index)}
              availablePlayers={availablePlayers}
              takenRoles={takenRoles as any[]}
              takenPlayerNames={takenPlayerNames}
            />
          ))}
        </div>

        <div className="space-y-6">
          <SynergyPanel
            synergy={synergy}
            activeCount={activePlayers.length}
            avgElo={avgElo}
          />
        </div>
      </div>
    </div>
  );
}
