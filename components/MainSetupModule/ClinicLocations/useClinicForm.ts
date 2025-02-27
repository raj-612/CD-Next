import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { clinicFormSchema, type ClinicFormValues, type Location } from './schema';
import { DEFAULT_LOCATION, INITIAL_VALUES } from './constants';
import type { OnlineBookingType } from './types';

interface UseClinicFormProps {
  initialData?: Location[];
  onSubmit?: (data: ClinicFormValues) => void;
}

export function useClinicForm({ initialData, onSubmit }: UseClinicFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedClinics, setExpandedClinics] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: initialData?.length 
      ? { 
          locations: initialData.map(location => ({
            ...DEFAULT_LOCATION,
            ...location,
            // Ensure all required fields are present with their correct types
            name: location.name || "",
            street_address: location.street_address || "",
            street_address_line_2: location.street_address_line_2 || "",
            city: location.city || "",
            state: location.state || "",
            postal_code: location.postal_code || "",
            phone: location.phone || "",
            country: location.country || "",
            notification_sms: location.notification_sms || "",
            notification_emails: Array.isArray(location.notification_emails) 
              ? location.notification_emails.join(", ") 
              : (location.notification_emails || ""),
            online_booking_type: (location.online_booking_type || "both") as OnlineBookingType,
            accepts_tips: !!location.accepts_tips
          }))
        } 
      : INITIAL_VALUES,
  });

  // Setup field array for locations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  // Toggle expanded/collapsed state of a location
  const toggleClinic = (index: number) => {
    setExpandedClinics(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleSubmit = (data: ClinicFormValues) => {
    console.log('Clinic Locations Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          clinic: {
            locations: data.locations,
          },
        },
      });
      
      toast.success("Clinic locations saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save clinic locations");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new location
  const addLocation = () => {
    const newIndex = fields.length;
    append(DEFAULT_LOCATION);
    toggleClinic(newIndex);
  };

  // Check if a location has errors
  const hasLocationErrors = (index: number) => {
    const errors = form.formState.errors.locations?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return {
    form,
    fields,
    remove,
    expandedClinics,
    toggleClinic,
    handleSubmit: form.handleSubmit(handleSubmit),
    addLocation,
    hasLocationErrors,
  };
} 