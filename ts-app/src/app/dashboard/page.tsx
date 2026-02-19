import { PlayerOverview } from "@/components/features/dashboard/player-overview";
import { EloChart } from "@/components/features/dashboard/elo-chart";
import { MatchHistory } from "@/components/features/dashboard/match-history";
import { RoleEfficiency } from "@/components/features/dashboard/role-efficiency";
import { MOCK_PLAYER } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <PlayerOverview player={MOCK_PLAYER} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        <div className="col-span-4">
            <EloChart />
        </div>

        <div className="col-span-3">
            <RoleEfficiency />
        </div>
        
        <div className="col-span-7">
            <MatchHistory />
        </div>
      </div>
    </div>
  );
}
