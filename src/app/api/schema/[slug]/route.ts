import { NextResponse } from 'next/server';
import { getCalculatorBySlug } from '@/lib/catalog';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const schema = getCalculatorBySlug(slug);

  if (!schema) {
    return NextResponse.json(
      { error: 'Calculator not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(schema, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
