'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { PackageItem } from './PackageItem';
import { usePackagesForm } from './usePackagesForm';
import type { Package } from './schema';
import { useSetup } from '@/context/SetupContext';

interface PackagesProps {
  initialData?: Package[];
  onStepComplete?: () => Promise<void>;
}

export default function Packages({ initialData, onStepComplete }: PackagesProps) {
  const { state } = useSetup();
  
  // Extract clinics, providers, and products from the context
  const clinics = state.jsonSchema.clinic?.locations
    ? state.jsonSchema.clinic.locations.map(location => ({
        id: location.name,
        name: location.name,
      }))
    : [];

  const providers = state.jsonSchema.staff?.members
    ? state.jsonSchema.staff.members
        .filter(member => member.is_provider || member.role === 'provider')
        .map(member => ({
          id: `${member.first_name} ${member.last_name}`.trim(),
          name: `${member.first_name} ${member.last_name}`.trim(),
        }))
    : [];

  const products = state.jsonSchema.inventory
    ? state.jsonSchema.inventory.map(item => ({
        id: item.product_name,
        name: item.product_name,
      }))
    : [];

  const {
    form,
    fields,
    remove,
    expandedPackages,
    togglePackage,
    handleSubmit,
    addPackage,
    hasPackageErrors,
  } = usePackagesForm({ 
    initialData, 
    onSubmit: () => {
      if (onStepComplete) {
        onStepComplete().catch(error => {
          console.error("Error completing step:", error);
        });
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Packages & Promotions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage packages, promotions, and discounts
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <PackageItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedPackages.includes(index)}
                  hasErrors={hasPackageErrors(index) ? true : false}
                  toggleExpand={() => togglePackage(index)}
                  removePackage={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                  clinics={clinics}
                  providers={providers}
                  products={products}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addPackage}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save &amp; Continue
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}