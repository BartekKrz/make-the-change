'use client';

import { Mail } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item';
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';

type Partner = {
  id: string;
  name: string;
  status: string;
  contact_email: string;
};

type PartnerListItemProps = {
  partner: Partner;
  actions?: ReactNode;
};

export const PartnerListItem: FC<PartnerListItemProps> = ({
  partner,
  actions,
}) => {
  const header = (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
        {getInitials(partner.name)}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h3 className="text-foreground truncate text-base font-medium">
          {partner.name}
        </h3>
        <Badge
          color={
            partner.status === 'active'
              ? 'green'
              : (partner.status === 'pending'
                ? 'yellow'
                : 'gray')
          }
        >
          {partner.status}
        </Badge>
      </div>
    </div>
  );

  const metadata = (
    <div className="space-y-2">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Mail className="text-primary/70 md:group-hover:text-primary group-active:text-primary h-4 w-4 transition-colors duration-200" />
        <span className="font-mono text-sm">{partner.contact_email}</span>
      </div>
    </div>
  );

  return (
    <AdminListItem
      actions={actions}
      header={header}
      href={`/admin/partners/${partner.id}`}
      metadata={metadata}
    />
  );
};
