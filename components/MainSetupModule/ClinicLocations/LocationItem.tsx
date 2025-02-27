'use client';

import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ClinicFormValues } from './schema';

interface LocationItemProps {
  index: number;
  control: Control<ClinicFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeLocation: () => void;
  showRemoveButton: boolean;
}

export function LocationItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeLocation,
  showRemoveButton
}: LocationItemProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border",
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
          <div>
            <FormField
              control={control}
              name={`locations.${index}.name`}
              render={({ field }) => (
                <h3 className="text-lg font-medium text-gray-900">
                  {field.value || `Clinic Location ${index + 1}`}
                </h3>
              )}
            />
            {!isExpanded && (
              <div className="text-sm text-gray-500 flex space-x-1">
                <FormField
                  control={control}
                  name={`locations.${index}.street_address`}
                  render={({ field }) => <span>{field.value}</span>}
                />
                <FormField
                  control={control}
                  name={`locations.${index}.city`}
                  render={({ field }) => <span>{field.value && `, ${field.value}`}</span>}
                />
                <FormField
                  control={control}
                  name={`locations.${index}.state`}
                  render={({ field }) => <span>{field.value && `, ${field.value}`}</span>}
                />
                <FormField
                  control={control}
                  name={`locations.${index}.postal_code`}
                  render={({ field }) => <span>{field.value && ` ${field.value}`}</span>}
                />
              </div>
            )}
          </div>
        </div>
        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              removeLocation();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <FormField
            control={control}
            name={`locations.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter clinic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={control}
              name={`locations.${index}.street_address`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`locations.${index}.street_address_line_2`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt, Suite, Unit, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`locations.${index}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`locations.${index}.state`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`locations.${index}.postal_code`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`locations.${index}.country`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`locations.${index}.phone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <FormField
                control={control}
                name={`locations.${index}.notification_sms`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMS Notification Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SMS notification number" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      For internal notifications about client appointments
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={control}
                name={`locations.${index}.notification_emails`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Emails</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email1@example.com, email2@example.com" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Multiple emails can be added, separated by commas
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="block text-sm font-medium mb-2">
                Online Booking Options <span className="text-red-500">*</span>
              </FormLabel>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`locations.${index}.online_booking_type`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            checked={field.value === 'both'}
                            onChange={() => field.onChange('both')}
                          />
                          <span className="text-sm text-gray-700">
                            Available for Online Booking and eCommerce
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            checked={field.value === 'booking_only'}
                            onChange={() => field.onChange('booking_only')}
                          />
                          <span className="text-sm text-gray-700">
                            Available for Online Booking Only
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            checked={field.value === 'ecommerce_only'}
                            onChange={() => field.onChange('ecommerce_only')}
                          />
                          <span className="text-sm text-gray-700">
                            Available for eCommerce Only
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            checked={field.value === 'none'}
                            onChange={() => field.onChange('none')}
                          />
                          <span className="text-sm text-gray-700">
                            No Online Booking or eCommerce
                          </span>
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormField
                control={control}
                name={`locations.${index}.accepts_tips`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <FormLabel>Enable Tips for this Location</FormLabel>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      This will enable or disable the tip function when checking out clients
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 