import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b0b0b 0%, #1f1147 100%)',
          color: 'white',
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 42,
          left: 60,
          fontSize: 28,
          opacity: 0.8,
        }}>retroarcade.in</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontFamily: 'monospace' }}>Retro Arcade Zone</div>
          <div style={{ fontSize: 28, marginTop: 16, opacity: 0.9 }}>
            Play Free Retro Browser Games
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}


