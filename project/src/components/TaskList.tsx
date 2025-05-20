import React, { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { TaskCategory } from '../types';
import { Loader } from 'lucide-react';

const TaskList: React.FC = () => {
  const { tasks, loading, error, fetchTasks, selectedCategory } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(task => task.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">{selectedCategory} Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks in this category.</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;