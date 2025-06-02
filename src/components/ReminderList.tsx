
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Reminder } from '@/pages/Index';
import { Edit, Trash2, Check, Clock, Search, Filter, Calendar } from 'lucide-react';

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, updates: Partial<Reminder>) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredAndSortedReminders = reminders
    .filter(reminder => {
      const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reminder.note.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && reminder.completed) ||
                           (filterStatus === 'pending' && !reminder.completed);
      
      const matchesPriority = filterPriority === 'all' || reminder.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (reminder: Reminder) => {
    if (reminder.completed) return 'bg-green-100 text-green-800 border-green-200';
    
    const now = new Date();
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    
    if (reminderDate < now) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusText = (reminder: Reminder) => {
    if (reminder.completed) return 'Completed';
    
    const now = new Date();
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    
    if (reminderDate < now) return 'Overdue';
    return 'Pending';
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Reminders
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track all your reminders in one place
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredAndSortedReminders.length} of {reminders.length} reminders
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Cards */}
      <div className="space-y-4">
        {filteredAndSortedReminders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No reminders found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'Create your first reminder to get started!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedReminders.map((reminder) => {
            const { date, time } = formatDateTime(reminder.date, reminder.time);
            
            return (
              <Card
                key={reminder.id}
                className={`hover-scale transition-all duration-200 ${
                  reminder.completed ? 'opacity-75' : ''
                } ${
                  reminder.completed 
                    ? 'bg-green-50/50 dark:bg-green-900/10' 
                    : 'bg-white/50 dark:bg-gray-800/50'
                } backdrop-blur-sm`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className={`text-lg ${
                          reminder.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {reminder.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(reminder.priority)}>
                            {reminder.priority}
                          </Badge>
                          <Badge className={getStatusColor(reminder)}>
                            {getStatusText(reminder)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleComplete(reminder.id, { completed: !reminder.completed })}
                        className={`hover-scale ${
                          reminder.completed 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
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
                </CardHeader>

                {reminder.note && (
                  <CardContent className="pt-0">
                    <div className={`text-sm ${
                      reminder.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                    } bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3`}>
                      {reminder.note}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
