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
            schedule: equipment.schedule || "",
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
            schedule: resource.schedule || "",
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
    console.log('Equipment & Resources Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          equipment: data.equipment,
          resources: data.resources
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
      console.error("Error in handleSubmit:", error);
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
  };
}