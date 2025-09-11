'use client';
import { type PropsWithChildren } from 'react';

import { AdminPageContent } from './content';
import { FilterModal } from './filter-modal';
import { AdminPageFooter } from './footer';
import { AdminPageHeader } from './header';

export const AdminPageLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen flex flex-col h-screen">
    {children}
  </div>
);

AdminPageLayout.Header = AdminPageHeader;
AdminPageLayout.Content = AdminPageContent;
AdminPageLayout.Footer = AdminPageFooter;
AdminPageLayout.FilterModal = FilterModal;
