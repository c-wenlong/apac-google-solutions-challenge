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
        isHovered ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: always reserve space, align content based on state */}
      <div className="border-b border-zinc-800 h-20 flex items-center px-4 relative">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-8 w- object-contain mr-3"
          style={{ minWidth: 32, minHeight: 32 }}
        />
        <div
          className={cn(
            "flex flex-col justify-center transition-all duration-300 overflow-hidden",
            isHovered
              ? "w-[180px] opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-4 pointer-events-none"
          )}
        >
          <h1 className="text-xl font-bold text-blue-500 leading-tight">Crowd Control</h1>
          <p className="text-sm text-zinc-400 leading-tight">Tourism Density Mapper</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/lists"
              className={({ isActive }) =>
                cn(
                  "flex items-center h-12 w-full rounded-md transition-colors",
                  isHovered ? "justify-start" : "justify-center",
                  (isActive || isListsActive)
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )
              }
            >
              <div className={cn(
                isHovered ? "w-12 flex justify-center" : "w-full flex justify-center"
              )}>
                <List size={18} className="flex-shrink-0" />
              </div>
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap overflow-hidden",
                isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}>My Lists</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                cn(
                  "flex items-center h-12 w-full rounded-md transition-colors",
                  isHovered ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )
              }
            >
              <div className={cn(
                isHovered ? "w-12 flex justify-center" : "w-full flex justify-center"
              )}>
                <MessageSquare size={18} className="flex-shrink-0" />
              </div>
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap overflow-hidden",
                isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
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
