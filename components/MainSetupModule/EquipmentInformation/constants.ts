import type { Equipment, Resource } from './schema';

// Default value for new equipment item
export const DEFAULT_EQUIPMENT: Equipment = {
  name: "",
  clinic: "",
  schedule: {
    monday: { available: false, shifts: [] },
    tuesday: { available: false, shifts: [] },
    wednesday: { available: false, shifts: [] },
    thursday: { available: false, shifts: [] },
    friday: { available: false, shifts: [] },
    saturday: { available: false, shifts: [] },
    sunday: { available: false, shifts: [] }
  },
  required_services: [],
  cleanup_time: 0
};

// Default value for new resource item
export const DEFAULT_RESOURCE: Resource = {
  name: "",
  clinic: "",
  type: "",
  schedule: {
    monday: { available: false, shifts: [] },
    tuesday: { available: false, shifts: [] },
    wednesday: { available: false, shifts: [] },
    thursday: { available: false, shifts: [] },
    friday: { available: false, shifts: [] },
    saturday: { available: false, shifts: [] },
    sunday: { available: false, shifts: [] }
  },
  required_services: []
};

// Initial values for the form
export const INITIAL_VALUES = {
  equipment: [DEFAULT_EQUIPMENT],
  resources: [DEFAULT_RESOURCE]
};

// Input styles for consistency
export const inputStyles = {
  base: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400",
  focus: "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  error: "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
};

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];