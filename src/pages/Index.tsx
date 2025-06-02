
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { ReminderForm } from '@/components/ReminderForm';
import { ReminderList } from '@/components/ReminderList';
import { CalendarView } from '@/components/CalendarView';
import { StatsPanel } from '@/components/StatsPanel';
import { useToast } from '@/hooks/use-toast';

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  note: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const Index = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'calendar' | 'stats'>('dashboard');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('smartreminder-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load saved reminders
    const savedReminders = localStorage.getItem('smartreminder-data');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const saveReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders);
    localStorage.setItem('smartreminder-data', JSON.stringify(newReminders));
  };

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
    setShowReminderForm(false);
    toast({
      title: "Reminder Created",
      description: "Your reminder has been successfully created!",
    });
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, ...updates } : reminder
    );
    saveReminders(updatedReminders);
    setEditingReminder(null);
    toast({
      title: "Reminder Updated",
      description: "Your reminder has been successfully updated!",
    });
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
    toast({
      title: "Reminder Deleted",
      description: "Your reminder has been successfully deleted!",
    });
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
    switch (currentView) {
      case 'list':
        return (
          <ReminderList
            reminders={reminders}
            onEdit={setEditingReminder}
            onDelete={deleteReminder}
            onToggleComplete={updateReminder}
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
            (data) => updateReminder(editingReminder.id, data) : 
            addReminder
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
