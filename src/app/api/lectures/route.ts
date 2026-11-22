import { NextResponse } from 'next/server';
import { getAllLectures } from '@/lib/lectures';

export async function GET() {
  const lectures = getAllLectures();
  return NextResponse.json(lectures);
}
