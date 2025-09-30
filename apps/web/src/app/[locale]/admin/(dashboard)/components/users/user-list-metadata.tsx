'use client';

import { Mail, Shield } from 'lucide-react';

import type { FC } from 'react';

type User = {
  email: string;
  role: string;
};

type UserListMetadataProps = {
  user: User;
};

export const UserListMetadata: FC<UserListMetadataProps> = ({ user }) => {
  return (
    <div className="space-y-2">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Mail className="text-primary/70 md:group-hover:text-primary group-active:text-primary h-4 w-4 transition-colors duration-200" />
        <span className="font-mono text-sm">{user.email}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
          <Shield className="h-4 w-4 text-orange-500/70 transition-colors duration-200 group-active:text-orange-500 md:group-hover:text-orange-500" />
          <span className="text-sm">{user.role}</span>
        </div>
      </div>
    </div>
  );
};
