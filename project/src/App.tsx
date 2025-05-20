import React from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategorySlider from './components/CategorySlider';
import StreamingData from './components/StreamingData';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center">
            <div className="flex items-center text-blue-600 mr-3">
              <ListTodo size={28} />
              <Clock size={28} className="-ml-2" />
              <CheckCircle2 size={28} className="-ml-2" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management App</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategorySlider />
              <TaskList />
              <StreamingData />
            </div>
            <div>
              <TaskForm />
            </div>
          </div>
        </main>
        
        <footer className="bg-white shadow-sm mt-8 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Task Management App © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </TaskProvider>
  );
}

export default App;