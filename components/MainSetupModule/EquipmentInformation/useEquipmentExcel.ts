import { useState } from 'react';
import { utils, read } from 'xlsx';
import type { EquipmentFormValues } from './schema';

interface UseEquipmentExcelReturn {
  processEquipmentExcel: (file: File, currentData?: EquipmentFormValues) => Promise<EquipmentFormValues>;
  isProcessing: boolean;
  processingStep: string;
  error: string | null;
}

// Minimal set of headers to identify the header rows
const EQUIPMENT_HEADERS = [
  "Name of Device",
  "Which Clinic houses this device?",
  "What is the schedule for this device?"
];

const RESOURCES_HEADERS = [
  "Name of Resource",
  "Which Clinic houses this resource?",
  "What type of resource is this?"
];

export const useEquipmentExcel = (): UseEquipmentExcelReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const findHeaderRow = (rows: any[][], headers: string[]): number => {
    return rows.findIndex(row => 
      headers.every(header => 
        row.some(cell => {
          const cellStr = cell?.toString().trim().replace(/\s+/g, ' ');
          return cellStr === header;
        })
      )
    );
  };


  const fileToBuffer = async (file: File): Promise<ArrayBuffer> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processEquipmentExcel = async (file: File, currentData?: EquipmentFormValues): Promise<EquipmentFormValues> => {
    setIsProcessing(true);
    setProcessingStep('Validating file...');
    setError(null);

    try {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Invalid file type. Please provide an Excel file (.xlsx or .xls)');
      }

      setProcessingStep('Reading Excel sheets...');
      const buffer = await fileToBuffer(file);
      const workbook = read(new Uint8Array(buffer), { type: 'array' });

      // Process Equipment sheet
      const equipmentSheet = workbook.Sheets['Equipment'];
      if (!equipmentSheet) {
        throw new Error("Equipment sheet not found in the Excel file");
      }

      const equipmentRows = utils.sheet_to_json(equipmentSheet, { 
        header: 1,
        raw: true,
        defval: null
      }) as any[][];

      const equipmentHeaderRow = findHeaderRow(equipmentRows, EQUIPMENT_HEADERS);
      if (equipmentHeaderRow === -1) {
        throw new Error("Could not find required headers in the Equipment sheet");
      }

      // Process Resources sheet
      const resourcesSheet = workbook.Sheets['Resources'];
      if (!resourcesSheet) {
        throw new Error("Resources sheet not found in the Excel file");
      }

      const resourcesRows = utils.sheet_to_json(resourcesSheet, { 
        header: 1,
        raw: true,
        defval: null
      }) as any[][];

      const resourcesHeaderRow = findHeaderRow(resourcesRows, RESOURCES_HEADERS);
      if (resourcesHeaderRow === -1) {
        throw new Error("Could not find required headers in the Resources sheet");
      }

      setProcessingStep('Processing with AI...');

      // Filter out empty rows
      const filteredEquipmentRows = equipmentRows.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );
      const filteredResourceRows = resourcesRows.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      // Call the API with the filtered data
      const response = await fetch('/api/process-equipment-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          excelData: {
            equipmentSheet: filteredEquipmentRows,
            resourcesSheet: filteredResourceRows
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process Excel data');
      }

      const result = await response.json();
      const newData = result.data;
      
      // If we have current data, merge it with new data
      if (currentData) {
        return {
          equipment: [...currentData.equipment, ...newData.equipment],
          resources: [...currentData.resources, ...newData.resources]
        };
      }
      
      return newData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process Excel file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return {
    processEquipmentExcel,
    isProcessing,
    processingStep,
    error
  };
}; 