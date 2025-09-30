'use client';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';

import type { FC } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
};

type UserListHeaderProps = {
  user: User;
};

export const UserListHeader: FC<UserListHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {}
      <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
        {getInitials(user.name?.split(' ')[0], user.name?.split(' ')[1])}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h3 className="text-foreground truncate text-base font-medium">
          {user.name}
        </h3>

        <Badge color={user.is_active ? 'green' : 'red'}>
          {user.is_active ? 'actif' : 'inactif'}
        </Badge>
      </div>
    </div>
  );
};
