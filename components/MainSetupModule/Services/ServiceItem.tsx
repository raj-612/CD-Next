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
import type { ServiceFormValues } from './schema';
// Import removed for unused constants

interface ServiceItemProps {
  index: number;
  control: Control<ServiceFormValues>;
  isExpanded: boolean;
  hasErrors: boolean;
  toggleExpand: () => void;
  removeService: () => void;
  showRemoveButton: boolean;
  providers: { id: string; name: string }[];
  clinics: { id: string; name: string }[];
  services: string[];
}

export function ServiceItem({
  index,
  control,
  isExpanded,
  hasErrors,
  toggleExpand,
  removeService,
  showRemoveButton,
  providers,
  clinics,
  services,
}: ServiceItemProps) {
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
              name={`services.${index}.service_name`}
              render={({ field }) => (
                <h3 className="text-sm font-medium text-gray-900">
                  {field.value || `New Service ${index + 1}`}
                </h3>
              )}
            />
            
            {!isExpanded && (
              <div className="text-xs text-gray-500 flex gap-2">
                <FormField
                  control={control}
                  name={`services.${index}.service_category`}
                  render={({ field }) => <span>{field.value}</span>}
                />
                <FormField
                  control={control}
                  name={`services.${index}.service_duration`}
                  render={({ field }) => (
                    <span>
                      {field.value ? `${field.value} min` : ''}
                    </span>
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
              removeService();
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
              name={`services.${index}.service_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`services.${index}.service_category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`services.${index}.service_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={field.value === 'inperson'}
                          onChange={() => field.onChange('inperson')}
                        />
                        <span className="text-sm text-gray-700">In-Person</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={field.value === 'virtual'}
                          onChange={() => field.onChange('virtual')}
                        />
                        <span className="text-sm text-gray-700">Virtual</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`services.${index}.service_duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="Enter duration in minutes"
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
            name={`services.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter service description" 
                    className="resize-none h-24"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-900">Service Availability</h4>
            
            <FormField
              control={control}
              name={`services.${index}.providers`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Providers</FormLabel>
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

            <FormField
              control={control}
              name={`services.${index}.available_clinics`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available at Clinics</FormLabel>
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
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-900">Booking Options</h4>
            
            <FormField
              control={control}
              name={`services.${index}.online_booking_enabled`}
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
                    Enable Online Booking
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`services.${index}.capture_card`}
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
                    Capture Credit Card for Booking
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`services.${index}.deposit_amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0.00"
                        className="pl-8"
                        value={field.value} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-900">Service Incompatibilities</h4>
            
            <FormField
              control={control}
              name={`services.${index}.incompatible_services`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incompatible Services</FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                      {services.length <= 1 ? (
                        <p className="text-sm text-gray-500 italic">
                          No other services available.
                        </p>
                      ) : (
                        services
                          .filter(s => s !== control._formValues.services[index].service_name && s.trim() !== '')
                          .map(service => (
                            <label key={`${service}_${Math.random().toString(36).substr(2, 9)}`} className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={field.value.includes(service)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, service]);
                                  } else {
                                    field.onChange(field.value.filter(s => s !== service));
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-700">{service}</span>
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
        </div>
      )}
    </div>
  );
}