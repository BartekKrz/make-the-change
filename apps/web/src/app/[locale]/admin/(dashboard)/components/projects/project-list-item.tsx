'use client'

import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { ProjectListHeader } from './project-list-header'
import { ProjectListMetadata } from './project-list-metadata'
import type { FC, ReactNode } from 'react'

type Project =  {
  id: string
  name: string
  status: string
  type: string
  current_funding: number | null
  target_budget: number
  producer_id: string
  featured?: boolean
}

type ProjectListItemProps =  {
  project: Project
  actions?: ReactNode
}

export const ProjectListItem: FC<ProjectListItemProps> = ({ project, actions } ) => (
  <AdminListItem
    href={`/admin/projects/${project.id}`}
    header={<ProjectListHeader project={project} />}
    metadata={<ProjectListMetadata project={project} />}
    actions={actions}
  />
)
