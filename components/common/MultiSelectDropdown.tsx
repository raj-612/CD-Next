'use client';

import { useState, useRef, useEffect } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { ChevronDown, X } from 'lucide-react';

export interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  label: string;
  placeholder?: string;
}

const MultiSelectDropdown = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = 'Select options...'
}: MultiSelectDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div ref={dropdownRef} className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            
            const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];
            
            
            const selectedOptions = options.filter(option => 
              selectedValues.includes(option.id)
            );
            
            
            const availableOptions = options.filter(option => 
              !selectedValues.includes(option.id)
            );

            return (
              <>
                {}
                {selectedOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedOptions.map(option => (
                      <div 
                        key={option.id}
                        className="flex items-center bg-blue-50 text-blue-700 text-xs rounded-md py-1 px-2"
                      >
                        <span>{option.name}</span>
                        <button
                          type="button"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            const newValue = selectedValues.filter(id => id !== option.id);
                            field.onChange(newValue);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {}
                <div
                  className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={`text-sm ${selectedOptions.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                    {selectedOptions.length === 0 ? placeholder : `${selectedOptions.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                {}
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {availableOptions.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
                    ) : (
                      <div className="py-1">
                        {availableOptions.map(option => (
                          <div
                            key={option.id}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              field.onChange([...selectedValues, option.id]);
                              setIsOpen(false);
                            }}
                          >
                            {option.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MultiSelectDropdown; 