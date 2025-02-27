'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        className: 'rounded-md',
        style: { 
          background: 'white',
          color: 'black',
          border: '1px solid #e2e8f0'
        }
      }}
    />
  );
} 