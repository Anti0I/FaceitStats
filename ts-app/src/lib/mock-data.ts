import { Player, ROLES } from "./schemas";

export const MOCK_PLAYER: Player = {
  nickname: "Antii",
  region: "EU",
  level: 10,
  elo: 2843,
  kd: 1.42,
  hsPercentage: 58,
  winrate: 62,
  preferredRole: "AWP",
  aggressiveness: 65,
  experience: "Online",
};

export const MOCK_ELO_HISTORY = [
    { match: 1, elo: 2400 },
    { match: 2, elo: 2425 },
    { match: 3, elo: 2410 },
    { match: 4, elo: 2435 },
    { match: 5, elo: 2480 },
];

export const MOCK_MATCHES = [
    { id: 1, map: "Mirage", result: "WIN", score: "13-5", kd: 1.8, eloChange: "+25" },
    { id: 2, map: "Ancient", result: "LOSS", score: "11-13", kd: 0.9, eloChange: "-24" },
    { id: 3, map: "Anubis", result: "WIN", score: "13-9", kd: 1.2, eloChange: "+25" },
    { id: 4, map: "Nuke", result: "WIN", score: "13-2", kd: 2.1, eloChange: "+26" },
    { id: 5, map: "Vertigo", result: "LOSS", score: "5-13", kd: 0.8, eloChange: "-26" },
];

export const MOCK_ROLE_EFFICIENCY = [
    { role: "AWP", efficiency: 92, kills: 1420 },
    { role: "Entry", efficiency: 65, kills: 400 },
    { role: "Lurker", efficiency: 78, kills: 600 },
    { role: "Support", efficiency: 50, kills: 200 },
    { role: "IGL", efficiency: 40, kills: 100 },
];
