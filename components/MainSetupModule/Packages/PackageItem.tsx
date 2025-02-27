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
import { useWatch } from 'react-hook-form';
import type { PackagesFormValues } from './schema';

interface PackageItemProps {
  index: number;
  control: Control<PackagesFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removePackage: () => void;
  showRemoveButton: boolean;
  clinics: { id: string; name: string }[];
  providers: { id: string; name: string }[];
  products: { id: string; name: string }[];
}

export function PackageItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removePackage,
  showRemoveButton,
  clinics,
  providers,
  products,
}: PackageItemProps) {
  // Watch discount_type to conditionally render fields
  const discountType = useWatch({
    control,
    name: `packages.${index}.discount_type`,
  });

  const applyTo = useWatch({
    control,
    name: `packages.${index}.apply_to`,
  });

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
              name={`packages.${index}.discount_name`}
              render={({ field }) => (
                <h3 className="text-sm font-medium text-gray-900">
                  {field.value || `Package ${index + 1}`}
                </h3>
              )}
            />
            
            {!isExpanded && (
              <div className="text-xs text-gray-500 flex gap-2">
                <FormField
                  control={control}
                  name={`packages.${index}.discount_type`}
                  render={({ field }) => (
                    <span className="capitalize">{field.value.replace('_', ' ')}</span>
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
              removePackage();
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
              name={`packages.${index}.discount_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`packages.${index}.discount_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <select 
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="package">Package Deal</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Conditionally render fields based on discount type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discountType === 'percentage' && (
              <FormField
                control={control}
                name={`packages.${index}.discount_percentage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100"
                          step="0.01"
                          placeholder="0"
                          className="pr-8"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {discountType === 'fixed' && (
              <FormField
                control={control}
                name={`packages.${index}.discount_amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {discountType === 'package' && (
              <>
                <FormField
                  control={control}
                  name={`packages.${index}.package_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Price <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            value={field.value === null ? '' : field.value}
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
                  name={`packages.${index}.member_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormField
            control={control}
            name={`packages.${index}.apply_to`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apply Discount To <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        checked={field.value === 'all_products'}
                        onChange={() => field.onChange('all_products')}
                      />
                      <span className="text-sm text-gray-700">All Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        checked={field.value === 'selected_products'}
                        onChange={() => field.onChange('selected_products')}
                      />
                      <span className="text-sm text-gray-700">Selected Products</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {applyTo === 'selected_products' && (
            <FormField
              control={control}
              name={`packages.${index}.included_products`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Products <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                      {products.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No products available. Please add products in the Inventory section.
                        </p>
                      ) : (
                        products.map(product => (
                          <label key={product.id} className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={field.value.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, product.id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== product.id));
                                }
                              }}
                            />
                            <span className="text-sm text-gray-700">{product.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`packages.${index}.customer_availability`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Availability <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={field.value === 'all'}
                          onChange={() => field.onChange('all')}
                        />
                        <span className="text-sm text-gray-700">All Customers</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={field.value === 'members_only'}
                          onChange={() => field.onChange('members_only')}
                        />
                        <span className="text-sm text-gray-700">Members Only</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`packages.${index}.online_portal_available`}
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
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Available on Online Portal
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`packages.${index}.package_description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter package description" 
                    className="resize-none h-24"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`packages.${index}.locations`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Locations</FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                      {clinics.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No clinics available. Please add clinics in the Clinic Locations section.
                        </p>
                      ) : (
                        clinics.map(clinic => (
                          <label key={clinic.id} className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={field.value.includes(clinic.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, clinic.id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== clinic.id));
                                }
                              }}
                            />
                            <span className="text-sm text-gray-700">{clinic.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`packages.${index}.providers`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Providers</FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                      {providers.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No providers available. Please add providers in the Staff section.
                        </p>
                      ) : (
                        providers.map(provider => (
                          <label key={provider.id} className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={field.value.includes(provider.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, provider.id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== provider.id));
                                }
                              }}
                            />
                            <span className="text-sm text-gray-700">{provider.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`packages.${index}.start_date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`packages.${index}.end_date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}