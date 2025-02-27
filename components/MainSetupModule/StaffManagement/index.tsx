'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { StaffMemberItem } from './StaffMemberItem';
import { useStaffForm } from './useStaffForm';
import { type StaffMember } from './schema';

interface StaffManagementProps {
  initialData?: StaffMember[];
  onStepComplete?: () => Promise<void>;
}

export default function StaffManagement({ initialData, onStepComplete }: StaffManagementProps) {
  const {
    form,
    fields,
    remove,
    expandedStaff,
    toggleStaff,
    handleSubmit,
    addStaffMember,
    hasStaffErrors,
    handleRoleChange,
  } = useStaffForm({ 
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
          <h1 className="text-lg font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage staff members and their schedules
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <StaffMemberItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  isExpanded={expandedStaff.includes(index)}
                  hasErrors={hasStaffErrors(index) ? true : false}
                  toggleExpand={() => toggleStaff(index)}
                  removeStaffMember={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                  handleRoleChange={handleRoleChange}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addStaffMember}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
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