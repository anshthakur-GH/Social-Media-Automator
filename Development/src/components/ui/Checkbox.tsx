import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  description,
  error,
  className = '',
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          className="
            h-4 w-4 rounded border-gray-300 text-blue-600
            focus:ring-blue-500 focus:ring-offset-0
            ${error ? 'border-red-300' : ''}
            ${className}
          "
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label htmlFor={checkboxId} className="font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
          {error && (
            <p className="text-red-600 text-xs mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;