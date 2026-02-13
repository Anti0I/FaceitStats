import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all teams with members
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// POST - save a new team
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, synergy, members } = body;

    if (!name || !members || members.length < 2) {
      return NextResponse.json({ error: 'Team name and at least 2 members required' }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        synergy: synergy || 0,
        members: {
          create: members.map((m: any) => ({
            nickname: m.nickname,
            role: m.role || 'Unassigned',
            elo: m.stats?.elo || 0,
            kd: m.stats?.kd || 0,
            hsPercentage: m.stats?.hsPercentage || 0,
            winrate: m.stats?.winrate || 0,
          })),
        },
      },
      include: { members: true },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Failed to create team:', error);
    return NextResponse.json({ error: 'Failed to save team' }, { status: 500 });
  }
}
