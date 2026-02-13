import { PlayerStats, TeamMember } from "./schemas";

// --- Performance Score ---

export function calculatePerformanceScore(stats: PlayerStats): number {
  const eloScore = Math.min(stats.elo / 3000, 1) * 100;
  const kdScore = Math.min(stats.kd / 2.0, 1) * 100;
  const hsScore = stats.hsPercentage;
  const winrateScore = stats.winrate;

  const score = eloScore * 0.4 + kdScore * 0.3 + hsScore * 0.1 + winrateScore * 0.2;
  return Math.round(score);
}

// --- Team Synergy ---
// Simply: each player = +20%. 0 players = 0%, 5 players = 100%.

export function calculateTeamSynergy(players: TeamMember[]): number {
  return Math.min(players.length * 20, 100);
}
