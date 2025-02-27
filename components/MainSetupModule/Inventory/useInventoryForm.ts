import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { inventoryFormSchema, type InventoryFormValues } from './schema';
import { DEFAULT_INVENTORY_ITEM, INITIAL_VALUES } from './constants';
import type { InventoryItem } from '@/types/schema';

interface UseInventoryFormProps {
  initialData?: InventoryItem[];
  onSubmit?: (data: InventoryFormValues) => void;
}

export function useInventoryForm({ initialData, onSubmit }: UseInventoryFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: initialData?.length 
      ? { 
          inventory: initialData.map(item => ({
            ...DEFAULT_INVENTORY_ITEM,
            ...item,
          }))
        } 
      : INITIAL_VALUES,
  });

  // Setup field array for inventory items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  // Toggle expanded/collapsed state of an inventory item
  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleSubmit = (data: InventoryFormValues) => {
    console.log('Inventory Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          inventory: data.inventory,
        },
      });
      
      toast.success("Inventory saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save inventory");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new inventory item
  const addItem = () => {
    const newIndex = fields.length;
    append(DEFAULT_INVENTORY_ITEM);
    toggleItem(newIndex);
  };

  // Check if an inventory item has errors
  const hasItemErrors = (index: number) => {
    const errors = form.formState.errors.inventory?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return {
    form,
    fields,
    remove,
    expandedItems,
    toggleItem,
    handleSubmit: form.handleSubmit(handleSubmit),
    addItem,
    hasItemErrors,
  };
}