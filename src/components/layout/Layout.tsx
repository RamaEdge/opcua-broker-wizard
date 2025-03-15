import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main 
        className={`flex-1 ${isHomePage ? 'pt-0' : 'pt-20 md:pt-24'}`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
