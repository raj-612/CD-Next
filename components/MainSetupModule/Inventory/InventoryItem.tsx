'use client';

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
import { Textarea } from '@/components/ui/textarea';
import type { Control } from 'react-hook-form';
import type { InventoryFormValues } from './schema';

interface InventoryItemProps {
  index: number;
  control: Control<InventoryFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeItem: () => void;
  showRemoveButton: boolean;
}

export function InventoryItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeItem,
  showRemoveButton,
}: InventoryItemProps) {
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
          <div>
            <FormField
              control={control}
              name={`inventory.${index}.product_name`}
              render={({ field }) => (
                <h3 className="text-sm font-medium text-gray-900">
                  {field.value || `Product ${index + 1}`}
                </h3>
              )}
            />
            
            {!isExpanded && (
              <div className="text-xs text-gray-500 flex space-x-2">
                <FormField
                  control={control}
                  name={`inventory.${index}.category`}
                  render={({ field }) => <>{field.value ? <span>{field.value}</span> : null}</>}
                />
                {/* Add a separator if both values exist */}
                <FormField
                  control={control}
                  name={`inventory.${index}.category`}
                  render={({ field: categoryField }) => (
                    <FormField
                      control={control}
                      name={`inventory.${index}.price`}
                      render={({ field: priceField }) => (
                        <>{(categoryField.value && priceField.value) ? <span>|</span> : null}</>
                      )}
                    />
                  )}
                />
                <FormField
                  control={control}
                  name={`inventory.${index}.price`}
                  render={({ field }) => (
                    <>{field.value ? <span>${field.value.toFixed(2)}</span> : null}</>
                  )}
                />
              </div>
            )}
          </div>
        </div>
        
        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeItem();
            }}
            className="h-8 w-8 text-gray-500 hover:text-red-500"
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
              name={`inventory.${index}.product_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`inventory.${index}.category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-md font-medium text-gray-700 pt-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name={`inventory.${index}.cost_to_company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`inventory.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retail Price <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`inventory.${index}.member_price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Price <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-md font-medium text-gray-700 pt-4">Inventory Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`inventory.${index}.tax`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Percentage <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        className="pr-8"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`inventory.${index}.units`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units in Stock <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="1"
                      placeholder="0"
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

          <FormField
            control={control}
            name={`inventory.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter product description" 
                    className="resize-none h-24"
                    {...field} 
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