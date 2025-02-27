import type { DayOfWeek } from './types';
import type { StaffFormValues } from './schema';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DEFAULT_SHIFT = {
  start: '09:00',
  end: '17:00',
};

export const DEFAULT_DAY_SCHEDULE = {
  available: false,
  shifts: [],
};

export const DEFAULT_WORKDAY_SCHEDULE = {
  available: true,
  shifts: [{ ...DEFAULT_SHIFT }],
};

export const DEFAULT_WEEKEND_SCHEDULE = {
  available: false,
  shifts: [],
};

export const DEFAULT_STAFF_MEMBER = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: 'provider' as const,
  can_accept_tips: false,
  is_provider: true,
  requires_medical_director: false,
  available_for_booking: true,
  online_booking_enabled: true,
  photo_url: '',
  bio: '',
  schedule: {
    monday: { ...DEFAULT_WORKDAY_SCHEDULE },
    tuesday: { ...DEFAULT_WORKDAY_SCHEDULE },
    wednesday: { ...DEFAULT_WORKDAY_SCHEDULE },
    thursday: { ...DEFAULT_WORKDAY_SCHEDULE },
    friday: { ...DEFAULT_WORKDAY_SCHEDULE },
    saturday: { ...DEFAULT_WEEKEND_SCHEDULE },
    sunday: { ...DEFAULT_WEEKEND_SCHEDULE },
  },
  assigned_locations: [],
};

export const INITIAL_VALUES: StaffFormValues = {
  staff: [{ ...DEFAULT_STAFF_MEMBER }],
};