import { z } from 'zod';
import type { StaffMember } from '@/types/schema';

const shiftSchema = z.object({
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
});

const dayScheduleSchema = z.object({
  available: z.boolean(),
  shifts: z.array(shiftSchema).optional().default([]),
});

const scheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

const staffMemberSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  role: z.enum(['provider', 'admin', 'front_desk', 'medical_director']),
  can_accept_tips: z.boolean(),
  is_provider: z.boolean(),
  requires_medical_director: z.boolean(),
  available_for_booking: z.boolean(),
  online_booking_enabled: z.boolean(),
  photo_url: z.string().optional(),
  bio: z.string().optional(),
  schedule: scheduleSchema.optional(),
  assigned_locations: z.array(z.string()),
});

export const staffFormSchema = z.object({
  staff: z.array(staffMemberSchema).min(1, 'At least one staff member is required'),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
export type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;
export type DayScheduleFormValues = z.infer<typeof dayScheduleSchema>;
export type ShiftFormValues = z.infer<typeof shiftSchema>;

export type { StaffMember };