import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Check, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { type Reminder } from '@/hooks/useReminders';

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, updates: Partial<Reminder>) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({ reminders, onEdit, onDelete, onToggleComplete }) => {
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);

  const toggleReminder = (id: string) => {
    setExpandedReminderId(expandedReminderId === id ? null : id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-gray-900';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  return (
    <div className="space-y-4">
      {reminders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Reminders</CardTitle>
            <CardContent>
              <p>You don't have any reminders yet. Create one to get started!</p>
            </CardContent>
          </CardHeader>
        </Card>
      ) : (
        reminders.map((reminder) => (
          <Card key={reminder.id} className="border-2 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`reminder-${reminder.id}`}
                    checked={reminder.completed}
                    onCheckedChange={(checked) => {
                      onToggleComplete(reminder.id, { completed: checked || false });
                    }}
                  />
                  <label
                    htmlFor={`reminder-${reminder.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
                  >
                    {reminder.title}
                  </label>
                </div>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={`uppercase text-xs ${getPriorityColor(reminder.priority)}`}>
                  {reminder.priority}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleReminder(reminder.id)}>
                  {expandedReminderId === reminder.id ? 'Hide' : 'View'}
                </Button>
              </div>
            </CardHeader>
            {expandedReminderId === reminder.id && (
              <CardContent className="pl-4">
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date: {formatDate(reminder.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Time: {formatTime(reminder.time)}</span>
                  </div>
                  {reminder.note && (
                    <div className="flex">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Note: {reminder.note}</span>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" onClick={() => onEdit(reminder)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(reminder.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
