import type { BusinessFormValues } from './schema';

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DEFAULT_BUSINESS_HOURS = {
  open: '09:00',
  close: '17:00',
};

export const WEEKEND_BUSINESS_HOURS = {
  open: '10:00',
  close: '15:00',
};

export const INITIAL_VALUES: BusinessFormValues = {
  business_name: '',
  street_address: '',
  street_address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'United States',
  business_website: '',
  logo_url: '',
  owner_first_name: '',
  owner_last_name: '',
  email_id: '',
  contact_number_1: '',
  business_hours: {
    monday: { ...DEFAULT_BUSINESS_HOURS },
    tuesday: { ...DEFAULT_BUSINESS_HOURS },
    wednesday: { ...DEFAULT_BUSINESS_HOURS },
    thursday: { ...DEFAULT_BUSINESS_HOURS },
    friday: { ...DEFAULT_BUSINESS_HOURS },
    saturday: { ...WEEKEND_BUSINESS_HOURS },
    sunday: { ...WEEKEND_BUSINESS_HOURS },
  },
}; 