import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/lib/schemas";
import { calculatePerformanceScore } from "@/lib/scoring-engine";
import { Trophy, Crosshair, Award, Percent } from "lucide-react";

export function PlayerOverview({ player }: { player: Player }) {
  const performanceScore = calculatePerformanceScore(player);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current ELO</CardTitle>
          <Trophy className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{player.elo}</div>
          <p className="text-xs text-muted-foreground">Level {player.level} • {player.region}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">K/D Ratio</CardTitle>
          <Crosshair className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{player.kd}</div>
          <p className="text-xs text-muted-foreground">HS: {player.hsPercentage}%</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          <Award className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{performanceScore}</div>
          <p className="text-xs text-muted-foreground">Winrate: {player.winrate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
