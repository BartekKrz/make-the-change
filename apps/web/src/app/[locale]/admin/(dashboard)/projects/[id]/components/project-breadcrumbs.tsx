'use client';

import { ChevronRight, Home, Target } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type ProjectData = {
  id: string;
  name: string;
  type?: string;
};

type ProjectBreadcrumbsProps = {
  projectData: ProjectData;
};

export const ProjectBreadcrumbs: FC<ProjectBreadcrumbsProps> = ({
  projectData,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 md:px-8 md:pt-6">
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex items-center gap-2 text-sm"
      >
        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin/dashboard"
        >
          <Home className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin/projects"
        >
          <Target className="h-4 w-4" />
          <span>Projets</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          {projectData.name}
        </span>
      </nav>
    </div>
  );
};
