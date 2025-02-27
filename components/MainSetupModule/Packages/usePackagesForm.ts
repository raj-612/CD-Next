import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { packagesFormSchema, type PackagesFormValues } from './schema';
import { DEFAULT_PACKAGE, INITIAL_VALUES } from './constants';
import type { Package } from '@/types/schema';

interface UsePackagesFormProps {
  initialData?: Package[];
  onSubmit?: (data: PackagesFormValues) => void;
}

export function usePackagesForm({ initialData, onSubmit }: UsePackagesFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedPackages, setExpandedPackages] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<PackagesFormValues>({
    resolver: zodResolver(packagesFormSchema),
    defaultValues: initialData?.length 
      ? { 
          packages: initialData.map(item => ({
            ...DEFAULT_PACKAGE,
            ...item,
          }))
        } 
      : INITIAL_VALUES,
  });

  // Setup field array for packages
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "packages",
  });

  // Toggle expanded/collapsed state of a package
  const togglePackage = (index: number) => {
    setExpandedPackages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleSubmit = (data: PackagesFormValues) => {
    console.log('Packages Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          packages: data.packages,
        },
      });
      
      toast.success("Packages saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save packages");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new package
  const addPackage = () => {
    const newIndex = fields.length;
    append(DEFAULT_PACKAGE);
    togglePackage(newIndex);
  };

  // Check if a package has errors
  const hasPackageErrors = (index: number) => {
    const errors = form.formState.errors.packages?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return {
    form,
    fields,
    remove,
    expandedPackages,
    togglePackage,
    handleSubmit: form.handleSubmit(handleSubmit),
    addPackage,
    hasPackageErrors,
  };
}