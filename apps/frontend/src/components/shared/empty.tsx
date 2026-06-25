// Empty state
// TODO: Add empty state component
import { ReactNode } from 'react';
import { Card } from '@devglobal/ui';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      {icon && (
        <div className="text-muted-foreground mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </Card>
  );
}