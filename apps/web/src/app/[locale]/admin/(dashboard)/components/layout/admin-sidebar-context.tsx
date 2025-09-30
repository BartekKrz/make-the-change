'use client';

import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

type AdminSidebarContextType = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
};

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
  undefined
);

export const AdminSidebarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <AdminSidebarContext.Provider
      value={{
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileSidebar,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error(
      'useAdminSidebar must be used within an AdminSidebarProvider'
    );
  }
  return context;
};
