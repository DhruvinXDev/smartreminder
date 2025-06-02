
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { ReminderForm } from '@/components/ReminderForm';
import { ReminderList } from '@/components/ReminderList';
import CalendarView from '@/components/CalendarView';
import { StatsPanel } from '@/components/StatsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useReminders, type Reminder } from '@/hooks/useReminders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { reminders, loading: remindersLoading, addReminder, updateReminder, deleteReminder } = useReminders();
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'calendar' | 'stats'>('dashboard');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('smartreminder-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            SR
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              SR
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to SmartReminder</CardTitle>
            <CardDescription>
              Sign in to manage your reminders and stay organized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddReminder = async (reminderData: Omit<Reminder, 'id' | 'completed' | 'created_at' | 'updated_at' | 'user_id'>) => {
    console.log('Adding reminder:', reminderData);
    const result = await addReminder(reminderData);
    console.log('Add reminder result:', result);
    setShowReminderForm(false);
  };

  const handleUpdateReminder = async (id: string, updates: Partial<Reminder>) => {
    console.log('Updating reminder:', id, updates);
    const result = await updateReminder(id, updates);
    console.log('Update reminder result:', result);
    setEditingReminder(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartreminder-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartreminder-theme', 'light');
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders.filter(reminder => {
      const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
      return reminderDate > now && !reminder.completed;
    }).length;
  };

  const renderCurrentView = () => {
    if (remindersLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading reminders...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'list':
        return (
          <ReminderList
            reminders={reminders}
            onEdit={setEditingReminder}
            onDelete={deleteReminder}
            onToggleComplete={handleUpdateReminder}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            reminders={reminders}
            onEdit={setEditingReminder}
            onDelete={deleteReminder}
          />
        );
      case 'stats':
        return <StatsPanel reminders={reminders} />;
      default:
        return (
          <Dashboard
            reminders={reminders}
            onCreateReminder={() => setShowReminderForm(true)}
            onViewChange={setCurrentView}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        notificationCount={getUpcomingReminders()}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onCreateReminder={() => setShowReminderForm(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
      </main>

      {(showReminderForm || editingReminder) && (
        <ReminderForm
          reminder={editingReminder}
          onSubmit={editingReminder ? 
            (data) => handleUpdateReminder(editingReminder.id, data) : 
            handleAddReminder
          }
          onClose={() => {
            setShowReminderForm(false);
            setEditingReminder(null);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Index;
