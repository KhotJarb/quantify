// ============================================================================
// Quantify — Privacy-First Feature Telemetry (Cookie-Free, Non-Blocking)
// ============================================================================

export type TelemetryEventName =
  | 'compare_toggle'
  | 'show_math_toggle'
  | 'share_copy'
  | 'embed_open'
  | 'embed_copy'
  | 'brief_print'
  | 'chart_axis_change'
  | 'studio_waitlist_submit'
  | 'demand_vote'
  | 'demand_note'
  | 'scenario_save'
  | 'workbook_share'
  | 'studio_copy';

export function trackEvent(
  event: TelemetryEventName,
  meta?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({
      event,
      path: window.location.pathname,
      meta: meta ?? {},
      ts: new Date().toISOString(),
    });

    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/telemetry', blob);
    } else {
      void fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Telemetry must never interrupt user calculations
  }
}
