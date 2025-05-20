import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCategory } from '../src/types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete project setup',
    description: 'Set up the initial project structure and dependencies',
    category: TaskCategory.DONE,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    duration: 3600 // 1 hour
  },
  {
    id: uuidv4(),
    title: 'Implement task list component',
    description: 'Create a component to display all tasks with proper styling',
    category: TaskCategory.IN_PROGRESS,
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    duration: 7200, // 2 hours
    timeoutAt: new Date(Date.now() + 7200000).toISOString() // 2 hours from now
  },
  {
    id: uuidv4(),
    title: 'Add form validation',
    description: 'Implement validation for the task creation form',
    category: TaskCategory.TODO,
    createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    duration: 3600 // 1 hour
  },
  {
    id: uuidv4(),
    title: 'Fix styling issues',
    description: 'Address responsive design problems on mobile devices',
    category: TaskCategory.TIMEOUT,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    duration: 1800 // 30 minutes
  }
];

// Mock streaming data
const streamingData = [
  {
    id: '1',
    title: 'Latest Development Updates',
    description: 'New features being added to the task management system',
    url: 'https://example.com/updates'
  },
  {
    id: '2',
    title: 'Team Activity Feed',
    description: 'Recent actions by team members on various tasks',
    url: 'https://example.com/activity'
  },
  {
    id: '3',
    title: 'System Notifications',
    description: 'Important alerts about system maintenance and updates',
    url: 'https://example.com/notifications'
  }
];

// Routes
app.get('/tasks', (req, res) => {
  setTimeout(() => { // Simulate network delay
    res.json({
      success: true,
      data: tasks
    });
  }, 500);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  res.json({
    success: true,
    data: task
  });
});

app.post('/tasks', (req, res) => {
  try {
    const { title, description, category, duration } = req.body;
    
    // Validation
    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and duration are required'
      });
    }
    
    const now = new Date().toISOString();
    let timeoutAt;
    
    if (category === TaskCategory.IN_PROGRESS) {
      const timeoutDate = new Date(Date.now() + duration * 1000);
      timeoutAt = timeoutDate.toISOString();
    }
    
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      category: category || TaskCategory.TODO,
      createdAt: now,
      updatedAt: now,
      duration,
      timeoutAt
    };
    
    tasks.push(newTask);
    
    setTimeout(() => { // Simulate network delay
      res.status(201).json({
        success: true,
        data: newTask
      });
    }, 500);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.put('/tasks/:id', (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Handle timeout calculation if moving to In Progress
    if (
      req.body.category === TaskCategory.IN_PROGRESS &&
      tasks[taskIndex].category !== TaskCategory.IN_PROGRESS
    ) {
      const timeoutDate = new Date(Date.now() + updatedTask.duration * 1000);
      updatedTask.timeoutAt = timeoutDate.toISOString();
    }
    
    // Clear timeout if moving out of In Progress
    if (
      tasks[taskIndex].category === TaskCategory.IN_PROGRESS &&
      req.body.category &&
      req.body.category !== TaskCategory.IN_PROGRESS
    ) {
      updatedTask.timeoutAt = undefined;
    }
    
    tasks[taskIndex] = updatedTask;
    
    setTimeout(() => { // Simulate network delay
      res.json({
        success: true,
        data: updatedTask
      });
    }, 500);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  tasks.splice(taskIndex, 1);
  
  setTimeout(() => { // Simulate network delay
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  }, 500);
});

// Streaming data endpoint
app.get('/streaming', (req, res) => {
  // Simulate fetching from an external streaming API
  setTimeout(() => {
    res.json({
      success: true,
      data: streamingData
    });
  }, 1000);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});