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
          packages: initialData.map(item => {
            // Process each package to ensure type compatibility
            const processedItem: Record<string, any> = { ...DEFAULT_PACKAGE };
            
            // Copy all fields from the item, converting null values to undefined
            Object.entries(item).forEach(([key, value]) => {
              processedItem[key] = value === null ? undefined : value;
            });
            
            return processedItem;
          })
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
    append({ ...DEFAULT_PACKAGE });
    togglePackage(newIndex);
  };

  // Check if a package has errors
  const hasPackageErrors = (index: number) => {
    const errors = form.formState.errors.packages?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  // Add function to update packages from Excel import
  const updatePackages = (packages: Package[]) => {
    // Process packages to ensure type compatibility
    const processedPackages = packages.map(pkg => {
      // Start with default package to ensure all required fields are present
      return {
        ...DEFAULT_PACKAGE,
        // Override with values from the imported package, handling nulls
        discount_name: pkg.discount_name || "",
        discount_type: pkg.discount_type || "percentage",
        discount_percentage: pkg.discount_percentage,
        discount_amount: pkg.discount_amount,
        package_price: pkg.package_price,
        member_price: pkg.member_price,
        apply_to: pkg.apply_to || "all_products",
        included_products: Array.isArray(pkg.included_products) ? pkg.included_products : [],
        customer_availability: pkg.customer_availability || "all",
        online_portal_available: !!pkg.online_portal_available,
        package_description: pkg.package_description || "",
        locations: Array.isArray(pkg.locations) ? pkg.locations : [],
        providers: Array.isArray(pkg.providers) ? pkg.providers : [],
        start_date: pkg.start_date || DEFAULT_PACKAGE.start_date,
        end_date: pkg.end_date || DEFAULT_PACKAGE.end_date
      };
    });
    
    form.setValue('packages', processedPackages, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
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
    updatePackages,
  };
}