export const STAFF_SCHEMA = {
  type: "object",
  properties: {
    staffMembers: {
      type: "array",
      description: "Array of staff members extracted from the Excel file. IMPORTANT: Include ALL staff members found in the file, do not truncate or limit the data.",
      items: {
        type: "object",
        properties: {
          first_name: {
            type: "string",
            description: "Staff member's first name"
          },
          last_name: {
            type: "string",
            description: "Staff member's last name"
          },
          email: {
            type: "string",
            description: "Staff member's email address"
          },
          phone: {
            type: "string",
            description: "Staff member's phone number"
          },
          role: {
            type: "string",
            enum: ["provider", "admin", "front_desk", "medical_director"],
            description: "Staff member's role in the clinic"
          },
          can_accept_tips: {
            type: "boolean",
            description: "Whether the staff member can accept tips"
          },
          is_provider: {
            type: "boolean",
            description: "Whether the staff member is a provider (typically true for providers)"
          },
          requires_medical_director: {
            type: "boolean",
            description: "Whether the staff member requires medical director supervision"
          },
          available_for_booking: {
            type: "boolean",
            description: "Whether the staff member is available for booking"
          },
          online_booking_enabled: {
            type: "boolean",
            description: "Whether online booking is enabled for this staff member"
          },
          photo_url: {
            type: "string",
            description: "URL to the staff member's photo"
          },
          bio: {
            type: "string",
            description: "Staff member's biography or description"
          },
          schedule: {
            type: "object",
            description: "Staff member's weekly schedule",
            properties: {
              monday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              tuesday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              wednesday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              thursday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              friday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              saturday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              },
              sunday: {
                type: "object",
                properties: {
                  available: { type: "boolean" },
                  shifts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        start: { type: "string" },
                        end: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          assigned_locations: {
            type: "array",
            items: { type: "string" },
            description: "Array of location IDs where this staff member works"
          }
        },
        required: ["first_name", "last_name", "email", "phone", "role"]
      }
    }
  },
  required: ["staffMembers"]
}; 