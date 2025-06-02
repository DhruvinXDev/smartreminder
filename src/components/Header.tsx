
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Sun, Moon, Calendar, List, BarChart3, Home } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'list' | 'calendar' | 'stats') => void;
  notificationCount: number;
  darkMode: boolean;
  onToggleTheme: () => void;
  onCreateReminder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  notificationCount,
  darkMode,
  onToggleTheme,
  onCreateReminder,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'list', label: 'List View', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg`}>
              SR
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              SmartReminder
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id as any)}
                  className={`transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`relative hover-scale ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className={`hover-scale ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Create Reminder Button */}
            <Button
              onClick={onCreateReminder}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover-scale transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reminder
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center justify-around border-t pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id as any)}
                className={`flex-col h-auto py-2 ${
                  currentView === item.id
                    ? 'text-blue-600'
                    : darkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
