'use client';

import { useState } from 'react';
import { Plus, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { MembershipItem } from './MembershipItem';
import { useMembershipsForm } from './useMembershipsForm';
import { useMembershipsExcel } from './useMembershipsExcel';
import { FileUpload, type FileInfo } from '@/components/FileUpload';
import { FullPageLoader } from '@/components/ui/FullPageLoader';
import type { MembershipsProps } from './schema';

export default function Memberships({ initialData, onSubmit, onStepComplete }: MembershipsProps) {
  const [isImporting, setIsImporting] = useState(false);
  
  const {
    form,
    fields,
    remove,
    expandedMemberships,
    toggleMembership,
    handleSubmit,
    addMembership,
    hasMembershipErrors,
    updateMemberships
  } = useMembershipsForm({ 
    initialData, 
    onSubmit,
    onStepComplete
  });
  
  const { 
    processExcel, 
    isProcessing, 
    processingStep
  } = useMembershipsExcel();

  const handleFileUpload = async (files: FileInfo[]) => {
    if (files.length === 0 || isImporting) return;
    
    setIsImporting(true);
    
    try {
      const fileResponse = await fetch(files[0].url);
      const fileBlob = await fileResponse.blob();
      const excelFile = new File([fileBlob], files[0].fileName, { type: files[0].type });
      
      const currentMemberships = form.getValues().memberships;
      const processedMemberships = await processExcel(excelFile, currentMemberships);
      
      updateMemberships(processedMemberships);
      toast.success('Memberships imported successfully');
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
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="mb-6 border-b pb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Import Memberships</h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800 mb-2">
                  We've listed the options for you in the membership uploader so you can create each one by design.
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  Please download, complete, and upload the template using the form below.
                </p>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1OXP17_Pe_bWxmq36oM2XUnfr71Sb0Qnr/edit?gid=2138753605#gid=2138753605"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Download Membership Uploader Template
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <p className="text-xs text-blue-600 mt-2">
                  Note: It is a View Only file, so you will need to create a copy first before working on it.
                </p>
              </div>
              
              <FileUpload
                title="Import Memberships from Excel"
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
                <MembershipItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedMemberships.includes(index)}
                  hasErrors={!!hasMembershipErrors(index)}
                  toggleExpand={() => toggleMembership(index)}
                  removeMembership={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMembership}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Membership
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