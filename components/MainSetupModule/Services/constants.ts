import type { ServiceFormValues } from './schema';

export const DEFAULT_SERVICE = {
  service_category: '',
  service_name: '',
  service_type: 'inperson' as const,
  service_duration: 60,
  providers: [],
  available_clinics: [],
  online_booking_enabled: true,
  description: '',
  capture_card: false,
  deposit_amount: 0,
  incompatible_services: [],
};

// No predefined categories or durations as per requirements

export const INITIAL_VALUES: ServiceFormValues = {
  services: [{ ...DEFAULT_SERVICE }],
};