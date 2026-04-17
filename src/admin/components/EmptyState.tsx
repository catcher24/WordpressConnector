import React from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction, className }) => {
  return (
    <div className={classNames(
      "flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200",
      className
    )}>
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <i className={classNames("text-gray-300 text-3xl", icon)} />
      </div>
      <h4 className="text-gray-900 font-bold text-lg m-0">{title}</h4>
      <p className="text-gray-500 text-sm max-w-sm mt-2 font-medium">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onClick={onAction}
          className="mt-6 font-bold"
          outlined
        />
      )}
    </div>
  );
};
