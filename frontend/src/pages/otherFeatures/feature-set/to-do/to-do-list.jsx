import React, { useState, useEffect } from 'react';
import  "./to-do-list.css";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  // Load tasks from localStorage if available
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle task input change
  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  // Add a task to the list
  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Handle task deletion
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Clear all tasks (clear cache)
  const clearTasks = () => {
    setTasks([]);
    localStorage.removeItem('tasks');
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <div className="input-container">
        <input 
          type="text" 
          value={task} 
          onChange={handleInputChange} 
          placeholder="Add a new task..." 
          onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
        />
        <button onClick={addTask} className="clear-btn">Add</button>
        <button onClick={clearTasks} className="clear-btn" title="Clear all tasks">Clear</button>
      </div>
      <ul className="task-list">
        {tasks.map((taskItem, index) => (
          <li 
            key={index} 
            className={`task${taskItem.completed ? ' completed' : ''}`} 
            onClick={() => toggleTaskCompletion(index)}
          >
            <div className={`circle ${taskItem.completed ? 'completed' : ''}`} />
            <span>{taskItem.text}</span>
            <button
              onClick={e => { e.stopPropagation(); deleteTask(index); }}
              className="delete-btn"
              title="Delete"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;