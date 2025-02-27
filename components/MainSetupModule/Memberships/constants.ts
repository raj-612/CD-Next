import type { Membership } from '@/types/schema';

// Default value for new membership
export const DEFAULT_MEMBERSHIP: Membership = {
  membership_name: "",
  discount_percentage: 0,
  payment_frequency: "monthly",
  setup_fee: 0,
  monthly_fee: 0,
  yearly_fee: 0,
  membership_agreement: "",
  add_to_wallet: false,
  show_on_portal: false,
  discounts_or_free_items: false,
  membership_description: "",
  free_monthly_products: ""
};

// Initial values for the form
export const INITIAL_VALUES = {
  memberships: [DEFAULT_MEMBERSHIP]
};

// Input styles for consistency
export const inputStyles = {
  base: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400",
  focus: "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  error: "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
};