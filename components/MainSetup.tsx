'use client';

import { useSetup } from "@/context/SetupContext";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/ChatWidget";
import type { ClinicSetupSchema } from "@/types/schema";

// Define step types to match ClinicSetupSchema keys
const steps = [
  { id: "business_information" as keyof ClinicSetupSchema, label: "Business Information" },
  { id: "clinic" as keyof ClinicSetupSchema, label: "Clinic Locations" },
  { id: "staff" as keyof ClinicSetupSchema, label: "Staff" },
  { id: "services" as keyof ClinicSetupSchema, label: "Services" },
  { id: "equipment" as keyof ClinicSetupSchema, label: "Equipment" },
  { id: "inventory" as keyof ClinicSetupSchema, label: "Inventory" },
  { id: "packages" as keyof ClinicSetupSchema, label: "Packages & Promotions" },
  { id: "memberships" as keyof ClinicSetupSchema, label: "Memberships" },
  { id: "summary" as keyof ClinicSetupSchema, label: "Summary" }
];

export const MainSetup = () => {
  const { state, dispatch } = useSetup();
  const currentStepIndex = steps.findIndex(step => step.id === state.currentStep);

  const handleStepChange = (stepId: keyof ClinicSetupSchema | 'pre_setup') => {
    dispatch({ type: "SET_CURRENT_STEP", payload: stepId });
  };

  const handleNext = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      dispatch({ type: "SET_CURRENT_STEP", payload: nextStep.id as keyof ClinicSetupSchema });
    }
  };

  // Simple component to display "Coming Soon" for each step
  const ComingSoon = () => (
    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="text-center py-24">
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          {steps[currentStepIndex]?.label || "Step"} Coming Soon
        </h2>
        <p className="text-gray-500 mb-6">This section is under development.</p>
        <div className="flex justify-center space-x-4">
          {currentStepIndex < steps.length - 1 && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNext}
            >
              Skip to Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 h-16">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-2">
            <img 
              src="https://app.dev.arinternal.xyz/images/logo.png?v=123" 
              alt="Logo" 
              className="h-8"
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* Additional header content can go here */}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex w-full pt-16">
        {/* Fixed Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-1/5 bg-white border-r border-gray-200 overflow-y-auto z-30 shadow-sm">
          <Sidebar 
            currentStep={state.currentStep} 
            onStepChange={handleStepChange}
            steps={steps}
            currentStepIndex={currentStepIndex}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pl-52 min-h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto p-8 pb-24 h-[calc(100vh-10rem)]">
            <Toaster position="top-right" />
            <div className="mt-4 mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">{steps[currentStepIndex]?.label}</h1>
              <p className="text-gray-500 mt-1">Complete this step to continue setup</p>
            </div>
            <ComingSoon />
          </div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}; 