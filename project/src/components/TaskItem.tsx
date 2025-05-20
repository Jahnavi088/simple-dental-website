import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { Clock, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: TaskCategory) => {
    let timeoutAt = task.timeoutAt;
    
    // If moving to In Progress, set timeout
    if (category === TaskCategory.IN_PROGRESS && task.category !== TaskCategory.IN_PROGRESS) {
      const now = new Date();
      const timeoutDate = new Date(now.getTime() + task.duration * 1000);
      timeoutAt = timeoutDate.toISOString();
    }
    
    // If moving out of In Progress, clear timeout
    if (task.category === TaskCategory.IN_PROGRESS && category !== TaskCategory.IN_PROGRESS) {
      timeoutAt = undefined;
    }
    
    updateTask(task.id, { category, timeoutAt });
  };

  const getTimeRemaining = () => {
    if (!task.timeoutAt) return null;
    
    const now = new Date();
    const timeout = new Date(task.timeoutAt);
    const diff = timeout.getTime() - now.getTime();
    
    if (diff <= 0) return "Timed out";
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s remaining`;
  };

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.TODO:
        return "bg-gray-100 text-gray-800";
      case TaskCategory.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TaskCategory.DONE:
        return "bg-green-100 text-green-800";
      case TaskCategory.TIMEOUT:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
          <input
            type="number"
            name="duration"
            value={editedTask.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-500 focus:outline-none"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
          {task.category}
        </span>
        
        {task.category === TaskCategory.IN_PROGRESS && task.timeoutAt && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <Clock size={12} className="mr-1" />
            {getTimeRemaining()}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {task.category !== TaskCategory.TODO && (
          <button
            onClick={() => handleCategoryChange(TaskCategory.TODO)}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Move to To Do
          </button>
        )}
        
        {task.category !== TaskCategory.IN_PROGRESS && (
          <button
            onClick={() => handleCategoryChange(TaskCategory.IN_PROGRESS)}
            className="px-3 py-1 text-xs bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 focus:outline-none"
          >
            Move to In Progress
          </button>
        )}
        
        {task.category !== TaskCategory.DONE && (
          <button
            onClick={() => handleCategoryChange(TaskCategory.DONE)}
            className="px-3 py-1 text-xs bg-green-200 text-green-800 rounded-md hover:bg-green-300 focus:outline-none flex items-center"
          >
            <CheckCircle size={12} className="mr-1" />
            Mark as Done
          </button>
        )}
        
        {task.category !== TaskCategory.TIMEOUT && (
          <button
            onClick={() => handleCategoryChange(TaskCategory.TIMEOUT)}
            className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded-md hover:bg-red-300 focus:outline-none flex items-center"
          >
            <AlertCircle size={12} className="mr-1" />
            Mark as Timeout
          </button>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
        <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TaskItem;