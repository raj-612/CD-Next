'use client';

import { Plus, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useEquipmentForm } from './useEquipmentForm';
import { EquipmentItem } from './EquipmentItem';
import { ResourceItem } from './ResourceItem';
import { FileUpload, type FileInfo } from '@/components/FileUpload';
import { useState } from 'react';
import { toast } from 'sonner';
import { useEquipmentExcel } from './useEquipmentExcel';
import type { EquipmentInformationProps } from './schema';

export function EquipmentInformation({ initialData, onSubmit, onStepComplete }: EquipmentInformationProps) {
  const [isImporting, setIsImporting] = useState(false);
  
  const {
    form,
    equipmentFields,
    resourceFields,
    removeEquipment,
    removeResource,
    expandedItems,
    toggleExpanded,
    handleSubmit,
    addEquipment,
    addResource,
    hasEquipmentErrors,
    hasResourceErrors,
    updateFormData
  } = useEquipmentForm({ initialData, onSubmit, onStepComplete });

  const { processEquipmentExcel, isProcessing } = useEquipmentExcel();

  const handleFileUpload = async (files: FileInfo[]) => {
    if (files.length === 0 || isImporting) return;
    
    setIsImporting(true);
    
    try {
      const fileResponse = await fetch(files[0].url);
      const fileBlob = await fileResponse.blob();
      const excelFile = new File([fileBlob], files[0].fileName, { type: files[0].type });
      
      const currentData = {
        equipment: form.getValues().equipment,
        resources: form.getValues().resources,
      };
      const newData = await processEquipmentExcel(excelFile, currentData);
      updateFormData(newData);
      
      toast.success('Equipment and resources imported successfully');
    } catch (error: any) {
      toast.error(`Import failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Import Equipment & Resources</h3>
            </div>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800 mb-2">
                We&apos;ve provided an Equipment & Resources template to add your information.
              </p>
              <p className="text-sm text-blue-800 mb-3">
                Please download, complete, and upload the template using the form below.
              </p>
              <a 
                href="https://docs.google.com/spreadsheets/d/1DYbvB0LElOZZ3DQ-GegLS8KoacjQnZlg/edit?gid=1319672317#gid=1319672317"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Download Equipment & Resources Template
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
              <p className="text-xs text-blue-600 mt-2">
                Note: It is a View Only file, so you will need to create a copy first before working on it.
              </p>
            </div>
            
            <FileUpload
              title="Import Equipment & Resources"
              helperText="Drag and drop an Excel file, or click to select"
              accept=".xlsx,.xls"
              maxSize={5}
              multiple={false}
              onUploadComplete={handleFileUpload}
              disabled={isImporting || isProcessing}
            />
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Equipment Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Equipment</h2>
                {equipmentFields.map((field, index) => (
                  <EquipmentItem
                    key={field.id}
                    index={index}
                    control={form.control}
                    isExpanded={expandedItems.equipment.includes(index)}
                    hasErrors={!!hasEquipmentErrors(index)}
                    toggleExpand={() => toggleExpanded('equipment', index)}
                    removeEquipment={() => removeEquipment(index)}
                    showRemoveButton={equipmentFields.length > 1}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addEquipment}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
              
              {/* Resources Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Resources</h2>
                {resourceFields.map((field, index) => (
                  <ResourceItem
                    key={field.id}
                    index={index}
                    control={form.control}
                    isExpanded={expandedItems.resources.includes(index)}
                    hasErrors={!!hasResourceErrors(index)}
                    toggleExpand={() => toggleExpanded('resources', index)}
                    removeResource={() => removeResource(index)}
                    showRemoveButton={resourceFields.length > 1}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addResource}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Save &amp; Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}