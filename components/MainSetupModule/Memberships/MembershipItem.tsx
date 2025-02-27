'use client';

import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronUp, Trash2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { MembershipFormValues } from './schema';

interface MembershipItemProps {
  index: number;
  control: Control<MembershipFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeMembership: () => void;
  showRemoveButton: boolean;
}

export function MembershipItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeMembership,
  showRemoveButton
}: MembershipItemProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg",
        hasErrors ? "border-red-200" : "border-gray-200"
      )}
    >
      <div 
        className={cn(
          "px-6 py-4 flex items-center justify-between cursor-pointer",
          hasErrors ? "bg-red-50" : "bg-gray-50",
          "border-b border-gray-200"
        )}
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-4">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
          <div className="flex items-center space-x-3">
            <Tag className="h-5 w-5 text-gray-400" />
            <div>
              <FormField
                control={control}
                name={`memberships.${index}.membership_name`}
                render={({ field }) => (
                  <h3 className="text-sm font-medium text-gray-900">
                    {field.value || "New Membership"}
                  </h3>
                )}
              />
              <div className="flex space-x-1 text-xs text-gray-500">
                <FormField
                  control={control}
                  name={`memberships.${index}.payment_frequency`}
                  render={({ field }) => (
                    <span>
                      {field.value === 'monthly' ? 'Monthly' : 
                       field.value === 'yearly' ? 'Yearly' : 
                       'Monthly & Yearly'}
                    </span>
                  )}
                />
                <FormField
                  control={control}
                  name={`memberships.${index}.discount_percentage`}
                  render={({ field }) => (
                    field.value > 0 ? <span>| {field.value}% discount</span> : null
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeMembership();
            }}
            className="h-8 w-8 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <FormField
            control={control}
            name={`memberships.${index}.membership_name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter membership name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`memberships.${index}.discount_percentage`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter discount percentage" 
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter a percentage between 0 and 100
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`memberships.${index}.payment_frequency`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency <span className="text-red-500">*</span></FormLabel>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={field.value === 'monthly'}
                      onChange={() => field.onChange('monthly')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Monthly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={field.value === 'yearly'}
                      onChange={() => field.onChange('yearly')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Yearly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={field.value === 'both'}
                      onChange={() => field.onChange('both')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Both</span>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={control}
              name={`memberships.${index}.setup_fee`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setup Fee <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`memberships.${index}.payment_frequency`}
              render={({ field: paymentField }) => (
                <>
                {(paymentField.value === 'monthly' || paymentField.value === 'both') && (
                  <FormField
                    control={control}
                    name={`memberships.${index}.monthly_fee`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Monthly Fee <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-8"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                </>
              )}
            />

            <FormField
              control={control}
              name={`memberships.${index}.payment_frequency`}
              render={({ field: paymentField }) => (
                <>
                {(paymentField.value === 'yearly' || paymentField.value === 'both') && (
                  <FormField
                    control={control}
                    name={`memberships.${index}.yearly_fee`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Yearly Fee <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-8"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                </>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`memberships.${index}.membership_agreement`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Agreement</FormLabel>
                <FormControl>
                  <Input placeholder="Enter URL for membership agreement" {...field} />
                </FormControl>
                <FormDescription>
                  Link to a document containing the membership terms and conditions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-800">Options</h3>
            
            <FormField
              control={control}
              name={`memberships.${index}.add_to_wallet`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <FormLabel className="font-normal">Add to Wallet</FormLabel>
                  </div>
                  <FormDescription className="ml-6">
                    Allow clients to add this membership to their digital wallet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`memberships.${index}.show_on_portal`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <FormLabel className="font-normal">Show on Portal</FormLabel>
                  </div>
                  <FormDescription className="ml-6">
                    Make this membership visible on the client portal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`memberships.${index}.discounts_or_free_items`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <FormLabel className="font-normal">Include Discounts or Free Items</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`memberships.${index}.membership_description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter a description of this membership" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`memberships.${index}.free_monthly_products`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Monthly Products</FormLabel>
                <FormControl>
                  <Input placeholder="Enter free monthly products or services" {...field} />
                </FormControl>
                <FormDescription>
                  List any products or services that are free with this membership
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}