import { z } from 'zod';
import type { InventoryItem } from '@/types/schema';

export const inventoryItemSchema = z.object({
  category: z.string().min(1, 'Product category is required'),
  product_name: z.string().min(1, 'Product name is required'),
  cost_to_company: z.number().min(0, 'Cost must be 0 or greater'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  member_price: z.number().min(0, 'Member price must be 0 or greater'),
  tax: z.number().min(0, 'Tax must be 0 or greater'),
  units: z.number().int().min(0, 'Units must be 0 or greater'),
  description: z.string().optional().default(''),
});

export const inventoryFormSchema = z.object({
  inventory: z.array(inventoryItemSchema).min(1, 'At least one inventory item is required'),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;
export type InventoryItemValues = z.infer<typeof inventoryItemSchema>;

export type { InventoryItem };