import { useState } from 'react';
import { read, utils } from 'xlsx';
import type { ServiceItemValues } from './schema';

interface UseServicesExcelReturn {
  processExcel: (file: File, currentServices: ServiceItemValues[]) => Promise<ServiceItemValues[]>;
  isProcessing: boolean;
  processingStep: string;
  error: string | null;
}

export const useServicesExcel = (): UseServicesExcelReturn => {
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
    
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    
    const filteredData = data.filter(row => row.some(cell => cell !== null && cell !== ''));
    
    return filteredData;
  };

  const callProcessingApi = async (excelData: any[][]): Promise<ServiceItemValues[]> => {
    setProcessingStep('Processing data with AI...');
    
    try {
      const response = await fetch('/api/process-services-excel', {
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
      return result.data.services;
    } catch (err) {
      throw err;
    }
  };

  const mergeWithExistingServices = (newServices: ServiceItemValues[], currentServices: ServiceItemValues[]): ServiceItemValues[] => {
    setProcessingStep('Merging with existing service data...');
    return [...currentServices, ...newServices];
  };

  const processExcel = async (file: File, currentServices: ServiceItemValues[] = []): Promise<ServiceItemValues[]> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const excelData = await extractExcelData(file);
      const processedServices = await callProcessingApi(excelData);
      const mergedServices = mergeWithExistingServices(processedServices, currentServices);
      
      setProcessingStep('Complete!');
      return mergedServices;
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