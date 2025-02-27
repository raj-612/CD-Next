'use client';

import { useSetup } from "@/context/SetupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload";
import type { FileInfo } from "@/components/FileUpload";
import { usePreSetupData } from "./usePreSetupData";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

export function PreSetup() {
  const { completePreSetup } = useSetup();
  
  const {
    url,
    setUrl,
    fileInfos,
    setFileInfos,
    isLoading,
    currentStep,
    handleSubmit,
    isEmailModalOpen,
    setIsEmailModalOpen,
    emailValue,
    setEmailValue,
    handleEmailSubmit
  } = usePreSetupData((result) => {
    completePreSetup(result);
  });

  const handleFileUploadComplete = (files: FileInfo[]) => {
    console.log('Files uploaded to Supabase:', files.map(f => ({
      name: f.displayName,
      url: f.url,
      path: f.fileName
    })));
    setFileInfos(files);
  };

  if (isLoading) {
    return <FullPageLoader step={currentStep} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-16">
          <img src="https://app.dev.arinternal.xyz/images/logo.png?v=123" alt="Logo" className="h-16" />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4 text-gray-800">Clinic Setup</h1>
          <p className="text-gray-500">Enter your clinic website URL or upload documents to get started</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="mb-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">Website URL</label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Documents</label>
            <FileUpload
              title="Upload Clinic Documents"
              helperText="Upload clinic documents, brochures, or price lists"
              accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png"
              maxSize={20}
              maxFiles={5}
              onUploadComplete={handleFileUploadComplete}
              initialFiles={fileInfos}
              className="bg-white"
            />
          </div>

          <div className="mb-8">
            <Button
              className="w-full bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium h-12 text-lg transition-all duration-300"
              onClick={() => setIsEmailModalOpen(true)}
            >
              Did you extract earlier?
            </Button>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-lg transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleSubmit}
          >
            Generate Setup
          </Button>
        </div>
      </div>

      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Retrieve Your Setup</h3>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Retrieve
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 