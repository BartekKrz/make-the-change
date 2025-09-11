'use client';

import { CheckCircle, AlertCircle, Save, Dot, Upload } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/types';
import { Button } from '@/components/ui/button';


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
        {Icon && <Icon className="shrink-0" size={12} />} 
        <span className="hidden sm:inline truncate">
          {saveStatus.count && saveStatus.count > 0 
            ? `${saveStatus.count} modification${saveStatus.count > 1 ? 's' : ''}`
            : config.message
          }
        </span>
        {saveStatus.count && saveStatus.count > 0 && onSaveAll && (
          <Button
            className="ml-1 px-1.5 py-0.5 h-5 text-xs hover:bg-amber-100"
            size="sm"
            variant="ghost"
            onClick={onSaveAll}
          >
            <Save className="mr-0.5" size={10} />
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