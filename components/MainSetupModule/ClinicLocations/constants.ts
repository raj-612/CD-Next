import type { OnlineBookingType } from "./types";

export const DEFAULT_LOCATION = {
  name: "",
  street_address: "",
  street_address_line_2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
  notification_sms: "",
  notification_emails: "",
  online_booking_type: "both" as OnlineBookingType,
  accepts_tips: false
};

export const INITIAL_VALUES = {
  locations: [DEFAULT_LOCATION]
}; 