// app/MswProvider.js
'use client'; // Mark as a Client Component

import { useEffect, useState } from 'react';
import { enableMocking } from '@/mocks';

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    enableMocking()
      .then(() => setIsReady(true))
      .catch(console.error);
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}