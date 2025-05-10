
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { List, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  
  // Check if current path is related to lists (either /lists or / with state containing listName)
  const isListsActive = location.pathname === '/lists' || 
    (location.pathname === '/' && location.state?.listName);

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-zinc-900 text-white transition-all duration-300 ease-in-out flex flex-col",
        isHovered ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 border-b border-zinc-800">
        <h1 className={cn(
          "text-xl font-bold text-blue-500 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>Crowd Control</h1>
        <p className={cn(
          "text-sm text-zinc-400 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>Tourism Density Mapper</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/lists"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1 px-2 py-2 rounded-md transition-colors",
                  (isActive || isListsActive)
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )
              }
            >
              <List size={18} className="flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}>My Lists</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1 px-2 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )
              }
            >
              <MessageSquare size={18} className="flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}>Tourist Guide</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className={cn(
          "text-xs text-zinc-500 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <p>© 2025 Crowd Control</p>
          <p>Tourism Density Management</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
