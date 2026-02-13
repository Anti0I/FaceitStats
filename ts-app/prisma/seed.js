const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const players = [
    {
      nickname: 'ZywOo',
      region: 'EU',
      level: 10,
      elo: 3200,
      kd: 1.45,
      hsPercentage: 42,
      winrate: 65,
      preferredRole: 'AWP',
      aggressiveness: 60,
      experience: 'Pro',
    },
    {
      nickname: 'NiKo',
      region: 'EU',
      level: 10,
      elo: 3150,
      kd: 1.25,
      hsPercentage: 55,
      winrate: 58,
      preferredRole: 'Entry',
      aggressiveness: 85,
      experience: 'Pro',
    },
    {
      nickname: 'm0NESY',
      region: 'EU',
      level: 10,
      elo: 3300,
      kd: 1.35,
      hsPercentage: 45,
      winrate: 62,
      preferredRole: 'AWP',
      aggressiveness: 70,
      experience: 'Pro',
    },
    {
      nickname: 'karrigan',
      region: 'EU',
      level: 10,
      elo: 2500,
      kd: 0.95,
      hsPercentage: 40,
      winrate: 60,
      preferredRole: 'IGL',
      aggressiveness: 50,
      experience: 'Veteran',
    },
    {
      nickname: 'ropz',
      region: 'EU',
      level: 10,
      elo: 2900,
      kd: 1.15,
      hsPercentage: 50,
      winrate: 59,
      preferredRole: 'Lurker',
      aggressiveness: 40,
      experience: 'Pro',
    },
    {
      nickname: 'jks',
      region: 'OCE',
      level: 10,
      elo: 2700,
      kd: 1.05,
      hsPercentage: 48,
      winrate: 55,
      preferredRole: 'Support',
      aggressiveness: 45,
      experience: 'Pro',
    },
  ];

  for (const p of players) {
    const player = await prisma.player.upsert({
      where: { nickname: p.nickname },
      update: {},
      create: p,
    });
    console.log(`Seeded player: ${player.nickname}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
