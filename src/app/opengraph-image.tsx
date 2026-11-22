import { ImageResponse } from 'next/og';
import { getCatalogSummaries } from '@/lib/catalog';
import { FLAGSHIP_SUITES } from '@/lib/suites';

export const alt = 'Quantify — Precision Decision & Calculation Instruments';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const totalCount = getCatalogSummaries().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#171512',
          color: '#f2efe9',
          padding: '64px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top Brand Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#23201b',
                border: '1px solid #3c362e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 120 120" fill="none">
                <circle cx="54" cy="52" r="34" stroke="#f2efe9" strokeWidth="10" />
                <line x1="80" y1="78" x2="98" y2="96" stroke="#f2efe9" strokeWidth="10" strokeLinecap="round" />
                <rect x="28" y="54" width="12" height="19" rx="1.5" fill="#c99c62" />
                <rect x="46" y="42" width="12" height="31" rx="1.5" fill="#c99c62" />
                <rect x="64" y="30" width="12" height="43" rx="1.5" fill="#e0b57c" />
              </svg>
            </div>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Quantify
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid #6b5438',
              background: '#262018',
              color: '#deb47b',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.06em',
            }}
          >
            DECIMAL.JS PRECISION ENGINE
          </div>
        </div>

        {/* Main Display Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#f5f2ec',
            }}
          >
            Precision instruments for high-stakes decisions.
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              color: '#b4aba0',
            }}
          >
            Interactive A/B scenario comparison, live projection curves, and auditable formula traces across wealth, clinical health, engineering, science, and operations.
          </div>
        </div>

        {/* Bottom Proof Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #353028',
            paddingTop: 28,
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', gap: 44 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#deb47b' }}>
                {totalCount}
              </span>
              <span style={{ fontSize: 16, color: '#9a9186' }}>Verified Instruments</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#f2efe9' }}>
                {FLAGSHIP_SUITES.length}
              </span>
              <span style={{ fontSize: 16, color: '#9a9186' }}>Flagship Suites</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#f2efe9' }}>
                A vs. B
              </span>
              <span style={{ fontSize: 16, color: '#9a9186' }}>Live Scenario Diffs</span>
            </div>
          </div>

          <span style={{ fontSize: 20, color: '#9a9186' }}>
            quantify-ashen.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
