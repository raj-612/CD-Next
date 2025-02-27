import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { staffFormSchema, type StaffFormValues } from './schema';
import { DEFAULT_STAFF_MEMBER, INITIAL_VALUES } from './constants';
import type { StaffRole } from './types'; 
import type { StaffMember as StaffMemberType } from '@/types/schema';

interface UseStaffFormProps {
  initialData?: StaffMemberType[];
  onSubmit?: (data: StaffFormValues) => void;
}

export function useStaffForm({ initialData, onSubmit }: UseStaffFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedStaff, setExpandedStaff] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialData?.length 
      ? { 
          staff: initialData.map(member => ({
            ...DEFAULT_STAFF_MEMBER,
            ...member,
            // Ensure all required fields are present with their correct types
            first_name: member.first_name || "",
            last_name: member.last_name || "",
            email: member.email || "",
            phone: member.phone || "",
            role: (member.role || "provider") as StaffRole,
            can_accept_tips: !!member.can_accept_tips,
            is_provider: !!member.is_provider,
            requires_medical_director: !!member.requires_medical_director,
            available_for_booking: !!member.available_for_booking,
            online_booking_enabled: !!member.online_booking_enabled,
            photo_url: member.photo_url || "",
            bio: member.bio || "",
            assigned_locations: Array.isArray(member.assigned_locations) 
              ? member.assigned_locations 
              : []
          }))
        } 
      : INITIAL_VALUES,
  });

  // Setup field array for staff members
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "staff",
  });

  // Toggle expanded/collapsed state of a staff member
  const toggleStaff = (index: number) => {
    setExpandedStaff(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleSubmit = (data: StaffFormValues) => {
    console.log('Staff Information Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          staff: {
            members: data.staff.map(member => ({
              ...member,
              photo_url: member.photo_url || '', // Convert undefined/null to empty string to match StaffMember type
              bio: member.bio || '',
            })),
          },
        },
      });
      
      toast.success("Staff information saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast.error("Failed to save staff information");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new staff member
  const addStaffMember = () => {
    const newIndex = fields.length;
    append(DEFAULT_STAFF_MEMBER);
    toggleStaff(newIndex);
  };

  // Check if a staff member has errors
  const hasStaffErrors = (index: number) => {
    const errors = form.formState.errors.staff?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  // Handle role change
  const handleRoleChange = (index: number, role: StaffRole) => {
    form.setValue(`staff.${index}.role`, role);
    form.setValue(`staff.${index}.is_provider`, role === 'provider');
    form.setValue(`staff.${index}.available_for_booking`, role === 'provider');
  };

  return {
    form,
    fields,
    remove,
    expandedStaff,
    toggleStaff,
    handleSubmit: form.handleSubmit(handleSubmit),
    addStaffMember,
    hasStaffErrors,
    handleRoleChange,
  };
}