"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface OpeningHour {
  day?: string;
  open?: string;
  close?: string;
}

interface OpeningHoursFieldProps {
  value: OpeningHour[];
  onChange: (value: OpeningHour[]) => void;
}

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const h = hour % 12 || 12;
      const period = hour < 12 ? "AM" : "PM";
      const m = minute.toString().padStart(2, "0");
      times.push(`${h}:${m} ${period}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export const OpeningHoursField = ({ value, onChange }: OpeningHoursFieldProps) => {
  const addRow = () => {
    onChange([...value, { day: "Monday-Friday", open: "9:00 AM", close: "5:00 PM" }]);
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "day" | "open" | "close", newValue: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: newValue };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((hour, index) => (
        <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-card">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={hour.day || ""}
              onChange={(e) => updateRow(index, "day", e.target.value)}
              placeholder="e.g. Monday-Friday, Saturday"
            />

            <Select
              value={hour.open || "9:00 AM"}
              onValueChange={(val: string) => updateRow(index, "open", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Opening time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={hour.close || "5:00 PM"}
              onValueChange={(val: string) => updateRow(index, "close", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Closing time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeRow(index)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addRow}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Opening Hours
      </Button>
    </div>
  );
};