import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TeamMember, ROLES, PlayerRole } from "@/lib/schemas";
import { UserPlus, X, Shield, Sword, Crosshair, Target, Eye } from "lucide-react";

// Helper to get icon for role
const RoleIcon = ({ role }: { role: PlayerRole | null }) => {
    switch (role) {
        case "IGL": return <Eye className="h-4 w-4" />;
        case "Entry": return <Sword className="h-4 w-4" />;
        case "Support": return <Shield className="h-4 w-4" />;
        case "AWP": return <Crosshair className="h-4 w-4" />;
        case "Lurker": return <Target className="h-4 w-4" />;
        default: return <UserPlus className="h-4 w-4" />;
    }
}

interface PlayerSlotProps {
    member: TeamMember;
    index: number;
    onUpdate: (updates: Partial<TeamMember>) => void;
    onRemove: () => void;
    availablePlayers: any[];
    takenRoles: PlayerRole[];
    takenPlayerNames: string[];
}

export function PlayerSlot({ member, index, onUpdate, onRemove, availablePlayers, takenRoles, takenPlayerNames }: PlayerSlotProps) {
    const isOccupied = member.nickname !== "";

    const handleSelectPlayer = (nickname: string) => {
        const player = availablePlayers.find(p => p.nickname === nickname);
        if (player) {
             onUpdate({
                nickname: player.nickname,
                // If the player has a preferred role that isn't taken, use it. Otherwise null.
                role: !takenRoles.includes(player.preferredRole as PlayerRole) ? (player.preferredRole as PlayerRole) : null,
                stats: {
                    elo: player.elo,
                    kd: player.kd,
                    hsPercentage: player.hsPercentage,
                    winrate: player.winrate
                }
            });
        }
    };

    return (
        <Card className={`transition-all ${isOccupied ? 'border-primary/50 bg-card' : 'border-dashed border-border/50 bg-transparent hover:bg-card/20'}`}>
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${isOccupied ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`}>
                        <RoleIcon role={member.role} />
                    </div>
                    
                    {isOccupied ? (
                        <div className="space-y-1">
                            <h4 className="font-bold leading-none">{member.nickname}</h4>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>ELO: {member.stats.elo}</span>
                                <span>KD: {member.stats.kd}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                             <Select onValueChange={handleSelectPlayer}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Add Player..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlayers
                                        .filter(p => !takenPlayerNames.includes(p.nickname))
                                        .map(player => (
                                        <SelectItem key={player.id} value={player.nickname}>
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <span>{player.nickname}</span>
                                                <span className="text-xs text-muted-foreground">{player.elo} ELO</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isOccupied && (
                        <>
                             <Select onValueChange={(val) => onUpdate({ role: val as PlayerRole })}>
                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                    <SelectValue placeholder={member.role || "Choose Role"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map(role => (
                                        <SelectItem 
                                            key={role} 
                                            value={role}
                                            disabled={takenRoles.includes(role) && member.role !== role}
                                        >
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={onRemove}>
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
