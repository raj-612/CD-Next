'use client';

import { useState } from "react";
import { mockClinicData } from "./mockClinicData";
import type { ClinicSetupSchema } from "@/types/schema";
import type { FileInfo } from "@/components/FileUpload";

interface SetupError {
  message: string;
  sections?: Record<string, string>;
}

interface PreSetupResult {
  url: string;
  setUrl: (url: string) => void;
  fileInfos: FileInfo[];
  setFileInfos: (files: FileInfo[]) => void;
  isLoading: boolean;
  error: SetupError | null;
  currentStep: string;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  emailValue: string;
  setEmailValue: (email: string) => void;
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (isOpen: boolean) => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
}

export const usePreSetupData = (onComplete: (result: ClinicSetupSchema) => void): PreSetupResult => {
  // Form state
  const [url, setUrl] = useState("");
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  
  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SetupError | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("");
  
  // Email retrieval flow
  const [emailValue, setEmailValue] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Reset error state
    setError(null);
    setIsLoading(true);

    try {
      // Simulate document processing
      if (fileInfos.length > 0) {
        console.log('Processing files:', fileInfos.map(f => f.displayName));
        setCurrentStep("Processing documents");
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate website scraping if URL is provided
      if (url) {
        console.log('Analyzing website:', url);
        setCurrentStep("Analyzing website");
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Final processing step
      setCurrentStep("Generating clinic setup");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random errors occasionally (1 in 10 chance)
      if (Math.random() < 0.1) {
        throw new Error("Could not process clinic data completely");
      }

      console.log('Using mock clinic data');
      
      // Store URL in localStorage if provided
      if (url) {
        localStorage.setItem('clinic_website_url', url);
      }
      
      // Use our mock data
      onComplete(mockClinicData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error('Setup process failed:', errorMessage);
      setError({ 
        message: errorMessage,
        // Sometimes add section-specific errors for demonstration
        ...(Math.random() < 0.5 ? {
          sections: {
            services: "Could not extract service pricing information",
            staff: "Staff information incomplete"
          }
        } : {})
      });
    } finally {
      setIsLoading(false);
      setCurrentStep("");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentStep("Retrieving previous setup");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate email format
      if (!emailValue.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      // Simulate a successful retrieval
      console.log('Retrieved setup data for email:', emailValue);
      onComplete(mockClinicData);
      setIsEmailModalOpen(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
      setCurrentStep("");
    }
  };

  return {
    url,
    setUrl,
    fileInfos,
    setFileInfos,
    isLoading,
    error,
    currentStep,
    handleSubmit,
    emailValue,
    setEmailValue,
    isEmailModalOpen,
    setIsEmailModalOpen,
    handleEmailSubmit
  };
}; 