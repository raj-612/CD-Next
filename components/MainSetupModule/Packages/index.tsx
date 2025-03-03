'use client';

import { Plus, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { PackageItem } from './PackageItem';
import { usePackagesForm } from './usePackagesForm';
import { usePackagesExcel } from './usePackagesExcel';
import type { Package } from '@/types/schema';
import { useSetup } from '@/context/SetupContext';
import { FileUpload, type FileInfo } from '@/components/FileUpload';
import { useState } from 'react';
import { toast } from 'sonner';
import { FullPageLoader } from '@/components/ui/FullPageLoader';

interface PackagesProps {
  initialData?: Package[];
  onStepComplete?: () => Promise<void>;
}

export default function Packages({ initialData, onStepComplete }: PackagesProps) {
  const { state } = useSetup();
  const [isImporting, setIsImporting] = useState(false);
  
  const {
    processExcel,
    isProcessing,
    processingStep
  } = usePackagesExcel();
  
  // Extract clinics, providers, and products from the context
  const clinics = state.jsonSchema.clinic?.locations
    ? state.jsonSchema.clinic.locations.map(location => ({
        id: location.name,
        name: location.name,
      }))
    : [];

  const providers = state.jsonSchema.staff?.members
    ? state.jsonSchema.staff.members
        .filter(member => member.is_provider || member.role === 'provider')
        .map(member => ({
          id: `${member.first_name} ${member.last_name}`.trim(),
          name: `${member.first_name} ${member.last_name}`.trim(),
        }))
    : [];

  const products = state.jsonSchema.inventory
    ? state.jsonSchema.inventory.map(item => ({
        id: item.product_name,
        name: item.product_name,
      }))
    : [];

  const {
    form,
    fields,
    remove,
    expandedPackages,
    togglePackage,
    handleSubmit,
    addPackage,
    hasPackageErrors,
    updatePackages
  } = usePackagesForm({ 
    initialData, 
    onSubmit: () => {
      if (onStepComplete) {
        onStepComplete().catch(error => {
          console.error("Error completing step:", error);
        });
      }
    }
  });
  
  const handleFileUpload = async (files: FileInfo[]) => {
    if (files.length === 0 || isImporting) return;
    
    setIsImporting(true);
    
    try {
      const fileResponse = await fetch(files[0].url);
      const fileBlob = await fileResponse.blob();
      const excelFile = new File([fileBlob], files[0].fileName, { type: files[0].type });
      
      const currentPackages = form.getValues().packages;
      const newPackages = await processExcel(excelFile, currentPackages);
      updatePackages(newPackages);
      
      toast.success('Packages imported successfully');
    } catch (error: any) {
      toast.error(`Import failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isProcessing && <FullPageLoader step={processingStep} />}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Packages & Promotions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage packages, promotions, and discounts
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="mb-6 border-b pb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Import Packages</h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800 mb-2">
                  We've included a Packages & Promotions Uploader for adding your packages.
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  Please download, complete, and upload the template using the form below.
                </p>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1Ad0UFJR_d_SXxJaWHby7_IQtUTm8VcnY/edit?gid=1872554289#gid=1872554289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Download Packages & Promotions Uploader Template
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <p className="text-xs text-blue-600 mt-2">
                  Note: It is a View Only file, so you will need to create a copy first before working on it.
                </p>
              </div>
              
              <FileUpload
                title="Import Packages from Excel"
                helperText="Drag and drop an Excel file, or click to select"
                accept=".xlsx,.xls"
                maxSize={5}
                multiple={false}
                onUploadComplete={handleFileUpload}
                disabled={isImporting || isProcessing}
              />
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <PackageItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedPackages.includes(index)}
                  hasErrors={hasPackageErrors(index) ? true : false}
                  toggleExpand={() => togglePackage(index)}
                  removePackage={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                  clinics={clinics}
                  providers={providers}
                  products={products}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addPackage}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                disabled={isImporting || isProcessing}
              >
                Save &amp; Continue
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}