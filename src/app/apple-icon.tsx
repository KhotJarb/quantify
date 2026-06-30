import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple Touch Icon — 180×180. Dark background for home screen.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1f1d19',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ring */}
          <circle cx="54" cy="52" r="36" stroke="#5A5A5A" strokeWidth="11" fill="#2A2820" />
          {/* Handle */}
          <line x1="81" y1="79" x2="100" y2="100" stroke="#5A5A5A" strokeWidth="10" strokeLinecap="round" />
          {/* Bar 1 — short */}
          <rect x="26" y="53" width="13" height="21" rx="1.5" fill="#B07828" />
          {/* Bar 2 — medium */}
          <rect x="44" y="41" width="13" height="33" rx="1.5" fill="#C89030" />
          {/* Bar 3 — tall */}
          <rect x="62" y="29" width="13" height="45" rx="1.5" fill="#DCA840" />
          {/* Diagonal slash */}
          <line x1="20" y1="74" x2="76" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
