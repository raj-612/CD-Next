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

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: initialData?.length 
      ? { 
          locations: initialData.map(location => ({
            ...DEFAULT_LOCATION,
            ...location,
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  const toggleClinic = (index: number) => {
    setExpandedClinics(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = (data: ClinicFormValues) => {
    try {
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          clinic: {
            locations: data.locations,
          },
        },
      });
      
      toast.success("Clinic locations saved successfully");
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save clinic locations");
          }
  };

  const addLocation = () => {
    const newIndex = fields.length;
    append(DEFAULT_LOCATION);
    toggleClinic(newIndex);
  };

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