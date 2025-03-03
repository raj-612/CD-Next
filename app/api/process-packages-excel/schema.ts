export const PACKAGES_SCHEMA = {
  type: "object",
  properties: {
    packages: {
      type: "array",
      description: "Array of packages and discount promotions extracted from the Excel file. IMPORTANT: Include ALL items found in the file, do not truncate or limit the data.",
      items: {
        type: "object",
        properties: {
          discount_name: {
            type: "string",
            description: "Name of the discount or package"
          },
          discount_type: {
            type: "string",
            enum: ["percentage", "fixed", "package"],
            description: "Type of discount: percentage, fixed amount, or package"
          },
          discount_percentage: {
            type: "number",
            description: "Discount percentage (only for percentage type discounts)",
            nullable: true
          },
          discount_amount: {
            type: "number",
            description: "Fixed discount amount (only for fixed type discounts)",
            nullable: true
          },
          package_price: {
            type: "number",
            description: "Package price (only for package type)",
            nullable: true
          },
          member_price: {
            type: "number",
            description: "Price for members (when applicable)",
            nullable: true
          },
          apply_to: {
            type: "string",
            enum: ["all_products", "selected_products"],
            description: "Whether the discount/package applies to all products or selected ones"
          },
          included_products: {
            type: "array",
            items: {
              type: "string"
            },
            description: "List of product names included in this package/discount"
          },
          customer_availability: {
            type: "string",
            enum: ["all", "members_only"],
            description: "Whether this is available to all customers or members only"
          },
          online_portal_available: {
            type: "boolean",
            description: "Whether this package is available in the online portal"
          },
          package_description: {
            type: "string",
            description: "Description of the package",
            nullable: true
          },
          locations: {
            type: "array",
            items: {
              type: "string"
            },
            description: "List of locations where this package/discount is available"
          },
          providers: {
            type: "array",
            items: {
              type: "string"
            },
            description: "List of providers who can offer this package/discount"
          },
          start_date: {
            type: "string",
            description: "Start date of the package/discount validity in YYYY-MM-DD format"
          },
          end_date: {
            type: "string",
            description: "End date of the package/discount validity in YYYY-MM-DD format"
          }
        },
        required: ["discount_name", "discount_type", "apply_to", "start_date", "end_date"]
      }
    }
  },
  required: ["packages"]
};