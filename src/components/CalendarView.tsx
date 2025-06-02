
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reminder } from '@/pages/Index';
import { ChevronLeft, ChevronRight, Calendar, Clock, Edit, Trash2 } from 'lucide-react';

interface CalendarViewProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  reminders,
  onEdit,
  onDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getRemindersForDate = (date: Date | null) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return reminders.filter(reminder => reminder.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar View
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View your reminders in a monthly calendar format
          </p>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigateMonth('prev')}
              className="hover-scale"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="ghost"
              onClick={() => navigateMonth('next')}
              className="hover-scale"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {daysOfWeek.map(day => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const dayReminders = getRemindersForDate(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border rounded-lg transition-all duration-200 hover:shadow-md ${
                    date
                      ? isToday(date)
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                      : 'border-transparent'
                  }`}
                >
                  {date && (
                    <>
                      {/* Date number */}
                      <div className={`text-sm font-semibold mb-2 ${
                        isToday(date)
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {date.getDate()}
                      </div>

                      {/* Reminders for this date */}
                      <div className="space-y-1">
                        {dayReminders.slice(0, 3).map(reminder => (
                          <div
                            key={reminder.id}
                            className={`text-xs p-1 rounded cursor-pointer hover-scale transition-all duration-200 ${
                              reminder.completed
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 opacity-75'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md'
                            }`}
                            onClick={() => onEdit(reminder)}
                          >
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority)}`}></div>
                              <span className="truncate flex-1">{reminder.title}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
                              <Clock className="w-2 h-2" />
                              <span>{reminder.time}</span>
                            </div>
                          </div>
                        ))}
                        
                        {dayReminders.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                            +{dayReminders.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Reminders */}
      {(() => {
        const today = new Date();
        const todayReminders = getRemindersForDate(today);
        
        if (todayReminders.length > 0) {
          return (
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayReminders.map(reminder => (
                    <div
                      key={reminder.id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover-scale ${
                        reminder.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 opacity-75'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${
                              reminder.completed ? 'line-through text-gray-500' : ''
                            }`}>
                              {reminder.title}
                            </h3>
                            <Badge className={`text-xs ${
                              reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                              reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {reminder.priority}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <Clock className="w-4 h-4" />
                            {reminder.time}
                          </div>
                          
                          {reminder.note && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              {reminder.note}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(reminder)}
                            className="text-blue-600 hover:text-blue-700 hover-scale"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(reminder.id)}
                            className="text-red-600 hover:text-red-700 hover-scale"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}
    </div>
  );
};
