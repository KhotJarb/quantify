import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Favicon — 32×32. Simplified version of the logo (ring + 3 bars).
// No diagonal slash (illegible at 32px).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: 7,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ring */}
          <circle cx="54" cy="52" r="36" stroke="#4A4A4A" strokeWidth="12" fill="white" />
          {/* Handle */}
          <line x1="81" y1="79" x2="100" y2="100" stroke="#4A4A4A" strokeWidth="11" strokeLinecap="round" />
          {/* Bar 1 */}
          <rect x="26" y="53" width="13" height="21" rx="1.5" fill="#B07828" />
          {/* Bar 2 */}
          <rect x="44" y="41" width="13" height="33" rx="1.5" fill="#C89030" />
          {/* Bar 3 */}
          <rect x="62" y="29" width="13" height="45" rx="1.5" fill="#DCA840" />
          {/* Diagonal */}
          <line x1="20" y1="74" x2="76" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
