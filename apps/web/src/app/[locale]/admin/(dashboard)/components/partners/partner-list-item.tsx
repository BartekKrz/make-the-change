'use client'

import { Mail } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils'


type Partner =  {
  id: string
  name: string
  status: string
  contact_email: string
}

type PartnerListItemProps =  {
  partner: Partner
  actions?: ReactNode
}

export const PartnerListItem: FC<PartnerListItemProps> = ({ partner, actions }) => {
  const header = (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        {getInitials(partner.name)}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">
          {partner.name}
        </h3>
        <Badge color={
          partner.status === 'active' ? 'green' :
          (partner.status === 'pending' ? 'yellow' : 'gray')
        }>
          {partner.status}
        </Badge>
      </div>
    </div>
  )

  const metadata = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Mail className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="font-mono text-sm">{partner.contact_email}</span>
      </div>
    </div>
  )

  return (
    <AdminListItem
      actions={actions}
      header={header}
      href={`/admin/partners/${partner.id}`}
      metadata={metadata}
    />
  )
}
