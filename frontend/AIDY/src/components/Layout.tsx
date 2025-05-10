
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      <div 
        onMouseEnter={() => setIsSidebarHovered(true)} 
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <Sidebar />
      </div>
      <main 
        className={`flex-1 overflow-auto p-4 md:p-6 transition-all duration-300`}
        style={{ marginLeft: isSidebarHovered ? '16rem' : '4rem' }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
