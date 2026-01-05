import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Text from '@/models/Text';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { text, expirationType, expirationValue } = await request.json();

    const expiresAt = expirationType === 'time' 
      ? new Date(Date.now() + expirationValue * 60 * 60 * 1000)
      : null;

    const maxViews = expirationType === 'views' ? expirationValue : null;

    const textDoc = await Text.create({
      text,
      expirationType,
      expiresAt,
      maxViews,
      views: 0,
    });

    return NextResponse.json({ id: textDoc._id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create text' }, { status: 500 });
  }
}