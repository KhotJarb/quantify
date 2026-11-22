import { ImageResponse } from 'next/og';
import { getCalculatorBySlug } from '@/lib/catalog';
import { getSuiteById, getSuiteForCategory } from '@/lib/suites';

export const alt = 'Quantify Precision Calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function CalculatorOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schema = getCalculatorBySlug(slug);

  const title = schema?.title ?? 'Precision Instrument';
  const description =
    schema?.description ??
    'Deterministic arbitrary-precision computation with A/B scenario comparison and auditable formula traces.';
  const suite = schema ? getSuiteById(getSuiteForCategory(schema.category)) : undefined;
  const suiteLabel = suite?.label?.toUpperCase() ?? 'QUANTIFY INSTRUMENT';
  const inputCount = schema?.inputs?.length ?? 0;
  const formulaCount = schema?.formulas?.length ?? 0;

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
          padding: '60px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top Suite & Brand Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid #6b5438',
              background: '#262018',
              color: '#deb47b',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {suiteLabel}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="30" height="30" viewBox="0 0 120 120" fill="none">
              <circle cx="54" cy="52" r="34" stroke="#f2efe9" strokeWidth="10" />
              <line x1="80" y1="78" x2="98" y2="96" stroke="#f2efe9" strokeWidth="10" strokeLinecap="round" />
              <rect x="28" y="54" width="12" height="19" rx="1.5" fill="#c99c62" />
              <rect x="46" y="42" width="12" height="31" rx="1.5" fill="#c99c62" />
              <rect x="64" y="30" width="12" height="43" rx="1.5" fill="#e0b57c" />
            </svg>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#f2efe9' }}>Quantify</span>
          </div>
        </div>

        {/* Instrument Title & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1020 }}>
          <div
            style={{
              fontSize: title.length > 34 ? 54 : 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#f5f2ec',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 25,
              lineHeight: 1.45,
              color: '#b4aba0',
            }}
          >
            {description.length > 155 ? `${description.slice(0, 152)}…` : description}
          </div>
        </div>

        {/* Verification Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #353028',
            paddingTop: 26,
            width: '100%',
            fontSize: 19,
            color: '#9a9186',
          }}
        >
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <span style={{ color: '#deb47b', fontWeight: 600 }}>Decimal.js Verified</span>
            <span>·</span>
            <span>Interactive A/B Scenarios</span>
            {inputCount > 0 && (
              <>
                <span>·</span>
                <span>
                  {inputCount} Inputs · {Math.max(1, formulaCount)} Formula Steps
                </span>
              </>
            )}
          </div>
          <span>quantify-ashen.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
