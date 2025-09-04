'use client';
import { type ViewMode } from '../ui/view-toggle';
import { AdminPageHeader } from './header';
import { AdminPageContent } from './content';
import { AdminPageFooter } from './footer';
import { FilterModalProvider, FilterModal } from './filter-modal';

// Types pour les props du layout principal
type AdminPageLayoutProps = {
  children: React.ReactNode;
};

// Composant principal simple SANS contexte mais AVEC provider pour les filtres
export const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <FilterModalProvider>
      <div className="min-h-screen flex flex-col h-screen">
        {children}
      </div>
    </FilterModalProvider>
  );
};

// Composition des sous-composants pour le pattern compound
AdminPageLayout.Header = AdminPageHeader;
AdminPageLayout.Content = AdminPageContent;
AdminPageLayout.Footer = AdminPageFooter;
AdminPageLayout.FilterModal = FilterModal;
