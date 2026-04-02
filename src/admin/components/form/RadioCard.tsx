import React from "react";

interface RadioCardProps {
  id: string;
  title: string;
  description?: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (id: string) => void;
  icon?: string; // Optional: PrimeIcons class like 'pi pi-globe'
}

export default function RadioCard({ id, title, description, checked, disabled, onChange, icon }: RadioCardProps) {
  return (
    <div
      onClick={() => !disabled && onChange(id)}
      role="radio"
      aria-checked={checked}
      className={`relative flex items-start p-4 border-2 rounded-xl transition-all duration-200 ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
          : checked
            ? "border-primary bg-primary-50 cursor-pointer shadow-sm"
            : "border-gray-200 hover:border-primary-300 hover:bg-gray-50 cursor-pointer"
      }`}
    >
      {/* Custom Radio Button Indicator */}
      <div className="flex-shrink-0 mt-0.5 mr-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            checked ? "border-primary" : "border-gray-300"
          }`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2">
          {icon && <i className={`${icon} ${checked ? "text-primary" : "text-gray-500"}`} />}
          <span className={`font-semibold ${checked ? "text-primary-dark" : "text-gray-900"}`}>
            {title}
          </span>
        </div>
        {description && <div className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</div>}
      </div>
    </div>
  );
}
