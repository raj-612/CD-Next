'use client';

import { useSetup } from "@/context/SetupContext";
import { PreSetup } from "@/components/PreSetupModule";
import { MainSetup } from "@/components/MainSetupModule";

export default function Home() {
  const { state } = useSetup();
  
  // If pre-setup is not done, show the PreSetup component
  if (!state.isPreSetupDone) {
    return <PreSetup />;
  }
  
  // Otherwise, show the MainSetup component directly
  return <MainSetup />;
}
