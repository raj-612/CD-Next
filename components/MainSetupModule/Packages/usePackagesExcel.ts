import { useState } from 'react';
import { read, utils } from 'xlsx';
import type { Package } from '@/types/schema';

interface UsePackagesExcelReturn {
  processExcel: (file: File, currentPackages: Package[]) => Promise<Package[]>;
  isProcessing: boolean;
  processingStep: string;
  error: string | null;
}

export const usePackagesExcel = (): UsePackagesExcelReturn => {
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

  

  const extractExcelData = async (file: File): Promise<{discountSheet: any[][], packageSheet: any[][]}> => {
    setProcessingStep('Reading Excel file...');
    
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error('Invalid file type. Please provide an Excel file (.xlsx or .xls)');
    }

    const buffer = await fileToBuffer(file);
    const workbook = read(new Uint8Array(buffer), { type: 'array' });
    
    if (workbook.SheetNames.length < 1) {
      throw new Error('Excel file must have at least one sheet');
    }
    
    
    const discountSheetName = workbook.SheetNames[0];
    const discountSheet = workbook.Sheets[discountSheetName];
    const discountData = utils.sheet_to_json(discountSheet, { header: 1 }) as any[][];
    
    let packageData: any[][] = [];
    if (workbook.SheetNames.length > 1) {
      const packageSheetName = workbook.SheetNames[1];
      const packageSheet = workbook.Sheets[packageSheetName];
      packageData = utils.sheet_to_json(packageSheet, { header: 1 }) as any[][];
    }
    
    
    const filteredDiscountData = discountData.filter(row => 
      row && row.some(cell => cell !== null && cell !== '')
    );
    
    const filteredPackageData = packageData.filter(row => 
      row && row.some(cell => cell !== null && cell !== '')
    );
    
    return {
      discountSheet: filteredDiscountData,
      packageSheet: filteredPackageData
    };
  };

  const callProcessingApi = async (discountData: any[][], packageData: any[][]): Promise<Package[]> => {
    setProcessingStep('Processing discount and package data...');
    
    try {
      const response = await fetch('/api/process-packages-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          discountData,
          packageData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process Excel data');
      }
      
      const result = await response.json();
      
      if (!result.data || !result.data.packages) {
        throw new Error('Invalid response format from server');
      }
      
      // Process each package to ensure the type matching is correct
      // Convert all null values to undefined to match the Package type
      const processedPackages = result.data.packages.map((pkg: any): Package => {
        // First, create a new object with all fields
        const processedPkg: Record<string, any> = { ...pkg };
        
        // For any fields that can be null but the type doesn't allow it,
        // convert null values to undefined
        const fieldsToCheck = [
          'discount_percentage', 
          'discount_amount', 
          'package_price', 
          'member_price', 
          'package_description'
        ];
        
        for (const field of fieldsToCheck) {
          if (processedPkg[field] === null) {
            processedPkg[field] = undefined;
          }
        }
        
        // Ensure included_products is an array
        if (!Array.isArray(processedPkg.included_products)) {
          processedPkg.included_products = [];
        }
        
        // Ensure locations is an array
        if (!Array.isArray(processedPkg.locations)) {
          processedPkg.locations = [];
        }
        
        // Ensure providers is an array
        if (!Array.isArray(processedPkg.providers)) {
          processedPkg.providers = [];
        }
        
        return processedPkg as Package;
      });
      
      return processedPackages;
    } catch (err) {
      console.error('API processing error:', err);
      throw err;
    }
  };

  const mergeWithExistingPackages = (newPackages: Package[], currentPackages: Package[]): Package[] => {
    setProcessingStep('Merging with existing package data...');
    
    const packagesMap = new Map<string, Package>();
    
    // First add all current packages to the map
    currentPackages.forEach(pkg => {
      if (pkg.discount_name) {
        packagesMap.set(pkg.discount_name.toLowerCase(), pkg);
      }
    });
    
    // Process and merge new packages
    newPackages.forEach(pkg => {
      if (pkg.discount_name) {
        const name = pkg.discount_name.toLowerCase();
        
        if (packagesMap.has(name)) {
          // Merge with existing package, but make sure to handle null values
          const existingPkg = packagesMap.get(name)!;
          const mergedPkg: Package = { ...existingPkg };
          
          // For each property in the new package, only overwrite if it has a valid value
          Object.entries(pkg).forEach(([key, value]) => {
            if (value !== null) {
              (mergedPkg as any)[key] = value;
            }
          });
          
          packagesMap.set(name, mergedPkg);
        } else {
          // For new packages, make sure no nulls make it into the map
          const cleanPkg: Record<string, any> = {};
          
          Object.entries(pkg).forEach(([key, value]) => {
            if (value !== null) {
              cleanPkg[key] = value;
            }
          });
          
          packagesMap.set(name, cleanPkg as Package);
        }
      }
    });
    
    return Array.from(packagesMap.values());
  };

  const processExcel = async (file: File, currentPackages: Package[] = []): Promise<Package[]> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      
      const { discountSheet, packageSheet } = await extractExcelData(file);
      
      
      const processedPackages = await callProcessingApi(discountSheet, packageSheet);
      
      
      const mergedPackages = mergeWithExistingPackages(processedPackages, currentPackages);
      
      setProcessingStep('Complete!');
      return mergedPackages;
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