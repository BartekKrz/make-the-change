import { createContext, useContext } from 'react';

import type { ViewMode } from '../ui/view-toggle';

type AdminPageContextType = {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  search: string;
  setSearch: (search: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
};

const AdminPageContext = createContext<AdminPageContextType | null>(null);

export const useAdminPage = () => {
  const context = useContext(AdminPageContext);
  if (!context)
    throw new Error(
      'AdminPage compound components must be used within AdminPage.Layout'
    );
  return context;
};

export { AdminPageContext };
