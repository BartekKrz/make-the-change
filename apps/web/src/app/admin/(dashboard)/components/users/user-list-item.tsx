'use client'

import { AdminListItem } from '@/app/admin/(dashboard)/components/ui/admin-list-item'
import { UserListHeader } from './user-list-header'
import { UserListMetadata } from './user-list-metadata'
import type { FC } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
}

type UserListItemProps = {
  user: User
  actions?: React.ReactNode
}

export const UserListItem: FC<UserListItemProps> = ({ user, actions }) => {
  return (
    <AdminListItem
      href={`/admin/users/${user.id}`}
      header={<UserListHeader user={user} />}
      metadata={<UserListMetadata user={user} />}
      actions={actions}
    />
  )
}
