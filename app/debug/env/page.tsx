'use client';

function mask(v?: string) {
  if (!v) return 'MISSING';
  if (v.length <= 8) return v;
  return v.slice(0, 4) + '...' + v.slice(-4);
}

export default function EnvDebugPage() {
  const env = {
    NEXT_PUBLIC_FIREBASE_API_KEY: mask(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  return (
    <pre style={{
      padding: 16,
      background: '#111',
      color: '#0f0',
      borderRadius: 8,
      fontSize: 14,
      overflowX: 'auto'
    }}>
      {JSON.stringify(env, null, 2)}
    </pre>
  );
}
