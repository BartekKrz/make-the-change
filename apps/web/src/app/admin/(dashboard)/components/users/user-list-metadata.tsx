'use client'

import { Mail, Shield } from 'lucide-react'

type User = {
  email: string
  role: string
}

type UserListMetadataProps = {
  user: User
}

export const UserListMetadata = ({ user }: UserListMetadataProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Mail className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="font-mono text-sm">{user.email}</span>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
          <Shield className="w-4 h-4 text-orange-500/70 md:group-hover:text-orange-500 group-active:text-orange-500 transition-colors duration-200" />
          <span className="text-sm">{user.role}</span>
        </div>
      </div>
    </div>
  )
}
