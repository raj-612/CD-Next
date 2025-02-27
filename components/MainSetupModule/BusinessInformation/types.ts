import type { DAYS_OF_WEEK } from './constants';
import type { BusinessInformation } from './schema';

export type Day = typeof DAYS_OF_WEEK[number];

export interface BusinessInformationProps {
  onSubmit?: (data: BusinessInformation) => void;
  initialData?: Partial<BusinessInformation>;
} 