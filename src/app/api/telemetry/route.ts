import { NextResponse, after } from 'next/server';

const ALLOWED_EVENTS = new Set([
  'compare_toggle',
  'show_math_toggle',
  'share_copy',
  'embed_open',
  'embed_copy',
  'brief_print',
  'chart_axis_change',
  'studio_waitlist_submit',
  'demand_vote',
  'demand_note',
  'scenario_save',
  'workbook_share',
  'studio_copy',
]);

const HIGH_SIGNAL_EVENTS = new Set([
  'demand_vote',
  'demand_note',
  'embed_copy',
  'studio_copy',
  'workbook_share',
]);

function formatWebhookPayload(
  webhookUrl: string,
  record: { event: string; path: string; meta: Record<string, unknown>; ts: string }
) {
  const summary = `[Quantify ${record.event}] ${record.path} — ${JSON.stringify(record.meta)}`;
  if (webhookUrl.includes('discord.com/api/webhooks')) {
    return { content: summary.slice(0, 1900) };
  }
  if (webhookUrl.includes('hooks.slack.com')) {
    return { text: summary.slice(0, 1900) };
  }
  return record;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event?: string;
      path?: string;
      meta?: Record<string, unknown>;
      ts?: string;
    };

    if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const record = {
      event: body.event,
      path: typeof body.path === 'string' ? body.path.slice(0, 200) : '/',
      meta: body.meta ?? {},
      ts: body.ts || new Date().toISOString(),
    };

    console.info('[QUANTIFY_EVENT]', JSON.stringify(record));

    const telemetryUrl = process.env.TELEMETRY_WEBHOOK_URL?.trim();
    const studioFallbackUrl = HIGH_SIGNAL_EVENTS.has(record.event)
      ? process.env.STUDIO_WEBHOOK_URL?.trim()
      : undefined;
    const targetUrl = telemetryUrl || studioFallbackUrl;

    if (targetUrl) {
      after(async () => {
        try {
          await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formatWebhookPayload(targetUrl, record)),
            signal: AbortSignal.timeout(5000),
          });
        } catch {
          // Ignore webhook transport timeouts
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
