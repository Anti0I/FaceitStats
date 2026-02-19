"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Users, Crosshair, Shield, Sword, Target, Eye } from "lucide-react";

interface TeamMemberData {
  id: string;
  nickname: string;
  role: string;
  elo: number;
  kd: number;
  hsPercentage: number;
  winrate: number;
}

interface TeamData {
  id: string;
  name: string;
  synergy: number;
  members: TeamMemberData[];
  createdAt: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  AWP: <Crosshair className="h-3 w-3" />,
  Entry: <Sword className="h-3 w-3" />,
  Support: <Shield className="h-3 w-3" />,
  IGL: <Eye className="h-3 w-3" />,
  Lurker: <Target className="h-3 w-3" />,
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Saved Teams
        </h2>
        <p className="text-muted-foreground">
          {teams.length} team{teams.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {teams.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mb-4 opacity-50" />
            <p>No teams saved yet. Build one in the Team Builder!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.id} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <Badge
                    className={`text-sm ${
                      team.synergy >= 80
                        ? "bg-green-500/20 text-green-400 border-green-500/30 absolute top 4 right 10"
                        : team.synergy >= 50
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 "
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                    variant="outline"
                  >
                    Synergy: {team.synergy}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {team.members.length} players • {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {team.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {roleIcons[m.role] || <Users className="h-3 w-3" />}
                        <span className="font-medium">{m.nickname}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {m.role}
                        </Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>ELO {m.elo}</span>
                        <span>KD {m.kd.toFixed(2)}</span>
                        <span>WR {m.winrate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
