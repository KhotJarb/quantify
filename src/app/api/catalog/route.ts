import { NextResponse } from 'next/server';
import { getCatalogSummaries, getCategorySummaries } from '@/lib/catalog';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    catalog: getCatalogSummaries(),
    categories: getCategorySummaries(),
  });
}
