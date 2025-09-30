'use client';
import { type PropsWithChildren } from 'react';

import { AdminPageContent } from './content';
import { FilterModal } from './filter-modal';
import { AdminPageFooter } from './footer';
import { AdminPageHeader } from './header';

export const AdminPageLayout = ({ children }: PropsWithChildren) => (
  <div className="flex h-screen min-h-screen flex-col">{children}</div>
);

AdminPageLayout.Header = AdminPageHeader;
AdminPageLayout.Content = AdminPageContent;
AdminPageLayout.Footer = AdminPageFooter;
AdminPageLayout.FilterModal = FilterModal;
