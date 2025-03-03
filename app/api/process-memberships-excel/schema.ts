export const MEMBERSHIPS_SCHEMA = {
  type: "object",
  properties: {
    memberships: {
      type: "array",
      items: {
        type: "object",
        properties: {
          membership_name: { type: "string" },
          discount_percentage: { type: "number" },
          payment_frequency: { 
            type: "string",
            enum: ["monthly", "yearly", "both"]
          },
          setup_fee: { type: "number" },
          monthly_fee: { type: "number" },
          yearly_fee: { type: "number" },
          membership_agreement: { type: "string" },
          add_to_wallet: { type: "boolean" },
          show_on_portal: { type: "boolean" },
          discounts_or_free_items: { type: "boolean" },
          membership_description: { type: "string" },
          free_monthly_products: { type: "string" }
        },
        required: ["membership_name", "payment_frequency"]
      }
    }
  },
  required: ["memberships"]
};