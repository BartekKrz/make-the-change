'use client';

import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

type MobileContextType = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <MobileContext.Provider
      value={{ isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu }}
    >
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};
