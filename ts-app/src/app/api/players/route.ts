import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all players
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { elo: 'desc' }
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

// POST - create a new player
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate captcha first
    const captchaToken = body.captchaToken;
    if (!captchaToken) {
      return NextResponse.json({ error: 'Captcha is required' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 });
    }

    // Create player
    const player = await prisma.player.create({
      data: {
        nickname: body.nickname,
        region: body.region,
        level: body.level,
        elo: body.elo,
        kd: body.kd,
        hsPercentage: body.hsPercentage,
        winrate: body.winrate,
        preferredRole: body.preferredRole,
        aggressiveness: body.aggressiveness,
        experience: body.experience,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A player with this nickname already exists' }, { status: 409 });
    }
    console.error('Failed to create player:', error);
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
