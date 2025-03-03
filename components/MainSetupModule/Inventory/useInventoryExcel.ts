import { utils, read } from 'xlsx';
import type { InventoryItem } from "@/types/schema";
import { toast } from 'sonner';
import { useState } from 'react';

export interface UseInventoryExcelReturn {
  processInventoryExcel: (file: File, currentItems?: InventoryItem[]) => Promise<InventoryItem[]>;
  isProcessing: boolean;
  error: string | null;
}

const INVENTORY_HEADERS = [
  "Category",
  "Product Name",
  "Cost to company",
  "Price",
  "Member Price",
  "Tax"
];

const findHeaderRow = (rows: any[][]): number => {
  const firstRow = rows[0];
  if (!firstRow) return -1;

  const hasAllHeaders = INVENTORY_HEADERS.every(header => 
    firstRow.some(cell => {
      const cellStr = cell?.toString().trim();
      return cellStr === header;
    })
  );

  return hasAllHeaders ? 0 : -1;
};

const createHeaderMap = (headerRow: any[]): Map<string, number> => {
  const map = new Map<string, number>();
  headerRow.forEach((header, index) => {
    if (header) {
      const headerStr = header.toString().trim();
      if (INVENTORY_HEADERS.includes(headerStr)) {
        map.set(headerStr, index);
      }
    }
  });
  return map;
};

const isEmptyRow = (row: any[]): boolean => {
  if (!row || !Array.isArray(row)) return true;
  return !row.some(cell => cell !== null && cell !== undefined && cell !== '');
};

export const useInventoryExcel = (): UseInventoryExcelReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processInventoryExcel = async (file: File, currentItems: InventoryItem[] = []): Promise<InventoryItem[]> => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Invalid file type. Please provide an Excel file (.xlsx or .xls)');
      }

      const data = await file.arrayBuffer();
      const workbook = read(new Uint8Array(data), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      const rows = utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: true,
        defval: null
      }) as any[][];

      const headerRow = findHeaderRow(rows);
      if (headerRow === -1) {
        throw new Error("Could not find required headers in the first row");
      }

      const headerMap = createHeaderMap(rows[headerRow]);
      const inventory: InventoryItem[] = [];

      for (let i = headerRow + 1; i < rows.length; i++) {
        const row = rows[i];
        
        if (isEmptyRow(row)) continue;

        const getValue = (header: string): any => {
          const index = headerMap.get(header);
          if (index === undefined) return null;
          return row[index];
        };

        if (!getValue("Product Name") || !getValue("Category")) continue;

        const item: InventoryItem = {
          category: getValue("Category")?.toString() || "",
          product_name: getValue("Product Name")?.toString() || "",
          cost_to_company: parseFloat(getValue("Cost to company")) || 0,
          price: parseFloat(getValue("Price")) || 0,
          member_price: parseFloat(getValue("Member Price")) || 0,
          tax: parseFloat(getValue("Tax")) || 0,
          units: 0,
          description: ""
        };

        inventory.push(item);
      }

      const response = await fetch('/api/process-inventory-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excelData: inventory }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process inventory data');
      }

      const result = await response.json();
      const newInventoryItems = result.data.inventory || [];
      
      // Merge with existing items
      const mergedItems = [...currentItems, ...newInventoryItems];
      toast.success('Inventory data processed successfully');
      
      return mergedItems;

    } catch (err: any) {
      setError(err.message || 'Failed to process inventory data');
      toast.error(err.message || 'Failed to process inventory data');
      throw err;
    } finally {
      setIsProcessing(false);
    }
    return [];
  };

  return {
    processInventoryExcel,
    isProcessing,
    error
  };
}; 