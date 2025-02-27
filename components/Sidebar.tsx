'use client';

import React from "react";
import { Building2, Users, Stethoscope, Package, Boxes, CreditCard, Check, FileText, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClinicSetupSchema } from "@/types/schema";

interface Step {
  id: string;
  label: string;
}

interface SidebarProps {
  currentStep: keyof ClinicSetupSchema | 'pre_setup';
  onStepChange: (step: keyof ClinicSetupSchema | 'pre_setup') => void;
  steps: Step[];
  currentStepIndex: number;
}

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case "business_information":
    case "clinic":
      return Building2;
    case "staff":
      return Users;
    case "services":
      return Stethoscope;
    case "equipment":
      return Package;
    case "inventory":
      return Boxes;
    case "packages":
      return Package;
    case "memberships":
      return CreditCard;
    case "summary":
      return FileText;
    default:
      return Building2;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentStep, 
  onStepChange, 
  steps,
  currentStepIndex 
}) => {
  return (
    <div className="py-8 h-full">
      <div className="px-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Setup Steps</h2>
      </div>
      <nav className="space-y-1">
        {steps.map((step, index) => {
          const Icon = getStepIcon(step.id);
          const isActive = currentStep === step.id;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex;
          const isFutureStep = index > currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && !isFutureStep && onStepChange(step.id as keyof ClinicSetupSchema | 'pre_setup')}
              disabled={!isClickable || isFutureStep}
              className={cn(
                "w-full flex items-center justify-between px-8 py-2 border-l-4 transition-all group",
                isActive && "bg-blue-50 text-blue-700 border-l-blue-600 font-semibold",
                isCompleted && "text-green-700 border-l-green-500 hover:bg-green-50",
                !isActive && !isCompleted && isClickable && !isFutureStep && "text-gray-800 hover:bg-gray-50 border-l-transparent hover:border-l-gray-300",
                (isFutureStep || !isClickable) && "text-gray-400 border-l-transparent bg-transparent",
                isClickable && !isFutureStep && "cursor-pointer hover:cursor-pointer"
              )}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8",
                  isActive && "text-blue-600",
                  isCompleted && "text-green-600",
                  !isActive && !isCompleted && !isFutureStep && "text-gray-700",
                  isFutureStep && "text-gray-300"
                )}>
                  {isCompleted ? (
                    <div className="bg-green-100 rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={cn(
                      "rounded-full w-8 h-8 flex items-center justify-center",
                      isActive && "bg-blue-100",
                      !isActive && !isFutureStep && "bg-gray-100 group-hover:bg-gray-200",
                      isFutureStep && "bg-gray-50"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "font-medium text-base",
                  isActive && "text-blue-700",
                  isCompleted && "text-green-700",
                  !isActive && !isCompleted && !isFutureStep && "text-gray-800",
                  isFutureStep && "text-gray-400"
                )}>
                  {step.label}
                </span>
              </div>
              {isActive && (
                <div className="bg-blue-100 rounded-full p-1 flex items-center justify-center">
                  <CircleDot className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}; 