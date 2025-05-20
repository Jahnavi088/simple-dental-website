import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskCategory } from '../types';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const CategorySlider: React.FC = () => {
  const { selectedCategory, setSelectedCategory, tasks } = useTaskContext();

  const categories = Object.values(TaskCategory);
  
  const getCategoryCount = (category: TaskCategory) => {
    return tasks.filter(task => task.category === category).length;
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.TODO:
        return <ListTodo size={18} />;
      case TaskCategory.IN_PROGRESS:
        return <Clock size={18} />;
      case TaskCategory.DONE:
        return <CheckCircle size={18} />;
      case TaskCategory.TIMEOUT:
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: TaskCategory) => {
    if (category === selectedCategory) {
      switch (category) {
        case TaskCategory.TODO:
          return "bg-gray-700 text-white";
        case TaskCategory.IN_PROGRESS:
          return "bg-blue-600 text-white";
        case TaskCategory.DONE:
          return "bg-green-600 text-white";
        case TaskCategory.TIMEOUT:
          return "bg-red-600 text-white";
        default:
          return "bg-gray-700 text-white";
      }
    } else {
      switch (category) {
        case TaskCategory.TODO:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        case TaskCategory.IN_PROGRESS:
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case TaskCategory.DONE:
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case TaskCategory.TIMEOUT:
          return "bg-red-100 text-red-800 hover:bg-red-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Task Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${getCategoryColor(category)}`}
          >
            <span className="mr-2">{getCategoryIcon(category)}</span>
            {category}
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;