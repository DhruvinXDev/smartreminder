import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reminder } from '@/hooks/useReminders';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, CheckCircle, Clock, TrendingUp, Target, Award } from 'lucide-react';

interface StatsPanelProps {
  reminders: Reminder[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ reminders }) => {
  // Calculate statistics
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(r => r.completed).length;
  const pendingReminders = reminders.filter(r => !r.completed).length;
  const overdueReminders = reminders.filter(r => {
    const reminderDate = new Date(`${r.date}T${r.time}`);
    return reminderDate < new Date() && !r.completed;
  }).length;

  const completionRate = totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;

  // Priority distribution
  const priorityStats = [
    {
      name: 'High',
      value: reminders.filter(r => r.priority === 'high').length,
      color: '#ef4444'
    },
    {
      name: 'Medium',
      value: reminders.filter(r => r.priority === 'medium').length,
      color: '#f59e0b'
    },
    {
      name: 'Low',
      value: reminders.filter(r => r.priority === 'low').length,
      color: '#10b981'
    }
  ];

  // Monthly activity (last 6 months)
  const getMonthlyActivity = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      const monthReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.created_at);
        return reminderDate.getFullYear() === date.getFullYear() && 
               reminderDate.getMonth() === date.getMonth();
      });

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        created: monthReminders.length,
        completed: monthReminders.filter(r => r.completed).length
      });
    }
    
    return months;
  };

  const monthlyActivity = getMonthlyActivity();

  // Completion status for pie chart
  const statusData = [
    { name: 'Completed', value: completedReminders, color: '#10b981' },
    { name: 'Pending', value: pendingReminders, color: '#3b82f6' },
    { name: 'Overdue', value: overdueReminders, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statistics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Insights and analytics for your reminder activity
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Reminders
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalReminders}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              All time reminders created
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
              {completedReminders}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {pendingReminders}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover-scale transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {completionRate}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Overall success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all your reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data to display
              </div>
            )}
            
            {statusData.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of reminders by priority level
            </CardDescription>
          </CardHeader>
          <CardContent>
            {priorityStats.some(p => p.value > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {priorityStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Activity
          </CardTitle>
          <CardDescription>
            Reminder creation and completion trends over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyActivity.some(m => m.created > 0 || m.completed > 0) ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="created" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Created"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No activity data to display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle>📊 Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🎯 Productivity Score
              </h4>
              <div className="text-2xl font-bold text-blue-600">
                {completionRate}/100
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completionRate >= 80 
                  ? "Excellent! You're very productive!" 
                  : completionRate >= 60 
                  ? "Good work! Keep improving!" 
                  : "Room for improvement. You've got this!"
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                ⚡ Most Used Priority
              </h4>
              <div className="text-lg font-bold">
                {priorityStats.length > 0 && 
                  priorityStats.reduce((max, current) => 
                    current.value > max.value ? current : max
                  ).name
                } Priority
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You tend to create more {priorityStats.length > 0 && 
                  priorityStats.reduce((max, current) => 
                    current.value > max.value ? current : max
                  ).name.toLowerCase()
                } priority reminders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
