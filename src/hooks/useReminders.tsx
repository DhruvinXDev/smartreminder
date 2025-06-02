
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Use the database type directly
export type Reminder = Database['public']['Tables']['reminders']['Row'];

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReminders = async () => {
    if (!user) {
      setReminders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reminders:', error);
        toast({
          title: "Error",
          description: "Failed to load reminders",
          variant: "destructive",
        });
      } else {
        setReminders(data || []);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  const addReminder = async (reminderData: Omit<Reminder, 'id' | 'completed' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([
          {
            ...reminderData,
            user_id: user.id,
            completed: false,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding reminder:', error);
        toast({
          title: "Error",
          description: "Failed to create reminder",
          variant: "destructive",
        });
        return { error };
      }

      setReminders(prev => [data, ...prev]);
      toast({
        title: "Reminder Created",
        description: "Your reminder has been successfully created!",
      });
      return { data };
    } catch (error) {
      console.error('Error adding reminder:', error);
      return { error };
    }
  };

  const updateReminder = async (id: string, updates: Partial<Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reminder:', error);
        toast({
          title: "Error",
          description: "Failed to update reminder",
          variant: "destructive",
        });
        return { error };
      }

      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      ));
      toast({
        title: "Reminder Updated",
        description: "Your reminder has been successfully updated!",
      });
      return { data };
    } catch (error) {
      console.error('Error updating reminder:', error);
      return { error };
    }
  };

  const deleteReminder = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting reminder:', error);
        toast({
          title: "Error",
          description: "Failed to delete reminder",
          variant: "destructive",
        });
        return { error };
      }

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      toast({
        title: "Reminder Deleted",
        description: "Your reminder has been successfully deleted!",
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return { error };
    }
  };

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    refetch: fetchReminders,
  };
};
