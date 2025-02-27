import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { servicesFormSchema, type ServiceFormValues } from './schema';
import { DEFAULT_SERVICE, INITIAL_VALUES } from './constants';
import type { Service } from '@/types/schema';

interface UseServicesFormProps {
  initialData?: Service[];
  onSubmit?: (data: ServiceFormValues) => void;
}

export function useServicesForm({ initialData, onSubmit }: UseServicesFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedServices, setExpandedServices] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: initialData?.length 
      ? { 
          services: initialData.map(service => ({
            ...DEFAULT_SERVICE,
            ...service,
          }))
        } 
      : INITIAL_VALUES,
  });

  // Setup field array for services
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  // Toggle expanded/collapsed state of a service
  const toggleService = (index: number) => {
    setExpandedServices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleSubmit = (data: ServiceFormValues) => {
    console.log('Services Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          services: data.services,
        },
      });
      
      toast.success("Services saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save services");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new service
  const addService = () => {
    const newIndex = fields.length;
    append(DEFAULT_SERVICE);
    toggleService(newIndex);
  };

  // Check if a service has errors
  const hasServiceErrors = (index: number) => {
    const errors = form.formState.errors.services?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return {
    form,
    fields,
    remove,
    expandedServices,
    toggleService,
    handleSubmit: form.handleSubmit(handleSubmit),
    addService,
    hasServiceErrors,
  };
}