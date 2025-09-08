'use client'
import { Star } from 'lucide-react'
import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils'
import { type FC } from 'react'

type Project =  {
  id: string
  name: string
  status: string
  featured?: boolean
}

type ProjectListHeaderProps =  {
  project: Project
}

export const ProjectListHeader: FC<ProjectListHeaderProps> = ({ project }) => (
  <div className="flex items-center gap-2 md:gap-3">
    {}
    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
      {getInitials(project.name)}
    </div>

    <div className="flex items-center gap-2 flex-1 min-w-0">
      <h3 className="text-base font-medium text-foreground truncate">
        {project.name}
      </h3>

      <Badge color={project.status === 'active' ? 'green' : 'gray'}>
        {project.status}
      </Badge>

      {project.featured && <Star className="w-4 h-4 text-yellow-500" />}
    </div>
  </div>
)
