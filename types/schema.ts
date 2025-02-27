export interface StaffMember {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'provider' | 'admin' | 'front_desk' | 'medical_director';
  can_accept_tips: boolean;
  is_provider: boolean;
  requires_medical_director: boolean;
  available_for_booking: boolean;
  online_booking_enabled: boolean;
  photo_url: string;
  bio: string;
  schedule?: {
    monday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    tuesday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    wednesday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    thursday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    friday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    saturday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
    sunday?: {
      available: boolean;
      shifts: Array<{ start: string; end: string }>;
    };
  };
  assigned_locations: string[];
}

export interface BusinessInformation {
  business_name: string;
  street_address: string;
  street_address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  business_website: string;
  business_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  logo_url: string;
  owner_first_name: string;
  owner_last_name: string;
  email_id: string;
  contact_number_1: string;
}

export interface ClinicLocation {
  name: string;
  street_address: string;
  street_address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  notification_sms: string;
  notification_emails: string;
  online_booking_type: 'both' | 'booking_only' | 'ecommerce_only' | 'none';
  accepts_tips: boolean;
}

export interface Service {
  service_category: string;
  service_name: string;
  service_type: 'virtual' | 'inperson';
  service_duration: number;
  providers: string[];
  available_clinics: string[];
  online_booking_enabled: boolean;
  description: string;
  capture_card: boolean;
  deposit_amount: number;
  incompatible_services: string[];
}

export interface Equipment {
  name: string;
  clinic: string;
  schedule: string;
  required_services: string[];
  cleanup_time: number;
}

export interface Resource {
  name: string;
  clinic: string;
  type: string;
  schedule: string;
  required_services: string[];
}

export interface InventoryItem {
  category: string;
  product_name: string;
  cost_to_company: number;
  price: number;
  member_price: number;
  tax: number;
  units: number;
  description?: string;
}

export interface Package {
  discount_name: string;
  discount_type: 'percentage' | 'fixed' | 'package';
  discount_percentage?: number;
  discount_amount?: number;
  package_price?: number;
  member_price?: number;
  apply_to: 'all_products' | 'selected_products';
  included_products: string[];
  customer_availability: 'all' | 'members_only';
  online_portal_available: boolean;
  package_description?: string;
  locations: string[];
  providers: string[];
  start_date: string;
  end_date: string;
}

export interface Membership {
  membership_name: string;
  discount_percentage: number;
  payment_frequency: 'monthly' | 'yearly' | 'both';
  setup_fee: number;
  monthly_fee: number;
  yearly_fee: number;
  membership_agreement: string;
  add_to_wallet: boolean;
  show_on_portal: boolean;
  discounts_or_free_items: boolean;
  membership_description: string;
  free_monthly_products: string;
}

export interface ClinicSetupSchema {
  business_information: BusinessInformation;
  clinic: {
    locations: ClinicLocation[];
  };
  staff: {
    members: StaffMember[];
  };
  services: Service[];
  equipment: Equipment[];
  resources: Resource[];
  inventory: InventoryItem[];
  packages: Package[];
  memberships: Membership[];
} 