import { z } from 'zod';
import { Equipment as EquipmentType, Resource as ResourceType } from '@/types/schema';

// Define schema for Equipment
export const equipmentSchema = z.object({
  name: z.string().min(1, { message: "Device name is required" }),
  clinic: z.string().min(1, { message: "Clinic is required" }),
  schedule: z.string().min(1, { message: "Schedule is required" }),
  required_services: z.array(z.string()).min(1, { message: "At least one service is required" }),
  cleanup_time: z.number().min(0, { message: "Cleanup time must be a positive number" })
});

// Define schema for Resource
export const resourceSchema = z.object({
  name: z.string().min(1, { message: "Resource name is required" }),
  clinic: z.string().min(1, { message: "Clinic is required" }),
  type: z.string().min(1, { message: "Resource type is required" }),
  schedule: z.string().min(1, { message: "Schedule is required" }),
  required_services: z.array(z.string()).min(1, { message: "At least one service is required" })
});

// Define the form schema
export const equipmentFormSchema = z.object({
  equipment: z.array(equipmentSchema),
  resources: z.array(resourceSchema)
});

// Infer TypeScript types from the schema
export type Equipment = EquipmentType;
export type Resource = ResourceType;
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