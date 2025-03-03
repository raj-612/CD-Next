import { useState } from 'react';
import { read, utils } from 'xlsx';
import type { Membership } from "@/types/schema";

interface UseMembershipsExcelReturn {
  processExcel: (file: File, currentMemberships: Membership[]) => Promise<Membership[]>;
  isProcessing: boolean;
  processingStep: string;
  error: string | null;
}

export const useMembershipsExcel = (): UseMembershipsExcelReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileToBuffer = async (file: File): Promise<ArrayBuffer> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const extractExcelData = async (file: File): Promise<any[][]> => {
    setProcessingStep('Reading Excel file...');
    
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error('Invalid file type. Please provide an Excel file (.xlsx or .xls)');
    }

    const buffer = await fileToBuffer(file);
    const workbook = read(new Uint8Array(buffer), { type: 'array' });
    
    if (workbook.SheetNames.length < 1) {
      throw new Error('Excel file must have at least one sheet');
    }
    
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    
    
    const data = utils.sheet_to_json(sheet, { 
      header: 1, 
      defval: null,
      raw: true
    }) as any[][];
    
    
    const filteredData = data.filter(row => row.some(cell => cell !== null && cell !== ''));
    
    
    return filteredData;
  };

  const callProcessingApi = async (excelData: any[][]): Promise<Membership[]> => {
    setProcessingStep('Processing data with AI...');
    
    try {
      const response = await fetch('/api/process-memberships-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excelData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process Excel data');
      }
      
      const result = await response.json();
      return result.data.memberships;
    } catch (err) {
      console.error('API processing error:', err);
      throw err;
    }
  };

  const mergeWithExistingMemberships = (newMemberships: Membership[], currentMemberships: Membership[]): Membership[] => {
    setProcessingStep('Merging with existing membership data...');
    
    const membershipsMap = new Map<string, Membership>();
    
    currentMemberships.forEach(membership => {
      if (membership.membership_name) {
        membershipsMap.set(membership.membership_name.toLowerCase(), membership);
      }
    });
    
    newMemberships.forEach(membership => {
      if (membership.membership_name) {
        const name = membership.membership_name.toLowerCase();
        if (membershipsMap.has(name)) {
          membershipsMap.set(name, { ...membershipsMap.get(name)!, ...membership });
        } else {
          membershipsMap.set(name, {
            ...membership,
            membership_agreement: membership.membership_agreement || '',
            membership_description: membership.membership_description || '',
            free_monthly_products: membership.free_monthly_products || ''
          });
        }
      }
    });
    
    return Array.from(membershipsMap.values());
  };

  const processExcel = async (file: File, currentMemberships: Membership[] = []): Promise<Membership[]> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const excelData = await extractExcelData(file);
      const processedMemberships = await callProcessingApi(excelData);
      const mergedMemberships = mergeWithExistingMemberships(processedMemberships, currentMemberships);
      
      setProcessingStep('Complete!');
      return mergedMemberships;
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
    processExcel,
    isProcessing,
    processingStep,
    error
  };
};