'use client';

import { ChevronDown, ChevronUp, Trash2, UserCircle2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import type { Control } from 'react-hook-form';
import type { StaffFormValues } from './schema';
import type { StaffRole } from './types';
import { DAYS_OF_WEEK } from './constants';
import { StaffSchedule } from './StaffSchedule';

interface StaffMemberItemProps {
  index: number;
  control: Control<StaffFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeStaffMember: () => void;
  showRemoveButton: boolean;
  handleRoleChange: (index: number, role: StaffRole) => void;
}

export function StaffMemberItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeStaffMember,
  showRemoveButton,
  handleRoleChange,
}: StaffMemberItemProps) {
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
          <div className="flex items-center space-x-3">
            <FormField
              control={control}
              name={`staff.${index}.photo_url`}
              render={({ field }) => (
                field.value ? (
                  <img 
                    src={field.value}
                    alt={`Staff member ${index + 1}`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-8 w-8 text-gray-400" />
                )
              )}
            />
            <div>
              <div className="flex space-x-1 text-sm font-medium text-gray-900">
                <FormField
                  control={control}
                  name={`staff.${index}.first_name`}
                  render={({ field }) => <span>{field.value}</span>}
                />
                <FormField
                  control={control}
                  name={`staff.${index}.last_name`}
                  render={({ field }) => <span>{field.value}</span>}
                />
                {!isExpanded && (
                  <span className="text-sm font-medium text-gray-900">
                    {!control._formValues.staff[index].first_name && 
                     !control._formValues.staff[index].last_name && 
                     `Staff Member ${index + 1}`}
                  </span>
                )}
              </div>
              {!isExpanded && (
                <FormField
                  control={control}
                  name={`staff.${index}.role`}
                  render={({ field }) => (
                    <p className="text-xs text-gray-500 capitalize">
                      {field.value?.replace('_', ' ')}
                    </p>
                  )}
                />
              )}
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
              removeStaffMember();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`staff.${index}.first_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`staff.${index}.last_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`staff.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`staff.${index}.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={control}
              name={`staff.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                  <div className="space-y-2">
                    <select
                      className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleRoleChange(index, e.target.value as StaffRole);
                      }}
                    >
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                      <option value="front_desk">Front Desk</option>
                      <option value="medical_director">Medical Director</option>
                    </select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`staff.${index}.is_provider`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 font-normal">Is Provider</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`staff.${index}.can_accept_tips`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 font-normal">Can Accept Tips</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`staff.${index}.requires_medical_director`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 font-normal">Requires Medical Director</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`staff.${index}.online_booking_enabled`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 font-normal">Online Booking Enabled</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`staff.${index}.photo_url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/photo.jpg" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`staff.${index}.bio`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter staff bio" 
                      {...field} 
                      value={field.value || ""}
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {control._formValues.staff[index].role === 'provider' || 
             control._formValues.staff[index].role === 'admin' ? (
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900">Schedule</h3>
                {DAYS_OF_WEEK.map((day) => (
                  <StaffSchedule
                    key={day}
                    staffIndex={index}
                    dayName={day}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}