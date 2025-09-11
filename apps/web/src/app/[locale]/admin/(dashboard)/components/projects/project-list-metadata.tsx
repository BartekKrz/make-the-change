'use client'
import { Target, Box, User } from 'lucide-react'
import { type FC } from 'react'

import { formatCurrency } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils'

type Project =  {
  type: string
  current_funding: number | null
  target_budget: number
  producer_id: string
}

type ProjectListMetadataProps =  {
  project: Project
}

export const ProjectListMetadata: FC<ProjectListMetadataProps> = ({ project }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Target className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="text-sm">{project.type}</span>
      </div>

      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Box className="w-4 h-4 text-orange-500/70 md:group-hover:text-orange-500 group-active:text-orange-500 transition-colors duration-200" />
        <span className="text-sm">
          {formatCurrency(project.current_funding)} / {formatCurrency(project.target_budget)}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
      <User className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
      <span className="text-sm">Producteur: {project.producer_id}</span>
    </div>
  </div>
)
