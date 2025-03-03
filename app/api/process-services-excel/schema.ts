export const SERVICES_SCHEMA = {
  type: "object",
  properties: {
    services: {
      type: "array",
      items: {
        type: "object",
        properties: {
          service_category: { type: "string" },
          service_name: { type: "string" },
          service_type: { 
            type: "string",
            enum: ["virtual", "inperson"]
          },
          service_duration: { type: "number" },
          providers: { 
            type: "array",
            items: { type: "string" }
          },
          available_clinics: { 
            type: "array",
            items: { type: "string" }
          },
          online_booking_enabled: { type: "boolean" },
          description: { type: "string" },
          capture_card: { type: "boolean" },
          deposit_amount: { type: "number" },
          incompatible_services: { 
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["service_category", "service_name", "service_type", "service_duration"]
      }
    }
  },
  required: ["services"]
};