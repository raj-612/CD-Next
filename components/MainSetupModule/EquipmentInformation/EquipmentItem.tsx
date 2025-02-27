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

interface EquipmentItemProps {
  index: number;
  control: Control<EquipmentFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeEquipment: () => void;
  showRemoveButton: boolean;
}

export function EquipmentItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeEquipment,
  showRemoveButton
}: EquipmentItemProps) {
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
                name={`equipment.${index}.name`}
                render={({ field }) => (
                  <h3 className="text-sm font-medium text-gray-900">
                    {field.value || "New Equipment"}
                  </h3>
                )}
              />
              <FormField
                control={control}
                name={`equipment.${index}.clinic`}
                render={({ field }) => (
                  <p className="text-xs text-gray-500">
                    {field.value || ""}
                  </p>
                )}
              />
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
              removeEquipment();
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
            name={`equipment.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter device name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`equipment.${index}.clinic`}
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
            name={`equipment.${index}.schedule`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter schedule" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`equipment.${index}.required_services`}
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

          <FormField
            control={control}
            name={`equipment.${index}.cleanup_time`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleanup Time (minutes) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter cleanup time in minutes" 
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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