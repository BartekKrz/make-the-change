'use client'

import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { getInitials } from '@/app/admin/(dashboard)/components/ui/format-utils'

type User = {
  id: string
  name: string
  email: string
  is_active: boolean
}

type UserListHeaderProps = {
  user: User
}

export const UserListHeader = ({ user }: UserListHeaderProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {}
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        {getInitials(user.name?.split(' ')[0], user.name?.split(' ')[1])}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">
          {user.name}
        </h3>

        <Badge color={user.is_active ? 'green' : 'red'}>
          {user.is_active ? 'actif' : 'inactif'}
        </Badge>
      </div>
    </div>
  )
}
