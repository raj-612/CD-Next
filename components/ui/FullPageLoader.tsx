'use client';

import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
  step: string;
}

export function FullPageLoader({ step }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">Processing</h2>
          <p className="text-gray-500 text-center">{step}</p>
        </div>
      </div>
    </div>
  );
} 