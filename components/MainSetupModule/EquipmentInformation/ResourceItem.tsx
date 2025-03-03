'use client';

import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronUp, Trash2, Wrench } from 'lucide-react';
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
import type { EquipmentFormValues } from './schema';
import TimeScheduleInput from '@/components/common/TimeScheduleInput';
import { DAYS_OF_WEEK } from "./constants";

interface ResourceItemProps {
  index: number;
  control: Control<EquipmentFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeResource: () => void;
  showRemoveButton: boolean;
}

export function ResourceItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeResource,
  showRemoveButton
}: ResourceItemProps) {
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
            <Wrench className="h-5 w-5 text-gray-400" />
            <div>
              <FormField
                control={control}
                name={`resources.${index}.name`}
                render={({ field }) => (
                  <h3 className="text-sm font-medium text-gray-900">
                    {field.value || "New Resource"}
                  </h3>
                )}
              />
              <div className="flex space-x-1 text-xs text-gray-500">
                <FormField
                  control={control}
                  name={`resources.${index}.clinic`}
                  render={({ field }) => (
                    <span>{field.value || ""}</span>
                  )}
                />
                {/* Add a dash only if both fields have values */}
                <FormField
                  control={control}
                  name={`resources.${index}.type`}
                  render={({ field }) => (
                    <span>{field.value ? ` - ${field.value}` : ""}</span>
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
              removeResource();
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
            name={`resources.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter resource name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`resources.${index}.clinic`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter clinic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`resources.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Type <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter resource type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`resources.${index}.schedule`}
            render={() => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-semibold">
                  Schedule <span className="text-red-500">*</span>
                </FormLabel>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <TimeScheduleInput
                      key={day.key}
                      control={control as any}
                      name={`resources.${index}.schedule.${day.key}` as any}
                      dayLabel={day.label}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`resources.${index}.required_services`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Services <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Service names, comma separated"
                    value={field.value.join(", ")}
                    onChange={(e) => {
                      const services = e.target.value
                        .split(",")
                        .map(s => s.trim())
                        .filter(s => s.length > 0);
                      field.onChange(services);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}