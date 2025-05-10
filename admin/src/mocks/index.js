// app/mocks/index.js
let isMockingEnabled = false;

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (isMockingEnabled) {
    console.log('[MSW] Worker already started, skipping...');
    return;
  }

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: (req) => {
      // Ignore requests to MSW's own Service Worker and Next.js assets
      if (
        req.url.includes('mockServiceWorker.js') ||
        req.url.includes('_next/') ||
        req.url.includes('__nextjs')
      ) {
        return; // Bypass these requests
      }
      console.warn('[MSW] Unhandled request:', req.url);
    },
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });

  isMockingEnabled = true;
  console.log('[MSW] Mocking enabled successfully');
}

export { enableMocking };
