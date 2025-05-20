import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Task, TaskCategory, ApiResponse } from '../types';

const API_URL = 'http://localhost:3001';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedCategory: TaskCategory;
  setSelectedCategory: (category: TaskCategory) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  streamingData: any[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(TaskCategory.TODO);
  const [streamingData, setStreamingData] = useState<any[]>([]);

  // Check for task timeouts every minute
  useEffect(() => {
    const checkTimeouts = () => {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (
          task.category === TaskCategory.IN_PROGRESS &&
          task.timeoutAt &&
          new Date(task.timeoutAt) <= now
        ) {
          return { ...task, category: TaskCategory.TIMEOUT };
        }
        return task;
      });

      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
        // Update tasks on the server
        updatedTasks.forEach(task => {
          if (task.category === TaskCategory.TIMEOUT) {
            updateTask(task.id, { category: TaskCategory.TIMEOUT });
          }
        });
      }
    };

    const intervalId = setInterval(checkTimeouts, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [tasks]);

  // Fetch streaming data
  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        const response = await axios.get<ApiResponse<any[]>>(`${API_URL}/streaming`);
        if (response.data.success) {
          setStreamingData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching streaming data:', err);
      }
    };

    fetchStreamingData();
    const intervalId = setInterval(fetchStreamingData, 300000); // Refresh every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse<Task[]>>(`${API_URL}/tasks`);
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<Task>>(`${API_URL}/tasks`, task);
      if (response.data.success) {
        setTasks(prev => [...prev, response.data.data]);
      } else {
        setError(response.data.message || 'Failed to add task');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<ApiResponse<Task>>(`${API_URL}/tasks/${id}`, task);
      if (response.data.success) {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...response.data.data } : t)));
      } else {
        setError(response.data.message || 'Failed to update task');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete<ApiResponse<void>>(`${API_URL}/tasks/${id}`);
      if (response.data.success) {
        setTasks(prev => prev.filter(t => t.id !== id));
      } else {
        setError(response.data.message || 'Failed to delete task');
      }
    } catch (err) {
      }
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        streamingData
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
  }
}