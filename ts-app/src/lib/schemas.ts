import { z } from "zod";

// --- Enums & Constants ---
export const ROLES = ["IGL", "Entry", "Support", "AWP", "Lurker"] as const;
export const REGIONS = ["EU", "NA", "SA", "ASIA", "OCE"] as const;

// --- Zod Schemas ---

// Step 1: Basic Info
export const playerInfoSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(15, "Nickname must be at most 15 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Nickname can only contain letters, numbers, underscores, and dashes"),
  region: z.enum(REGIONS),
  level: z.number().min(1).max(10), // Faceit Level 1-10
});

// Step 2: Statistics
export const playerStatsSchema = z.object({
  elo: z.number().min(0, "ELO cannot be negative").max(5000, "ELO limit reached"),
  kd: z.number().min(0).max(5.0),
  hsPercentage: z.number().min(0).max(100),
  winrate: z.number().min(0).max(100),
});

// Step 3: Playstyle
export const playerStyleSchema = z.object({
  preferredRole: z.enum(ROLES),
  aggressiveness: z.number().min(0).max(100), // Slider value
  experience: z.enum(["Online", "LAN", "Pro"]), // Simplified for now
});

// Combined Player Schema (for the full analysis form)
export const playerSchema = playerInfoSchema
  .merge(playerStatsSchema)
  .merge(playerStyleSchema);

// Team Builder Schema
export const teamMemberSchema = z.object({
    id: z.string().uuid(),
    nickname: z.string(),
    role: z.enum(ROLES).nullable(), // Role might not be assigned yet
    stats: playerStatsSchema,
});

export const teamSchema = z.object({
  name: z.string().min(3),
  players: z.array(teamMemberSchema).max(5),
});

// --- TypeScript Types ---
export type PlayerRole = (typeof ROLES)[number];
export type PlayerRegion = (typeof REGIONS)[number];
export type PlayerInfo = z.infer<typeof playerInfoSchema>;
export type PlayerStats = z.infer<typeof playerStatsSchema>;
export type PlayerStyle = z.infer<typeof playerStyleSchema>;
export type Player = z.infer<typeof playerSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Team = z.infer<typeof teamSchema>;

// --- Helper Predicates ---
export const isHighElo = (player: PlayerStats) => player.elo > 2500;
