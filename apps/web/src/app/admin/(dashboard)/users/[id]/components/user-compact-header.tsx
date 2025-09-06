'use client';

import { type FC } from 'react';
import { User, Mail, Shield, Edit, X, Save } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
};

type UserCompactHeaderProps = {
  userData: UserData;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export const UserCompactHeader: FC<UserCompactHeaderProps> = ({
  userData,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false
}) => {

  const status = userData.is_active ? 'active' : 'inactive';

  const statusConfig = {
    active: {
      label: 'Actif',
      color: 'bg-green-500',
      bgClass: 'from-green-500/10 to-green-600/5',
      borderClass: 'border-green-500/20'
    },
    inactive: {
      label: 'Inactif',
      color: 'bg-gray-500',
      bgClass: 'from-gray-500/10 to-gray-600/5',
      borderClass: 'border-gray-500/20'
    }
  };

  const statusInfo = statusConfig[status];

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        {}
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'>
            <User className='h-5 w-5 md:h-6 md:w-6 text-primary' />
          </div>

          <div className='flex-1 min-w-0'>
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>
              {userData.name}
            </h1>

            <div className='flex items-center gap-4 flex-wrap'>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Mail className='h-3 w-3' />
                {userData.email}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Shield className='h-3 w-3' />
                {userData.role}
              </div>

              <div className='px-3 py-1 bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium'>
                #{userData.id}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className='flex items-center gap-2 flex-shrink-0 self-start md:self-auto'>
          {onEditToggle && (
            <>
              {isEditing ? (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEditToggle(false)}
                    disabled={isSaving}
                    className='text-sm'
                  >
                    <X className='h-4 w-4 mr-1' />
                    Annuler
                  </Button>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={onSave}
                    disabled={isSaving}
                    className='text-sm'
                  >
                    <Save className='h-4 w-4 mr-1' />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEditToggle(true)}
                  className='text-sm'
                >
                  <Edit className='h-4 w-4 mr-1' />
                  Modifier
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
