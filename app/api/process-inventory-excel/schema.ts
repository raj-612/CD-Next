export const INVENTORY_SCHEMA = {
  type: "object",
  properties: {
    inventory: {
      type: "array",
      description: "Array of inventory items extracted from the Excel file. IMPORTANT: Include ALL inventory items found in the file, do not truncate or limit the data.",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Category of the inventory item"
          },
          product_name: {
            type: "string",
            description: "Name of the product"
          },
          cost_to_company: {
            type: "number",
            description: "Cost price for the company"
          },
          price: {
            type: "number",
            description: "Regular selling price"
          },
          member_price: {
            type: "number",
            description: "Price for members"
          },
          tax: {
            type: "number",
            description: "Tax percentage"
          },
          units: {
            type: "number",
            description: "Number of units in stock",
            default: 0
          },
          description: {
            type: "string",
            description: "Product description",
            default: ""
          }
        },
        required: ["category", "product_name", "cost_to_company", "price", "member_price", "tax"]
      }
    }
  },
  required: ["inventory"]
}; 