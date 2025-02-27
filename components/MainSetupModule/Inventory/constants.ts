import type { InventoryFormValues } from './schema';

export const DEFAULT_INVENTORY_ITEM = {
  category: '',
  product_name: '',
  cost_to_company: 0,
  price: 0,
  member_price: 0,
  tax: 0,
  units: 0,
  description: '',
};

export const INITIAL_VALUES: InventoryFormValues = {
  inventory: [{ ...DEFAULT_INVENTORY_ITEM }],
};