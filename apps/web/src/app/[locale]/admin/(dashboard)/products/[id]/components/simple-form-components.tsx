'use client';

import { type FC } from 'react';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { TextArea } from '../../../components/ui/textarea';


type SimpleInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SimpleInput: FC<SimpleInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

type SimpleTextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export const SimpleTextArea: FC<SimpleTextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
    </div>
  );
};

type SimpleSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
}

export const SimpleSelect: FC<SimpleSelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};