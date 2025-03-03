import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { equipmentFormSchema, type EquipmentFormValues, type Equipment, type Resource } from './schema';
import { DEFAULT_EQUIPMENT, DEFAULT_RESOURCE, INITIAL_VALUES } from './constants';

interface UseEquipmentFormProps {
  initialData?: {
    equipment?: Equipment[];
    resources?: Resource[];
  };
  onSubmit?: (data: EquipmentFormValues) => void;
  onStepComplete?: () => Promise<void>;
}

export function useEquipmentForm({ initialData, onSubmit, onStepComplete }: UseEquipmentFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedItems, setExpandedItems] = useState<{
    equipment: number[];
    resources: number[];
  }>({
    equipment: [0],
    resources: [0]
  });

  // Initialize form with initialData or default values
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      equipment: initialData?.equipment?.length
        ? initialData.equipment.map(equipment => ({
            ...DEFAULT_EQUIPMENT,
            ...equipment,
            name: equipment.name || "",
            clinic: equipment.clinic || "",
            schedule: typeof equipment.schedule === 'string' 
              ? {
                  monday: { available: false, shifts: [] },
                  tuesday: { available: false, shifts: [] },
                  wednesday: { available: false, shifts: [] },
                  thursday: { available: false, shifts: [] },
                  friday: { available: false, shifts: [] },
                  saturday: { available: false, shifts: [] },
                  sunday: { available: false, shifts: [] },
                } 
              : equipment.schedule || DEFAULT_EQUIPMENT.schedule,
            required_services: equipment.required_services || [],
            cleanup_time: equipment.cleanup_time || 0
          }))
        : INITIAL_VALUES.equipment,
      resources: initialData?.resources?.length
        ? initialData.resources.map(resource => ({
            ...DEFAULT_RESOURCE,
            ...resource,
            name: resource.name || "",
            clinic: resource.clinic || "",
            type: resource.type || "",
            schedule: typeof resource.schedule === 'string' 
              ? {
                  monday: { available: false, shifts: [] },
                  tuesday: { available: false, shifts: [] },
                  wednesday: { available: false, shifts: [] },
                  thursday: { available: false, shifts: [] },
                  friday: { available: false, shifts: [] },
                  saturday: { available: false, shifts: [] },
                  sunday: { available: false, shifts: [] },
                } 
              : resource.schedule || DEFAULT_RESOURCE.schedule,
            required_services: resource.required_services || []
          }))
        : INITIAL_VALUES.resources
    }
  });

  // Setup field arrays
  const { fields: equipmentFields, append: appendEquipment, remove: removeEquipment } = useFieldArray({
    control: form.control,
    name: "equipment"
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control: form.control,
    name: "resources"
  });

  // Toggle expanded/collapsed state
  const toggleExpanded = (section: 'equipment' | 'resources', index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [section]: prev[section].includes(index)
        ? prev[section].filter(i => i !== index)
        : [...prev[section], index]
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (data: EquipmentFormValues) => {
    
    try {
      // Convert schedule objects to strings for compatibility with global schema
      const processedEquipment = data.equipment.map(item => ({
        ...item,
        schedule: typeof item.schedule === 'string' 
          ? item.schedule 
          : JSON.stringify(item.schedule)
      }));
      
      const processedResources = data.resources.map(item => ({
        ...item,
        schedule: typeof item.schedule === 'string'
          ? item.schedule
          : JSON.stringify(item.schedule)
      }));
      
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          equipment: processedEquipment,
          resources: processedResources
        },
      });
      
      toast.success("Equipment and resources saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }

      // Call onStepComplete if provided
      if (onStepComplete) {
        await onStepComplete();
      }
    } catch (error) {
      toast.error("Failed to save equipment and resources");
    }
  };

  // Add new items
  const addEquipment = () => {
    const newIndex = equipmentFields.length;
    appendEquipment(DEFAULT_EQUIPMENT);
    toggleExpanded('equipment', newIndex);
  };

  const addResource = () => {
    const newIndex = resourceFields.length;
    appendResource(DEFAULT_RESOURCE);
    toggleExpanded('resources', newIndex);
  };

  // Check for errors
  const hasEquipmentErrors = (index: number) => {
    const errors = form.formState.errors.equipment?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  const hasResourceErrors = (index: number) => {
    const errors = form.formState.errors.resources?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  const updateFormData = (data: EquipmentFormValues) => {
    // Set entire form value directly
    form.setValue('equipment', data.equipment.map(item => ({
      ...DEFAULT_EQUIPMENT,
      ...item,
      schedule: typeof item.schedule === 'string' 
        ? {
            monday: { available: false, shifts: [] },
            tuesday: { available: false, shifts: [] },
            wednesday: { available: false, shifts: [] },
            thursday: { available: false, shifts: [] },
            friday: { available: false, shifts: [] },
            saturday: { available: false, shifts: [] },
            sunday: { available: false, shifts: [] }
          } 
        : item.schedule
    })), { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true 
    });
    
    form.setValue('resources', data.resources.map(item => ({
      ...DEFAULT_RESOURCE,
      ...item,
      schedule: typeof item.schedule === 'string' 
        ? {
            monday: { available: false, shifts: [] },
            tuesday: { available: false, shifts: [] },
            wednesday: { available: false, shifts: [] },
            thursday: { available: false, shifts: [] },
            friday: { available: false, shifts: [] },
            saturday: { available: false, shifts: [] },
            sunday: { available: false, shifts: [] }
          } 
        : item.schedule
    })), { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true 
    });
  };

  return {
    form,
    equipmentFields,
    resourceFields,
    removeEquipment,
    removeResource,
    expandedItems,
    toggleExpanded,
    handleSubmit: form.handleSubmit(handleFormSubmit),
    addEquipment,
    addResource,
    hasEquipmentErrors,
    hasResourceErrors,
    updateFormData
  };
}