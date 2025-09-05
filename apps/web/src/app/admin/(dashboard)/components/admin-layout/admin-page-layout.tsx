'use client';
import { type PropsWithChildren } from 'react';
import { AdminPageHeader } from './header';
import { AdminPageContent } from './content';
import { AdminPageFooter } from './footer';
import { FilterModal } from './filter-modal';


export const AdminPageLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen flex flex-col h-screen">
    {children}
  </div>
);


AdminPageLayout.Header = AdminPageHeader;
AdminPageLayout.Content = AdminPageContent;
AdminPageLayout.Footer = AdminPageFooter;
AdminPageLayout.FilterModal = FilterModal;
