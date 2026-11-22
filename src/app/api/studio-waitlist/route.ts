import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface WaitlistPayload {
  email?: string;
  slug?: string;
  title?: string;
  useCase?: string;
  company?: string; // Honeypot field — real users leave blank
}

async function deliverWebhook(
  webhookUrl: string,
  entry: { email: string; slug: string; title: string; useCase: string; timestamp: string }
): Promise<boolean> {
  const summary = `Quantify Studio Early Access: ${entry.email} | Instrument: ${entry.title} (${entry.slug}) | Use case: ${entry.useCase}`;
  const isDiscord = webhookUrl.includes('discord.com/api/webhooks');
  const isSlack = webhookUrl.includes('hooks.slack.com');

  const body = isDiscord
    ? { content: `**${summary}**` }
    : isSlack
    ? { text: summary }
    : { type: 'studio_waitlist', ...entry };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  return res.ok;
}

async function deliverResend(
  apiKey: string,
  toEmail: string,
  fromEmail: string,
  entry: { email: string; slug: string; title: string; useCase: string; timestamp: string }
): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `[Quantify Studio] Early Access Request — ${entry.title}`,
      text: [
        `New Quantify Studio Early Access Request`,
        ``,
        `Email: ${entry.email}`,
        `Instrument: ${entry.title} (/calculator/${entry.slug})`,
        `Use Case: ${entry.useCase}`,
        `Timestamp: ${entry.timestamp}`,
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(5000),
  });
  return res.ok;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as WaitlistPayload;

    // Silent honeypot trap for automated spam bots
    if (data.company && data.company.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const email = (data.email ?? '').trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid work or personal email address.' },
        { status: 400 }
      );
    }

    const entry = {
      email,
      slug: (data.slug ?? 'unknown').slice(0, 120),
      title: (data.title ?? 'Quantify Instrument').slice(0, 140),
      useCase: (data.useCase ?? 'Embed on website').slice(0, 120),
      timestamp: new Date().toISOString(),
    };

    // Structured runtime log (always visible in Vercel Logs even before webhooks are configured)
    console.info('[QUANTIFY_STUDIO_WAITLIST]', JSON.stringify(entry));

    const deliveries: Promise<boolean>[] = [];

    const webhookUrl = process.env.STUDIO_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      deliveries.push(deliverWebhook(webhookUrl, entry).catch(() => false));
    }

    const resendKey = process.env.RESEND_API_KEY?.trim();
    const notifyEmail = process.env.STUDIO_NOTIFY_EMAIL?.trim();
    if (resendKey && notifyEmail) {
      const fromEmail =
        process.env.STUDIO_FROM_EMAIL?.trim() || 'Quantify Studio <onboarding@resend.dev>';
      deliveries.push(deliverResend(resendKey, notifyEmail, fromEmail, entry).catch(() => false));
    }

    if (deliveries.length > 0) {
      await Promise.all(deliveries);
    }

    return NextResponse.json({
      ok: true,
      delivered: deliveries.length > 0 ? 'forwarded' : 'logged',
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Could not process request. Please try again.' },
      { status: 400 }
    );
  }
}
