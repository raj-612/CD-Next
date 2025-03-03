import { z } from "zod";
import type { OnlineBookingType } from "./types";

export const locationSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  street_address: z.string().min(1, "Street address is required"),
  street_address_line_2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required").default("United States"),
  phone: z.string().min(1, "Phone number is required"),
  notification_sms: z.string().optional().default(""),
  notification_emails: z.string().optional().default(""),
  online_booking_type: z.enum(['both', 'booking_only', 'ecommerce_only', 'none']) as z.ZodType<OnlineBookingType>,
  accepts_tips: z.boolean().default(false)
});

export const clinicFormSchema = z.object({
  locations: z.array(locationSchema).min(1, "At least one location is required")
});

export type Location = z.infer<typeof locationSchema>;
export type ClinicFormValues = z.infer<typeof clinicFormSchema>; 