'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { InventoryItem } from './InventoryItem';
import { useInventoryForm } from './useInventoryForm';
import type { InventoryItem as InventoryItemType } from './schema';

interface InventoryProps {
  initialData?: InventoryItemType[];
  onStepComplete?: () => Promise<void>;
}

export default function Inventory({ initialData, onStepComplete }: InventoryProps) {
  const {
    form,
    fields,
    remove,
    expandedItems,
    toggleItem,
    handleSubmit,
    addItem,
    hasItemErrors,
  } = useInventoryForm({ 
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
          <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage your product inventory
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <InventoryItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedItems.includes(index)}
                  hasErrors={hasItemErrors(index) ? true : false}
                  toggleExpand={() => toggleItem(index)}
                  removeItem={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
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