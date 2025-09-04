'use client';
import { type ReactNode } from 'react';
import { type ViewMode } from '../ui/view-toggle';
import { AdminPageHeader } from './header';
import { AdminPageContent } from './content';
import { AdminPageFooter } from './footer';
import { FilterModal } from './filter-modal';

// Types pour les props du layout principal
type AdminPageLayoutProps = {
  children: ReactNode;
};

// Composant principal simple - pas de contexte, pas de magie
export const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col h-screen">
      {children}
    </div>
  );
};

// Composition des sous-composants pour le pattern compound
AdminPageLayout.Header = AdminPageHeader;
AdminPageLayout.Content = AdminPageContent;
AdminPageLayout.Footer = AdminPageFooter;
AdminPageLayout.FilterModal = FilterModal;
