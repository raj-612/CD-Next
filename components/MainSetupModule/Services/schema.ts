import { z } from 'zod';
import type { Service } from '@/types/schema';

export const serviceSchema = z.object({
  service_category: z.string().min(1, 'Service category is required'),
  service_name: z.string().min(1, 'Service name is required'),
  service_type: z.enum(['virtual', 'inperson']),
  service_duration: z.number().min(1, 'Service duration is required'),
  providers: z.array(z.string()),
  available_clinics: z.array(z.string()),
  online_booking_enabled: z.boolean().default(true),
  description: z.string().optional().default(''),
  capture_card: z.boolean().default(false),
  deposit_amount: z.number().min(0).default(0),
  incompatible_services: z.array(z.string()).default([]),
});

export const servicesFormSchema = z.object({
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

export type ServiceFormValues = z.infer<typeof servicesFormSchema>;
export type ServiceItemValues = z.infer<typeof serviceSchema>;

export type { Service };