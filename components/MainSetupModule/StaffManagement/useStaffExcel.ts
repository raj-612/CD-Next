import { useState } from 'react';
import { read, utils } from 'xlsx';
import type { StaffMemberFormValues } from './schema';

interface UseStaffExcelReturn {
  processExcel: (file: File, currentStaff: StaffMemberFormValues[]) => Promise<StaffMemberFormValues[]>;
  isProcessing: boolean;
  processingStep: string;
}

export const useStaffExcel = (): UseStaffExcelReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const processExcel = async (file: File, currentStaff: StaffMemberFormValues[] = []): Promise<StaffMemberFormValues[]> => {
    setIsProcessing(true);
    setProcessingStep('Reading Excel file...');

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      
      const staffSheet = workbook.Sheets[workbook.SheetNames[0]];
      const hoursSheet = workbook.Sheets[workbook.SheetNames[1]];
      
      const staffRows = utils.sheet_to_json(staffSheet, { header: 1 }) as any[][];
      const hoursRows = utils.sheet_to_json(hoursSheet, { header: 1 }) as any[][];
      
      const filteredStaffRows = staffRows.filter(row => row.some(cell => cell !== null && cell !== ''));
      const filteredHoursRows = hoursRows.filter(row => row.some(cell => cell !== null && cell !== ''));
      
      setProcessingStep('Processing with AI...');
      
      const response = await fetch('/api/process-staff-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          excelData: {
            staffSheet: filteredStaffRows,
            hoursSheet: filteredHoursRows
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process Excel data');
      }
      
      const result = await response.json();
      const newStaffMembers: StaffMemberFormValues[] = result.data.staffMembers;
      
      if (currentStaff && currentStaff.length > 0) {
        const existingMap = new Map(currentStaff.map(staff => {
          const key = `${staff.first_name.toLowerCase()}-${staff.last_name.toLowerCase()}`;
          return [key, staff];
        }));
        
        newStaffMembers.forEach((staff) => {
          const key = `${staff.first_name.toLowerCase()}-${staff.last_name.toLowerCase()}`;
          if (!existingMap.has(key)) {
            existingMap.set(key, staff);
          }
        });
        
        return Array.from(existingMap.values());
      }
      
      return newStaffMembers;
    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return {
    processExcel,
    isProcessing,
    processingStep
  };
}; 