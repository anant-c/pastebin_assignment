import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Text from '@/models/Text';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const textDoc = await Text.findById(id);

    if (!textDoc) {
      return NextResponse.json({ error: 'Text not found' }, { status: 404 });
    }

    // Check if expired by time
    if (textDoc.expiresAt && new Date() > textDoc.expiresAt) {
      await Text.findByIdAndDelete(id);
      return NextResponse.json({ error: 'Text has expired' }, { status: 410 });
    }

    // Check if expired by views
    if (textDoc.maxViews && textDoc.views >= textDoc.maxViews) {
      await Text.findByIdAndDelete(id);
      return NextResponse.json({ error: 'Text has expired' }, { status: 410 });
    }

    // Increment view count
    textDoc.views += 1;
    await textDoc.save();

    // Check if this was the last view
    const isLastView = textDoc.maxViews && textDoc.views >= textDoc.maxViews;
    if (isLastView) {
      await Text.findByIdAndDelete(id);
    }

    return NextResponse.json({
      text: textDoc.text,
      views: textDoc.views,
      maxViews: textDoc.maxViews,
      expiresAt: textDoc.expiresAt,
      isLastView,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve text' }, { status: 500 });
  }
}