'use client';

import { FC, useEffect } from 'react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import type { SaveStatus } from '@/app/admin/(dashboard)/products/[id]/types';
import { CheckCircle, AlertCircle, Save, Dot, Upload } from 'lucide-react';


type SaveStatusIndicatorProps = {
  saveStatus: SaveStatus | null | undefined;
  onSaveAll?: () => void;
}

// Ce composant affiche le statut de sauvegarde calculé automatiquement
export const SaveStatusIndicator: FC<SaveStatusIndicatorProps> = ({ saveStatus, onSaveAll }) => {

  if (!saveStatus) return null;

  const mapLegacyType = (type: string) => {
    const mapping: Record<string, string> = {
      'idle': 'pristine',
      'pending': 'modified'
    };
    return mapping[type] || type;
  };

  const normalizedType = mapLegacyType(saveStatus.type);

  const statusConfig = {
    pristine: { 
      icon: null,
      color: 'text-gray-400', 
      bgColor: '', 
      show: false,
      message: '',
      compact: false,
      animate: false,
      priority: false
    },
    modified: { 
      icon: Dot,
      color: 'text-amber-500', 
      bgColor: 'bg-amber-50/80', 
      show: true,
      message: 'Modifications non sauvegardées',
      compact: true,
      animate: false,
      priority: false
    },
    saving: { 
      icon: Upload,
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50/80', 
      show: true,
      message: 'Sauvegarde...',
      compact: false,
      animate: true,
      priority: false
    },
    saved: { 
      icon: CheckCircle,
      color: 'text-emerald-500', 
      bgColor: 'bg-emerald-50/80', 
      show: true,
      message: 'Sauvegardé',
      compact: false,
      animate: false,
      priority: false
    },
    error: { 
      icon: AlertCircle,
      color: 'text-red-500', 
      bgColor: 'bg-red-50/80', 
      show: true,
      message: saveStatus.message || 'Erreur de sauvegarde',
      compact: false,
      animate: false,
      priority: true
    }
  };

  const config = statusConfig[normalizedType as keyof typeof statusConfig];
  
  if (!config || !config.show) return null;

  const Icon = config.icon;

  if (config.compact) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
        config.bgColor,
        config.color
      )}>
        {Icon && <Icon size={12} className="shrink-0" />} 
        <span className="hidden sm:inline truncate">
          {saveStatus.count && saveStatus.count > 0 
            ? `${saveStatus.count} modification${saveStatus.count > 1 ? 's' : ''}`
            : config.message
          }
        </span>
        {saveStatus.count && saveStatus.count > 0 && onSaveAll && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSaveAll}
            className="ml-1 px-1.5 py-0.5 h-5 text-xs hover:bg-amber-100"
          >
            <Save size={10} className="mr-0.5" />
            <span className="hidden md:inline">Sauvegarder</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-300',
      config.bgColor,
      config.color,
      saveStatus.type === 'saved' && 'animate-in fade-in slide-in-from-right-2',
      config.priority && 'ring-1 ring-current ring-opacity-20'
    )}>
      {Icon && (
        <Icon 
          size={14} 
          className={cn(
            'shrink-0',
            config.animate && 'animate-pulse'
          )} 
        />
      )}
      <span className="truncate max-w-[180px]">{config.message}</span>
    </div>
  );
};