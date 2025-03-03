'use client';

import React from 'react';
import { ToastProvider } from "@/components/ui/toast-provider";
import { SetupProvider } from "@/context/SetupContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SetupProvider>
      {children}
      <ToastProvider />
    </SetupProvider>
  );
} 