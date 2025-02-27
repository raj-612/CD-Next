import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSetup } from '@/context/SetupContext';
import { membershipFormSchema, type MembershipFormValues } from './schema';
import { DEFAULT_MEMBERSHIP, INITIAL_VALUES } from './constants';
import type { Membership } from '@/types/schema';

interface UseMembershipsFormProps {
  initialData?: Membership[];
  onSubmit?: () => void;
  onStepComplete?: () => Promise<void>;
}

export function useMembershipsForm({ initialData, onSubmit, onStepComplete }: UseMembershipsFormProps = {}) {
  const { dispatch } = useSetup();
  const [expandedMemberships, setExpandedMemberships] = useState<number[]>([0]);

  // Initialize form with initialData or default values
  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      memberships: initialData?.length
        ? initialData.map(membership => ({
            ...DEFAULT_MEMBERSHIP,
            ...membership,
            membership_name: membership.membership_name || "",
            discount_percentage: membership.discount_percentage || 0,
            payment_frequency: membership.payment_frequency || "monthly",
            setup_fee: membership.setup_fee || 0,
            monthly_fee: membership.monthly_fee || 0,
            yearly_fee: membership.yearly_fee || 0,
            membership_agreement: membership.membership_agreement || "",
            add_to_wallet: !!membership.add_to_wallet,
            show_on_portal: !!membership.show_on_portal,
            discounts_or_free_items: !!membership.discounts_or_free_items,
            membership_description: membership.membership_description || "",
            free_monthly_products: membership.free_monthly_products || ""
          }))
        : INITIAL_VALUES.memberships
    }
  });

  // Setup field array for memberships
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "memberships"
  });

  // Toggle expanded/collapsed state
  const toggleMembership = (index: number) => {
    setExpandedMemberships(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Handle form submission
  const handleFormSubmit = async (data: MembershipFormValues) => {
    console.log('Memberships Submitted:', data);
    
    try {
      // Update context state
      dispatch({
        type: "UPDATE_JSON_SCHEMA",
        payload: {
          memberships: data.memberships
        },
      });
      
      toast.success("Memberships saved successfully");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }

      // Call onStepComplete if provided
      if (onStepComplete) {
        await onStepComplete();
      }
    } catch (error) {
      toast.error("Failed to save memberships");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Add a new membership
  const addMembership = () => {
    const newIndex = fields.length;
    append(DEFAULT_MEMBERSHIP);
    toggleMembership(newIndex);
  };

  // Check if a membership has errors
  const hasMembershipErrors = (index: number) => {
    const errors = form.formState.errors.memberships?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return {
    form,
    fields,
    remove,
    expandedMemberships,
    toggleMembership,
    handleSubmit: form.handleSubmit(handleFormSubmit),
    addMembership,
    hasMembershipErrors
  };
}