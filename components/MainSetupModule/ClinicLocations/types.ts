import { z } from "zod";
import { locationSchema, clinicFormSchema } from "./schema";

export type OnlineBookingType = 'both' | 'booking_only' | 'ecommerce_only' | 'none';

// Inferred types from Zod schema
export type Location = z.infer<typeof locationSchema>;
export type ClinicFormValues = z.infer<typeof clinicFormSchema>;

export interface ClinicLocationsProps {
  initialData?: any[]; // We'll replace this with proper type when used
  onSubmit?: (data: any) => void; // We'll replace this with proper type when used
} 