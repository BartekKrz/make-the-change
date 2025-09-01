'use client';

import Link from 'next/link';
import { FC } from 'react';
import { ChevronRight, Home, Target } from 'lucide-react';

type ProjectData = {
  id: string;
  name: string;
  type?: string;
};

type ProjectBreadcrumbsProps = {
  projectData: ProjectData;
};

export const ProjectBreadcrumbs: FC<ProjectBreadcrumbsProps> = ({ projectData }) => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-2'>
      <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Link
          href='/admin/dashboard'
          className='flex items-center gap-1 hover:text-foreground transition-colors'
        >
          <Home className='h-4 w-4' />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <Link
          href='/admin/projects'
          className='flex items-center gap-1 hover:text-foreground transition-colors'
        >
          <Target className='h-4 w-4' />
          <span>Projets</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <span className='text-foreground font-medium truncate max-w-[200px] md:max-w-none'>
          {projectData.name}
        </span>
      </nav>
    </div>
  );
};
