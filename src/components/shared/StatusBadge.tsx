import React from 'react';
import { BookingStatus } from '@/types';
import { STATUS_LABELS } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { Clock, CheckCircle2, XCircle, Award } from 'lucide-react';

export interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, showIcon = true }) => {
  const config = STATUS_LABELS[status] || STATUS_LABELS.pending;

  const renderIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'confirmed':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'completed':
        return <Award className="w-3.5 h-3.5" />;
      case 'cancelled':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      {showIcon && renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};
