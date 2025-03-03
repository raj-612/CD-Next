export const EQUIPMENT_SCHEMA = {
  type: "object",
  properties: {
    equipment: {
      type: "array",
      description: "Array of equipment extracted from the Excel file. IMPORTANT: Include ALL equipment found in the file, do not truncate or limit the data.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Equipment name"
          },
          clinic: {
            type: "string",
            description: "Clinic name where the equipment is located"
          },
          schedule: {
            type: "object",
            description: "Equipment's weekly schedule",
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
          required_services: {
            type: "array",
            items: { type: "string" },
            description: "Array of service names required for this equipment"
          },
          cleanup_time: {
            type: "number",
            description: "Cleanup time in minutes required after each use"
          }
        },
        required: ["name", "clinic", "schedule", "required_services", "cleanup_time"]
      }
    },
    resources: {
      type: "array",
      description: "Array of resources extracted from the Excel file. IMPORTANT: Include ALL resources found in the file, do not truncate or limit the data.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Resource name"
          },
          clinic: {
            type: "string",
            description: "Clinic name where the resource is located"
          },
          type: {
            type: "string",
            description: "Type of resource"
          },
          schedule: {
            type: "object",
            description: "Resource's weekly schedule",
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
          required_services: {
            type: "array",
            items: { type: "string" },
            description: "Array of service names required for this resource"
          }
        },
        required: ["name", "clinic", "type", "schedule", "required_services"]
      }
    }
  },
  required: ["equipment", "resources"]
}; 