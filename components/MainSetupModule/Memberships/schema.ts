import { z } from 'zod';
import type { Membership } from '@/types/schema';

// Define schema for Membership
export const membershipSchema = z.object({
  membership_name: z.string().min(1, { message: "Membership name is required" }),
  discount_percentage: z.number().min(0).max(100, { message: "Discount percentage must be between 0 and 100" }),
  payment_frequency: z.enum(['monthly', 'yearly', 'both'], {
    required_error: "Payment frequency is required",
    invalid_type_error: "Payment frequency must be monthly, yearly, or both",
  }),
  setup_fee: z.number().min(0, { message: "Setup fee must be a positive number" }),
  monthly_fee: z.number(),
  yearly_fee: z.number(),
  membership_agreement: z.string().optional(),
  add_to_wallet: z.boolean().default(false),
  show_on_portal: z.boolean().default(false),
  discounts_or_free_items: z.boolean().default(false),
  membership_description: z.string().optional(),
  free_monthly_products: z.string().optional()
}).refine(
  (data) => {
    if (data.payment_frequency === 'monthly' || data.payment_frequency === 'both') {
      return data.monthly_fee >= 0;
    }
    return true;
  },
  {
    message: "Monthly fee must be a positive number",
    path: ["monthly_fee"],
  }
).refine(
  (data) => {
    if (data.payment_frequency === 'yearly' || data.payment_frequency === 'both') {
      return data.yearly_fee >= 0;
    }
    return true;
  },
  {
    message: "Yearly fee must be a positive number",
    path: ["yearly_fee"],
  }
);

// Define the form schema
export const membershipFormSchema = z.object({
  memberships: z.array(membershipSchema)
});

// Infer TypeScript types from the schema
export type MembershipFormValues = {
  memberships: Membership[];
};

// Define props interface for the component
export interface MembershipsProps {
  initialData?: Membership[];
  onSubmit?: () => void;
  onStepComplete?: () => Promise<void>;
}