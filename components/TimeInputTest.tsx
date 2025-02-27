'use client';

import React, { useState } from 'react';
import { TimeInput } from '@heroui/react';
import { Time } from '@internationalized/date';

export function TimeInputTest() {
  const [time, setTime] = useState<Time | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Time Input Test</h2>
      <div className="w-full max-w-md">
        <TimeInput
          label="Business Hours"
          value={time}
          onChange={setTime}
          granularity="minute"
        />
      </div>
      <div>
        {time && (
          <p className="text-sm">
            Selected time: {time.hour}:{time.minute.toString().padStart(2, '0')}
          </p>
        )}
      </div>
    </div>
  );
} 