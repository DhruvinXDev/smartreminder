import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Reminder } from '@/hooks/useReminders';

interface CalendarViewProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ reminders, onEdit, onDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const header = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center py-2">
        <div className="flex text-gray-500">
          <ChevronLeft
            className="w-5 h-5 cursor-pointer hover:text-gray-700"
            onClick={() => {
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, currentMonth.getDate()));
            }}
          />
        </div>
        <div className="flex text-gray-700 font-semibold">
          {format(currentMonth, dateFormat)}
        </div>
        <div className="flex text-gray-500">
          <ChevronRight
            className="w-5 h-5 cursor-pointer hover:text-gray-700"
            onClick={() => {
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, currentMonth.getDate()));
            }}
          />
        </div>
      </div>
    );
  };

  const days = () => {
    const dateFormat = "EEE";
    const daysInWeek = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    }).slice(0, 7);
  
    return (
      <div className="grid grid-cols-7 gap-2 py-2">
        {daysInWeek.map((day) => (
          <div key={day.toString()} className="flex text-center text-gray-500">
            {format(day, dateFormat)}
          </div>
        ))}
      </div>
    );
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const dayReminders = reminders.filter(reminder => {
            const reminderDate = new Date(reminder.date);
            return isSameDay(reminderDate, day);
          });
          return (
            <div
              key={day.toString()}
              className={`flex flex-col h-24 p-2 border rounded-md ${
                !isSameMonth(day, currentMonth)
                  ? "bg-gray-100"
                  : isToday(day)
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <span className={`text-sm ${isToday(day) ? 'font-semibold text-blue-800' : 'text-gray-700'}`}>
                {format(day, "d")}
              </span>
              {dayReminders.map(reminder => (
                <div key={reminder.id} className="mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{reminder.title}</span>
                    <div className="space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => onEdit(reminder)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(reminder.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div>{header()}</div>
        <div>{days()}</div>
        <div>{cells()}</div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
