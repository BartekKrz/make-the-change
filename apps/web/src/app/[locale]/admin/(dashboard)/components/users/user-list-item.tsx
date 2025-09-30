'use client';

import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item';

import { UserListHeader } from './user-list-header';
import { UserListMetadata } from './user-list-metadata';

import type { FC } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
};

type UserListItemProps = {
  user: User;
  actions?: React.ReactNode;
};

export const UserListItem: FC<UserListItemProps> = ({ user, actions }) => {
  return (
    <AdminListItem
      actions={actions}
      header={<UserListHeader user={user} />}
      href={`/admin/users/${user.id}`}
      metadata={<UserListMetadata user={user} />}
    />
  );
};
