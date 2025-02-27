'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { MembershipItem } from './MembershipItem';
import { useMembershipsForm } from './useMembershipsForm';
import type { MembershipsProps } from './schema';

export default function Memberships({ initialData, onSubmit, onStepComplete }: MembershipsProps) {
  const {
    form,
    fields,
    remove,
    expandedMemberships,
    toggleMembership,
    handleSubmit,
    addMembership,
    hasMembershipErrors
  } = useMembershipsForm({ initialData, onSubmit, onStepComplete });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Memberships</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage membership plans for your clients
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <MembershipItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedMemberships.includes(index)}
                  hasErrors={!!hasMembershipErrors(index)}
                  toggleExpand={() => toggleMembership(index)}
                  removeMembership={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMembership}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Membership
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