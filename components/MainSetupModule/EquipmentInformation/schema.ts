import { z } from 'zod';
import type { Equipment as BaseEquipmentType, Resource as BaseResourceType } from '@/types/schema';

// Define the day schedule schema
const dayScheduleSchema = z.object({
  available: z.boolean().default(false),
  shifts: z.array(
    z.object({
      start: z.string(),
      end: z.string()
    })
  ).default([])
});

// Define schema for Equipment
export const equipmentSchema = z.object({
  name: z.string().min(1, { message: "Device name is required" }),
  clinic: z.string().min(1, { message: "Clinic is required" }),
  schedule: z.object({
    monday: dayScheduleSchema.optional(),
    tuesday: dayScheduleSchema.optional(),
    wednesday: dayScheduleSchema.optional(),
    thursday: dayScheduleSchema.optional(),
    friday: dayScheduleSchema.optional(),
    saturday: dayScheduleSchema.optional(),
    sunday: dayScheduleSchema.optional()
  }),
  required_services: z.array(z.string()).min(1, { message: "At least one service is required" }),
  cleanup_time: z.number().min(0, { message: "Cleanup time must be a positive number" })
});

// Define schema for Resource
export const resourceSchema = z.object({
  name: z.string().min(1, { message: "Resource name is required" }),
  clinic: z.string().min(1, { message: "Clinic is required" }),
  type: z.string().min(1, { message: "Resource type is required" }),
  schedule: z.object({
    monday: dayScheduleSchema.optional(),
    tuesday: dayScheduleSchema.optional(),
    wednesday: dayScheduleSchema.optional(),
    thursday: dayScheduleSchema.optional(),
    friday: dayScheduleSchema.optional(),
    saturday: dayScheduleSchema.optional(),
    sunday: dayScheduleSchema.optional()
  }),
  required_services: z.array(z.string()).min(1, { message: "At least one service is required" })
});

// Define the form schema
export const equipmentFormSchema = z.object({
  equipment: z.array(equipmentSchema),
  resources: z.array(resourceSchema)
});

// Define our extended types with proper schedule object
export interface Equipment extends Omit<BaseEquipmentType, 'schedule'> {
  schedule: {
    monday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    tuesday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    wednesday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    thursday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    friday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    saturday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    sunday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
  };
}

export interface Resource extends Omit<BaseResourceType, 'schedule'> {
  schedule: {
    monday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    tuesday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    wednesday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    thursday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    friday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    saturday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
    sunday?: { available: boolean; shifts: Array<{ start: string; end: string }> };
  };
}

export type EquipmentFormValues = {
  equipment: Equipment[];
  resources: Resource[];
};

// Define props interface for the component
export interface EquipmentInformationProps {
  initialData?: {
    equipment?: Equipment[];
    resources?: Resource[];
  };
  onSubmit?: (data: EquipmentFormValues) => void;
  onStepComplete?: () => Promise<void>;
}