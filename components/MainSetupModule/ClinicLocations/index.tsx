'use client';

import { Plus } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LocationItem } from './LocationItem';
import { useClinicForm } from './useClinicForm';
import { type ClinicFormValues, type Location } from './schema';

interface ClinicLocationsProps {
  initialData?: Location[];
  onSubmit?: (data: ClinicFormValues) => void;
}

export function ClinicLocations({ initialData, onSubmit }: ClinicLocationsProps = {}) {
  const {
    form,
    fields,
    remove,
    expandedClinics,
    toggleClinic,
    handleSubmit,
    addLocation,
    hasLocationErrors,
  } = useClinicForm({ initialData, onSubmit });

  console.log("initialData", initialData);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Clinic Locations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage your clinic locations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <LocationItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedClinics.includes(index)}
                  hasErrors={!!hasLocationErrors(index)}
                  toggleExpand={() => toggleClinic(index)}
                  removeLocation={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addLocation}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Location
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
  );
} 