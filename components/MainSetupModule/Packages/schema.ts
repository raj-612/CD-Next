import { z } from 'zod';
import type { Package } from '@/types/schema';

export const packageSchema = z.object({
  discount_name: z.string().min(1, 'Package name is required'),
  discount_type: z.enum(['percentage', 'fixed', 'package']),
  discount_percentage: z.number().min(0).max(100).optional(),
  discount_amount: z.number().min(0).optional(),
  package_price: z.number().min(0).optional(),
  member_price: z.number().min(0).optional(),
  apply_to: z.enum(['all_products', 'selected_products']),
  included_products: z.array(z.string()),
  customer_availability: z.enum(['all', 'members_only']),
  online_portal_available: z.boolean().default(false),
  package_description: z.string().optional(),
  locations: z.array(z.string()),
  providers: z.array(z.string()),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
}).refine((data) => {
  // If discount type is percentage, require discount_percentage
  if (data.discount_type === 'percentage') {
    return data.discount_percentage !== undefined;
  }
  // If discount type is fixed, require discount_amount
  if (data.discount_type === 'fixed') {
    return data.discount_amount !== undefined;
  }
  // If discount type is package, require package_price
  if (data.discount_type === 'package') {
    return data.package_price !== undefined;
  }
  return true;
}, {
  message: "Required price/discount fields based on discount type",
  path: ["discount_type"],
}).refine((data) => {
  // If apply_to is selected_products, require included_products
  if (data.apply_to === 'selected_products') {
    return data.included_products.length > 0;
  }
  return true;
}, {
  message: "At least one product must be selected",
  path: ["included_products"],
});

export const packagesFormSchema = z.object({
  packages: z.array(packageSchema).min(1, 'At least one package is required'),
});

export type PackagesFormValues = z.infer<typeof packagesFormSchema>;
export type PackageItemValues = z.infer<typeof packageSchema>;

export type { Package };