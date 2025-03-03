import { z } from 'zod';
import type { BusinessInformation } from '@/types/schema';

const businessHourSchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
});

export const businessFormSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  street_address: z.string().min(2, 'Street address is required'),
  street_address_line_2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  business_website: z.string().url().optional().or(z.literal('')),
  business_hours: z.object({
    monday: businessHourSchema,
    tuesday: businessHourSchema,
    wednesday: businessHourSchema,
    thursday: businessHourSchema,
    friday: businessHourSchema,
    saturday: businessHourSchema,
    sunday: businessHourSchema,
  }),
  logo_url: z.string().url('Invalid logo URL'),
  owner_first_name: z.string().min(2, 'First name is required'),
  owner_last_name: z.string().min(2, 'Last name is required'),
  email_id: z.string().email('Invalid email address'),
  contact_number_1: z.string().min(10, 'Phone number is required'),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

export type { BusinessInformation }; 