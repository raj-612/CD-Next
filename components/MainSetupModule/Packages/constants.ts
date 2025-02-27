import type { PackagesFormValues } from './schema';
import type { DiscountType, ApplyTo, CustomerAvailability } from './types';

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// Get date 1 year from now
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
const futureDate = oneYearFromNow.toISOString().split('T')[0];

export const DEFAULT_PACKAGE = {
  discount_name: '',
  discount_type: 'percentage' as DiscountType,
  discount_percentage: 10,
  discount_amount: null,
  package_price: null,
  member_price: null,
  apply_to: 'all_products' as ApplyTo,
  included_products: [],
  customer_availability: 'all' as CustomerAvailability,
  online_portal_available: true,
  package_description: '',
  locations: [],
  providers: [],
  start_date: today,
  end_date: futureDate,
};

export const INITIAL_VALUES: PackagesFormValues = {
  packages: [{ ...DEFAULT_PACKAGE }],
};