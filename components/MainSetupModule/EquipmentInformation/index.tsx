'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useEquipmentForm } from './useEquipmentForm';
import { EquipmentItem } from './EquipmentItem';
import { ResourceItem } from './ResourceItem';
import type { EquipmentInformationProps } from './schema';

export function EquipmentInformation({ initialData, onSubmit, onStepComplete }: EquipmentInformationProps) {
  const {
    form,
    equipmentFields,
    resourceFields,
    removeEquipment,
    removeResource,
    expandedItems,
    toggleExpanded,
    handleSubmit,
    addEquipment,
    addResource,
    hasEquipmentErrors,
    hasResourceErrors,
  } = useEquipmentForm({ initialData, onSubmit, onStepComplete });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Equipment & Resources</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add equipment and resources that will be used for services.
          </p>
        </div>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Equipment Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Equipment</h2>
                {equipmentFields.map((field, index) => (
                  <EquipmentItem
                    key={field.id}
                    index={index}
                    control={form.control}
                    isExpanded={expandedItems.equipment.includes(index)}
                    hasErrors={!!hasEquipmentErrors(index)}
                    toggleExpand={() => toggleExpanded('equipment', index)}
                    removeEquipment={() => removeEquipment(index)}
                    showRemoveButton={equipmentFields.length > 1}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addEquipment}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
              
              {/* Resources Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Resources</h2>
                {resourceFields.map((field, index) => (
                  <ResourceItem
                    key={field.id}
                    index={index}
                    control={form.control}
                    isExpanded={expandedItems.resources.includes(index)}
                    hasErrors={!!hasResourceErrors(index)}
                    toggleExpand={() => toggleExpanded('resources', index)}
                    removeResource={() => removeResource(index)}
                    showRemoveButton={resourceFields.length > 1}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addResource}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save &amp; Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}