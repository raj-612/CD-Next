'use client';

import { Plus, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { ServiceItem } from './ServiceItem';
import { useServicesForm } from './useServicesForm';
import { useServicesExcel } from './useServicesExcel';
import type { ServiceItemValues } from './schema';
import { useSetup } from '@/context/SetupContext';
import { FileUpload, type FileInfo } from '@/components/FileUpload';
import { useState } from 'react';
import { toast } from 'sonner';
import { FullPageLoader } from '@/components/ui/FullPageLoader';

interface ServicesProps {
  initialData?: ServiceItemValues[];
  onStepComplete?: () => Promise<void>;
}

export default function Services({ initialData, onStepComplete }: ServicesProps) {
  const { state } = useSetup();
  const [isImporting, setIsImporting] = useState(false);
  
  const {
    processExcel,
    isProcessing,
    processingStep
  } = useServicesExcel();
  
  // Extract staff and clinics from the context
  const providers = state.jsonSchema.staff?.members
    ? state.jsonSchema.staff.members
        .filter(member => member.is_provider || member.role === 'provider')
        .map(member => ({
          id: `${member.first_name} ${member.last_name}`.trim(),
          name: `${member.first_name} ${member.last_name}`.trim(),
        }))
    : [];

  const clinics = state.jsonSchema.clinic?.locations
    ? state.jsonSchema.clinic.locations.map(location => ({
        id: location.name,
        name: location.name,
      }))
    : [];

  const {
    form,
    fields,
    remove,
    expandedServices,
    toggleService,
    handleSubmit,
    addService,
    hasServiceErrors,
    updateServices
  } = useServicesForm({ 
    initialData, 
    onSubmit: () => {
      if (onStepComplete) {
        onStepComplete().catch(() => {});
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
      
      const currentServices = form.getValues().services;
      const newServices = await processExcel(excelFile, currentServices);
      updateServices(newServices);
      
      toast.success('Services imported successfully');
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
                <h3 className="text-lg font-medium">Import Services</h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800 mb-2">
                  We've included a Service Uploader for adding your services.
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  Please download, complete, and upload the template using the form below.
                </p>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1D_peHrhbmpDmo7Flew08tmi_ksQehG3kkgiFttpZsrU/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Download Service Uploader Template
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <p className="text-xs text-blue-600 mt-2">
                  Note: It is a View Only file, so you will need to create a copy first before working on it.
                </p>
              </div>
              
              <FileUpload
                title="Import Services from Excel"
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
                <ServiceItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedServices.includes(index)}
                  hasErrors={hasServiceErrors(index) ? true : false}
                  toggleExpand={() => toggleService(index)}
                  removeService={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                  providers={providers}
                  clinics={clinics}
                  services={form.getValues().services.map(s => s.service_name)}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addService}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
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