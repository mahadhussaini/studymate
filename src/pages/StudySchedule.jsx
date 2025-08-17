import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Bell,
  Target,
  BookOpen,
  Brain,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Repeat,
  Star,
  Zap
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import toast from 'react-hot-toast';


const StudySchedule = () => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'medium',
    duration: 30,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '09:00',
    type: 'study',
    relatedMaterials: []
  });

  const [reminderForm, setReminderForm] = useState({
    title: '',
    message: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    repeat: 'none'
  });

  // Get week days for calendar
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get tasks for selected date
  const getTasksForDate = (date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  // Get reminders for selected date
  const getRemindersForDate = (date) => {
    return reminders.filter(reminder => isSameDay(new Date(reminder.date), date));
  };

  // Add new task
  const handleAddTask = () => {
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title.');
      return;
    }

    const newTask = {
      id: Date.now(),
      ...taskForm,
      status: 'pending',
      createdAt: new Date(),
      completedAt: null
    };

    setTasks(prev => [...prev, newTask]);
    setTaskForm({
      title: '',
      description: '',
      subject: '',
      priority: 'medium',
      duration: 30,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      dueTime: '09:00',
      type: 'study',
      relatedMaterials: []
    });
    setShowAddTask(false);
    toast.success('Task added successfully!');
  };

  // Add new reminder
  const handleAddReminder = () => {
    if (!reminderForm.title.trim()) {
      toast.error('Please enter a reminder title.');
      return;
    }

    const newReminder = {
      id: Date.now(),
      ...reminderForm,
      status: 'active',
      createdAt: new Date()
    };

    setReminders(prev => [...prev, newReminder]);
    setReminderForm({
      title: '',
      message: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      repeat: 'none'
    });
    setShowAddReminder(false);
    toast.success('Reminder added successfully!');
  };

  // Toggle task completion
  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed',
          completedAt: task.status === 'completed' ? null : new Date()
        };
      }
      return task;
    }));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully!');
  };

  // Delete reminder
  const deleteReminder = (reminderId) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    toast.success('Reminder deleted successfully!');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  // Get task type icon
  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'review': return <Brain className="w-4 h-4" />;
      case 'exam': return <Target className="w-4 h-4" />;
      case 'assignment': return <Edit className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Navigation
  const goToPreviousWeek = () => {
    setCurrentDate(prev => subDays(prev, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Study Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan your study sessions and set reminders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddReminder(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h2>
            
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="btn-secondary text-sm"
          >
            Today
          </button>
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const dayReminders = getRemindersForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            
            return (
              <motion.button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  isSelected 
                    ? 'bg-primary-500 text-white' 
                    : isCurrentDay
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-bold mb-2 ${
                  isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Task indicators */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`w-full h-1 rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-400' 
                          : task.priority === 'high'
                          ? 'bg-red-400'
                          : 'bg-blue-400'
                      }`}
                    />
                  ))}
                  {dayReminders.length > 0 && (
                    <div className="w-full h-1 bg-yellow-400 rounded-full" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks for Selected Date */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks for {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getTasksForDate(selectedDate).length} tasks
            </span>
          </div>
          
          <div className="space-y-3">
            {getTasksForDate(selectedDate).map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${
                  task.status === 'completed'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {task.status === 'completed' && <Check className="w-3 h-3" />}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        task.status === 'completed'
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.duration} min
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {getTasksForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks scheduled for this date
              </div>
            )}
          </div>
        </div>

        {/* Reminders for Selected Date */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reminders for {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getRemindersForDate(selectedDate).length} reminders
            </span>
          </div>
          
          <div className="space-y-3">
            {getRemindersForDate(selectedDate).map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-1" />
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {reminder.title}
                      </h4>
                      {reminder.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {reminder.message}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {reminder.time}
                        </span>
                        {reminder.repeat !== 'none' && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {reminder.repeat}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {getRemindersForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No reminders for this date
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Tasks List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Tasks
          </h3>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
                placeholder="Search tasks..."
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                task.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="w-3 h-3" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTaskTypeIcon(task.type)}
                      <h4 className={`font-medium ${
                        task.status === 'completed'
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h4>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {format(new Date(task.dueDate), 'MMM d')} at {task.dueTime}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {task.duration} min
                      </span>
                      {task.subject && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {task.subject}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tasks found
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Task
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="input-field h-20 resize-none"
                    placeholder="Enter task description..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={taskForm.subject}
                      onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Math, Science..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Time
                    </label>
                    <input
                      type="time"
                      value={taskForm.dueTime}
                      onChange={(e) => setTaskForm({ ...taskForm, dueTime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={taskForm.duration}
                      onChange={(e) => setTaskForm({ ...taskForm, duration: parseInt(e.target.value) })}
                      className="input-field"
                      min="15"
                      step="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={taskForm.type}
                      onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
                      className="input-field"
                    >
                      <option value="study">Study</option>
                      <option value="review">Review</option>
                      <option value="exam">Exam</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="btn-primary"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAddReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddReminder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Reminder
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter reminder title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={reminderForm.message}
                    onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                    className="input-field h-20 resize-none"
                    placeholder="Enter reminder message..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={reminderForm.date}
                      onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={reminderForm.time}
                      onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repeat
                  </label>
                  <select
                    value={reminderForm.repeat}
                    onChange={(e) => setReminderForm({ ...reminderForm, repeat: e.target.value })}
                    className="input-field"
                  >
                    <option value="none">No Repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="btn-primary"
                >
                  Add Reminder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudySchedule;