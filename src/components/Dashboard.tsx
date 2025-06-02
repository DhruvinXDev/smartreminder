
import React from 'react';
import { Plus, Calendar, Clock, CheckCircle, AlertTriangle, List, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Reminder } from '@/hooks/useReminders';

interface DashboardProps {
  reminders: Reminder[];
  onCreateReminder: () => void;
  onViewChange: (view: 'list' | 'calendar' | 'stats') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reminders,
  onCreateReminder,
  onViewChange,
}) => {
  const now = new Date();
  const upcomingReminders = reminders.filter(reminder => {
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    return reminderDate > now && !reminder.completed;
  });

  const overdueReminders = reminders.filter(reminder => {
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    return reminderDate <= now && !reminder.completed;
  });

  const completedReminders = reminders.filter(reminder => reminder.completed);

  const todayReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.date);
    const today = new Date();
    return reminderDate.toDateString() === today.toDateString() && !reminder.completed;
  });

  const quickActions = [
    {
      title: 'View All Reminders',
      description: 'See all your reminders in a detailed list',
      icon: List,
      action: () => onViewChange('list'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Calendar View',
      description: 'View reminders in calendar format',
      icon: Calendar,
      action: () => onViewChange('calendar'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Statistics',
      description: 'View your reminder statistics and insights',
      icon: BarChart3,
      action: () => onViewChange('stats'),
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to SmartReminder
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personalized companion for managing reminders with smart email notifications and beautiful insights.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Upcoming
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {upcomingReminders.length}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              reminders scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Overdue
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {overdueReminders.length}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              need attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {completedReminders.length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              tasks finished
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {todayReminders.length}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              due today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get started with these common tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover-scale transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                onClick={action.action}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Reminder CTA */}
      <div className="text-center space-y-4">
        <Card className="max-w-md mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-xl">Ready to get organized?</CardTitle>
            <CardDescription className="text-blue-100">
              Create your first reminder and never forget important tasks again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onCreateReminder}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
