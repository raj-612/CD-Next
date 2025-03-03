import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { servicesFormSchema, type ServiceFormValues, type ServiceItemValues } from './schema';
import { DEFAULT_SERVICE, INITIAL_VALUES } from './constants';

interface UseServicesFormProps {
  initialData?: ServiceItemValues[];
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

  const handleSubmit = (data: ServiceFormValues) => {
    try {
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          services: data.services,
        },
      });
      
      toast.success("Services saved successfully");
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save services");
    }
  };

  const addService = () => {
    const newIndex = fields.length;
    append(DEFAULT_SERVICE);
    toggleService(newIndex);
  };

  const hasServiceErrors = (index: number) => {
    const errors = form.formState.errors.services?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  const updateServices = (services: ServiceItemValues[]) => {
    form.setValue('services', services, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
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
    updateServices,
  };
}