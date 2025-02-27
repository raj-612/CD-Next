'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { ServiceItem } from './ServiceItem';
import { useServicesForm } from './useServicesForm';
import type { Service } from './schema';
import { useSetup } from '@/context/SetupContext';

interface ServicesProps {
  initialData?: Service[];
  onStepComplete?: () => Promise<void>;
}

export default function Services({ initialData, onStepComplete }: ServicesProps) {
  const { state } = useSetup();
  
  // Extract staff and clinics from the context
  const providers = state.jsonSchema.staff?.members
    ? state.jsonSchema.staff.members
        .filter(member => member.is_provider || member.role === 'provider')
        .map(member => ({
          id: `${member.first_name} ${member.last_name}`.trim(),
          name: `${member.first_name} ${member.last_name}`.trim(),
        }))
    : [];

  const clinics = state.jsonSchema.clinic?.locations
    ? state.jsonSchema.clinic.locations.map(location => ({
        id: location.name,
        name: location.name,
      }))
    : [];

  // We'll use the form values for service names instead

  const {
    form,
    fields,
    remove,
    expandedServices,
    toggleService,
    handleSubmit,
    addService,
    hasServiceErrors,
  } = useServicesForm({ 
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
          <h1 className="text-lg font-semibold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage your clinic services
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <ServiceItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedServices.includes(index)}
                  hasErrors={hasServiceErrors(index) ? true : false}
                  toggleExpand={() => toggleService(index)}
                  removeService={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                  providers={providers}
                  clinics={clinics}
                  services={form.getValues().services.map(s => s.service_name)}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addService}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
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