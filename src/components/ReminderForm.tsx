
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Reminder } from '@/pages/Index';

interface ReminderFormProps {
  reminder?: Reminder | null;
  onSubmit: (data: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => void;
  onClose: () => void;
  darkMode: boolean;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  reminder,
  onSubmit,
  onClose,
  darkMode,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    note: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
        note: reminder.note,
        priority: reminder.priority,
      });
    }
  }, [reminder]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (formData.note.length > 500) {
      newErrors.note = 'Note cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {reminder ? 'Edit Reminder' : 'Create New Reminder'}
            </CardTitle>
            <CardDescription>
              {reminder ? 'Update your reminder details' : 'Set up a new reminder with smart notifications'}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover-scale"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter reminder title..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  handleInputChange('priority', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="flex items-center justify-between">
                <span>Detailed Note (Optional)</span>
                <span className="text-sm text-gray-500">
                  {formData.note.length}/500
                </span>
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Add detailed notes about this reminder..."
                rows={4}
                className={`resize-none ${errors.note ? 'border-red-500' : ''}`}
                maxLength={500}
              />
              {errors.note && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.note}
                </p>
              )}
              <p className="text-sm text-gray-500">
                This note will be included in your email notifications.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {reminder ? 'Update Reminder' : 'Create Reminder'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
