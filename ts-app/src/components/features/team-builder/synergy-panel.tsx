import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface SynergyPanelProps {
  synergy: number;
  activeCount: number;
  avgElo: number;
}

export function SynergyPanel({ synergy, activeCount, avgElo }: SynergyPanelProps) {
  const data = [{ name: "Synergy", value: synergy, fill: "var(--primary)" }];

  return (
    <Card className="h-full border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-center">Team Synergy</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="h-[200px] w-full relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    innerRadius="70%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={data} 
                    startAngle={90} 
                    endAngle={-270}
                >
                     <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold">{synergy}%</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div className="rounded-lg bg-card p-3 border">
                <div className="text-xs text-muted-foreground">Avg ELO</div>
                <div className="font-bold text-lg">{avgElo}</div>
            </div>
            <div className="rounded-lg bg-card p-3 border">
                <div className="text-xs text-muted-foreground">Players</div>
                <div className="font-bold text-lg">{activeCount}/5</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
