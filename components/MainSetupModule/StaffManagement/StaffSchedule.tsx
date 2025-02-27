'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, Controller } from 'react-hook-form';
import type { DayOfWeek } from './types';
import { DEFAULT_SHIFT } from './constants';

interface StaffScheduleProps {
  staffIndex: number;
  dayName: DayOfWeek;
}

export function StaffSchedule({ staffIndex, dayName }: StaffScheduleProps) {
  const { control, watch } = useFormContext();
  const schedulePath = `staff.${staffIndex}.schedule.${dayName}` as const;
  const isAvailable = watch(`${schedulePath}.available`);
  const shifts = watch(`${schedulePath}.shifts`) || [];

  // Function to add a new shift
  const addShift = () => {
    return [...shifts, { ...DEFAULT_SHIFT }];
  };

  // Function to capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex items-center gap-4 mb-2">
        <FormField
          control={control}
          name={`${schedulePath}.available`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 mb-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="mb-0 font-medium text-gray-900 capitalize">
                {capitalize(dayName)}
              </FormLabel>
            </FormItem>
          )}
        />

        {isAvailable && (
          <Button
            type="button"
            variant="link"
            onClick={() => {
              const newShifts = addShift();
              control._formValues.staff[staffIndex].schedule[dayName].shifts = newShifts;
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Shift
          </Button>
        )}
      </div>

      {isAvailable && (
        <div className="pl-8 space-y-3">
          <Controller
            control={control}
            name={`${schedulePath}.shifts`}
            render={({ field }) => (
              <>
                {field.value.map((_: any, shiftIndex: number) => (
                  <div key={shiftIndex} className="flex items-center gap-2">
                    <FormField
                      control={control}
                      name={`${schedulePath}.shifts.${shiftIndex}.start`}
                      render={({ field: startField }) => (
                        <FormItem className="flex-1 max-w-[150px]">
                          <FormControl>
                            <Input
                              type="time"
                              {...startField}
                              placeholder="09:00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <span className="text-gray-500">to</span>

                    <FormField
                      control={control}
                      name={`${schedulePath}.shifts.${shiftIndex}.end`}
                      render={({ field: endField }) => (
                        <FormItem className="flex-1 max-w-[150px]">
                          <FormControl>
                            <Input
                              type="time"
                              {...endField}
                              placeholder="17:00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newShifts = [...field.value];
                        newShifts.splice(shiftIndex, 1);
                        field.onChange(newShifts);
                      }}
                      className="h-9 w-9 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          />
        </div>
      )}
    </div>
  );
}