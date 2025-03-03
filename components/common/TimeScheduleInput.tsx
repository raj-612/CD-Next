'use client';

import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useWatch, type ArrayPath, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button } from "../ui/button";

interface TimeScheduleInputProps <T extends FieldValues> {
  name : Path<T>;
  control : Control<T>;
  dayLabel: string;
}

const TimeScheduleInput = <T extends FieldValues>({name, control, dayLabel}: TimeScheduleInputProps<T>) => {
  const available = useWatch({
    control,
    name: `${name}.available` as Path<T>,
    defaultValue: false as any,
  });
  
  const  {fields, append,remove} = useFieldArray({
    control,
    name : `${name}.shifts` as ArrayPath<T>,
  });

  const handleAddShift = () => {
    append({
      start: '',
      end: '',
    } as any);
  };

  return (<>
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <Controller
        control={control}
        name={`${name}.available` as Path<T>}
        render={({ field }) => (
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
            checked={field.value} 
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      <span className="font-medium text-gray-700">{dayLabel.charAt(0).toLocaleUpperCase() + dayLabel.slice(1)}</span>
    </div>
    
    {available && (
      <Button 
        onClick={handleAddShift} 
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs flex items-center gap-1"
      >
        <Plus className="h-3 w-3" />
        <span>Add</span>
      </Button>
    )}
  </div>
  
  {available && (
    <div className="pl-6 flex flex-wrap gap-3 mb-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-100">
          <div className="flex gap-2">
            {}
            <Controller
              control={control}
              name={`${name}.shifts.${index}.start` as Path<T>}
              render={({ field: startField }) => (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Start</span>
                  <input
                    type="time"
                    className="px-2 py-1 text-sm border border-gray-200 rounded-md w-28"
                    value={startField.value || ''}
                    onChange={startField.onChange}
                  />
                </div>
              )}
            />
            
            {}
            <Controller
              control={control}
              name={`${name}.shifts.${index}.end` as Path<T>}
              render={({ field: endField }) => (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">End</span>
                  <input
                    type="time"
                    className="px-2 py-1 text-sm border border-gray-200 rounded-md w-28"
                    value={endField.value || ''}
                    onChange={endField.onChange}
                  />
                </div>
              )}
            />
            
            {}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-7 w-7 text-gray-400 hover:text-red-500 self-end mb-1 ml-1"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )}
  </>);
}

export default TimeScheduleInput;