import type { ClinicSetupSchema } from "@/types/schema";

const DEFAULT_SCHEDULE = {
  monday: { available: true, shifts: [{ start: "09:00", end: "12:00" }, {start:"13:00", end : "17:00"}] },
  tuesday: { available: true, shifts: [{ start: "09:00", end: "13:00" }, {start:"14:00",end:"16:00"}] },
  wednesday: { available: true, shifts: [{ start: "09:00", end: "17:00" }] },
  thursday: { available: true, shifts: [{ start: "09:00", end: "17:00" }] },
  friday: { available: true, shifts: [{ start: "09:00", end: "17:00" }] },
  saturday: { available: false, shifts: [] },
  sunday: { available: false, shifts: [] }
};

export const mockClinicData: ClinicSetupSchema = {
  business_information: {
    business_name: "Serenity Aesthetic Clinic",
    street_address: "123 Wellness Avenue",
    street_address_line_2: "Suite 200",
    city: "Beverly Hills",
    state: "California",
    postal_code: "90210",
    country: "United States",
    business_website: "https://serenityaesthetic.com",
    business_hours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" }
    },
    logo_url: "",
    owner_first_name: "Sarah",
    owner_last_name: "Johnson",
    email_id: "contact@serenityaesthetic.com",
    contact_number_1: "+1-310-555-0123"
  },
  clinic: {
    locations: [
      {
        name: "Serenity Beverly Hills",
        street_address: "123 Wellness Avenue",
        street_address_line_2: "Suite 200",
        city: "Beverly Hills",
        state: "California",
        postal_code: "90210",
        country: "United States",
        phone: "+1-310-555-0123",
        notification_sms: "(310) 555-0123",
        notification_emails: "beverly@serenityaesthetic.com",
        online_booking_type: "both",
        accepts_tips: true
      },
      {
        name: "Serenity Santa Monica",
        street_address: "456 Ocean Drive",
        street_address_line_2: "Floor 3",
        city: "Santa Monica",
        state: "California",
        postal_code: "90401",
        country: "United States",
        phone: "+1-310-555-0124",
        notification_sms: "(310) 555-0124",
        notification_emails: "santamonica@serenityaesthetic.com",
        online_booking_type: "booking_only",
        accepts_tips: true
      }
    ]
  },
  staff: {
    members: [
      {
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@serenityaesthetic.com",
        phone: "+1-310-555-0130",
        role: "provider",
        can_accept_tips: true,
        is_provider: true,
        requires_medical_director: false,
        available_for_booking: true,
        online_booking_enabled: true,
        photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3",
        bio: "Dr. Smith is a board-certified dermatologist with over 10 years of experience in aesthetic medicine.",
        schedule: { ...DEFAULT_SCHEDULE },
        assigned_locations: ["Serenity Santa Monica"]
      }
    ]
  },
  services: [
    {
      service_category: "New Patients",
      service_name: "Consult & Wrinkle Relaxer",
      service_type: "inperson",
      service_duration: 45,
      providers: ["John Smith"],
      available_clinics: ["Serenity Beverly Hills", "Serenity Santa Monica"],
      online_booking_enabled: true,
      description: "Welcome to a transformative journey with our exceptional injectors who make your skincare goals their mission. This appointment is designed exclusively for first-time visitors seeking wrinkle relaxer for a youthful appearance. The appointment will start with a full consult to build your treatment plan, and wrinkle relaxer will be administered same day for qualifying patients.",
      capture_card: true,
      deposit_amount: 35,
      incompatible_services: []
    }
  ],
  equipment: [
    {
      name: "Sylfirm X",
      clinic: "Lovely Lines",
      schedule: {
        monday: { available: true, shifts: [{ start: "08:00", end: "18:00" }] },
        tuesday: { available: true, shifts: [{ start: "08:00", end: "18:00" }] },
        wednesday: { available: true, shifts: [{ start: "08:00", end: "18:00" }] },
        thursday: { available: true, shifts: [{ start: "08:00", end: "18:00" }] },
        friday: { available: true, shifts: [{ start: "08:00", end: "18:00" }] },
        saturday: { available: false, shifts: [] },
        sunday: { available: false, shifts: [] }
      },
      required_services: ["RF Microneedling (all)"],
      cleanup_time: 10
    }
  ],
  resources: [
    {
      name: "Jane Doe, NP",
      clinic: "Lovely Lines",
      type: "GFE",
      schedule: {
        monday: { available: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        tuesday: { available: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        wednesday: { available: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        thursday: { available: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        friday: { available: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
        saturday: { available: false, shifts: [] },
        sunday: { available: false, shifts: [] }
      },
      required_services: ["New Patient Consult", "New Patient Filler", "New Patient Tox"]
    }
  ],
  inventory: [
    {
      category: "Dermal Fillers",
      product_name: "Juvederm Ultra Plus XC",
      cost_to_company: 275,
      price: 650,
      member_price: 585,
      tax: 0,
      units: 100,
      description: "A dermal filler for moderate to severe facial wrinkles and folds"
    },
    {
      category: "Neurotoxins",
      product_name: "Botox Cosmetic",
      cost_to_company: 8.5,
      price: 15,
      member_price: 13.5,
      tax: 0,
      units: 500,
      description: "Injectable neurotoxin for temporary improvement of moderate to severe wrinkles"
    },
    {
      category: "Skincare",
      product_name: "ZO Skin Health Daily Power Defense",
      cost_to_company: 75,
      price: 150,
      member_price: 135,
      tax: 8.25,
      units: 25,
      description: "Advanced anti-aging formula with retinol and antioxidants"
    }
  ],
  packages: [
    {
      discount_name: "Summer Special",
      discount_type: "percentage",
      discount_percentage: 20,
      apply_to: "all_products",
      included_products: [],
      customer_availability: "all",
      online_portal_available: false,
      locations: ["Serenity Beverly Hills", "Serenity Santa Monica"],
      providers: ["John Smith"],
      start_date: "2024-06-01",
      end_date: "2024-08-31"
    },
    {
      discount_name: "New Year Offer",
      discount_type: "fixed",
      discount_amount: 50,
      apply_to: "selected_products",
      included_products: ["Botox Cosmetic", "Juvederm Ultra Plus XC"],
      customer_availability: "members_only",
      online_portal_available: false,
      locations: ["Serenity Beverly Hills"],
      providers: ["John Smith"],
      start_date: "2024-01-01",
      end_date: "2024-01-31"
    },
    {
      discount_name: "Microneedling Package",
      discount_type: "package",
      package_price: 1200,
      member_price: 1080,
      apply_to: "selected_products",
      included_products: ["RF Microneedling Treatment"],
      customer_availability: "all",
      online_portal_available: true,
      package_description: "Series of 3 RF Microneedling treatments at a discounted package rate. Save 20% when purchasing the series.",
      locations: ["Serenity Beverly Hills", "Serenity Santa Monica"],
      providers: ["John Smith"],
      start_date: "2024-06-01",
      end_date: "2024-08-31"
    }
  ],
  memberships: [
    {
      membership_name: "Beauty Elite",
      discount_percentage: 10,
      payment_frequency: "both",
      setup_fee: 99,
      monthly_fee: 149,
      yearly_fee: 1499,
      membership_agreement: "12-month commitment required. Members receive 10% off all services and retail products.",
      add_to_wallet: true,
      show_on_portal: true,
      discounts_or_free_items: true,
      membership_description: "Our premium membership program offering exclusive discounts and monthly credits.",
      free_monthly_products: "Monthly Facial (1 unit)\nQuarterly Skin Analysis (1 unit)"
    },
    {
      membership_name: "Botox Club",
      discount_percentage: 15,
      payment_frequency: "monthly",
      setup_fee: 0,
      monthly_fee: 199,
      yearly_fee: 0,
      membership_agreement: "Monthly commitment. Members receive Botox treatments at discounted rates.",
      add_to_wallet: true,
      show_on_portal: true,
      discounts_or_free_items: true,
      membership_description: "Monthly Botox membership with guaranteed pricing and priority scheduling.",
      free_monthly_products: "Botox Treatment (up to 50 units)"
    }
  ]
}; 