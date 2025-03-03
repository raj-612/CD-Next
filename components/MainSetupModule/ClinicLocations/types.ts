import { z } from "zod";
import { locationSchema, clinicFormSchema } from "./schema";

export type OnlineBookingType = 'both' | 'booking_only' | 'ecommerce_only' | 'none';

export type Location = z.infer<typeof locationSchema>;
export type ClinicFormValues = z.infer<typeof clinicFormSchema>;

export interface ClinicLocationsProps {
  initialData?: any[];
  onSubmit?: (data: any) => void;
} 