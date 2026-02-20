"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Crosshair, Shield, Sword, Target, Eye } from "lucide-react";

import { GenericList } from "@/components/GenericList";

interface Player {
  id: string;
  nickname: string;
  region: string;
  level: number;
  elo: number;
  kd: number;
  hsPercentage: number;
  winrate: number;
  preferredRole: string;
  aggressiveness: number;
  experience: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  AWP: <Crosshair className="h-3.5 w-3.5" />,
  Entry: <Sword className="h-3.5 w-3.5" />,
  Support: <Shield className="h-3.5 w-3.5" />,
  IGL: <Eye className="h-3.5 w-3.5" />,
  Lurker: <Target className="h-3.5 w-3.5" />,
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch players");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.error("API returned non-array data:", data);
          setPlayers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching players:", err);
        setPlayers([]); // Ensure it's always an array
      })
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
          <Users className="h-8 w-8 text-primary" />
          All Players
        </h2>
        <p className="text-muted-foreground">
          {players.length} player{players.length !== 1 ? "s" : ""} in database
        </p>
      </div>

      <GenericList
        items={players}
        keyExtractor={(player) => player.id}
        emptyMessage="No players yet. Add one from the Add Player page."
        renderItem={(player) => (
          <Card className="border-primary/10 hover:border-primary/30 transition-colors h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{player.nickname}</CardTitle>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="text-xs">{player.region}</Badge>
                  <Badge className="text-xs">Lv.{player.level}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                {roleIcons[player.preferredRole]}
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{player.preferredRole}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {player.level === 10 && (
                  <div className="rounded-md bg-muted/50 p-2 text-center">
                    <p className="text-xs text-muted-foreground">ELO</p>
                    <p className="font-bold text-primary">{player.elo}</p>
                  </div>
                )}
                <div className="rounded-md bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">K/D</p>
                  <p className="font-bold">{player.kd.toFixed(2)}</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">HS%</p>
                  <p className="font-bold">{player.hsPercentage}%</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Winrate</p>
                  <p className="font-bold">{player.winrate}%</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Aggression</p>
                  <p className="font-bold">{player.aggressiveness}%</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Experience: <span className="text-foreground">{player.experience}</span>
              </div>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}

