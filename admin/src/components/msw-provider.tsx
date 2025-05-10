// app/MswProvider.js
'use client'; // Mark as a Client Component

import { env } from '@/env';
import { enableMocking } from '@/mocks';
import { useEffect, useState } from 'react';

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(env.NEXT_PUBLIC_MOCK_API);

  useEffect(() => {
    if (!isReady && env.NEXT_PUBLIC_MOCK_API) {
      enableMocking()
        .then(() => setIsReady(true))
        .catch(console.error);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}