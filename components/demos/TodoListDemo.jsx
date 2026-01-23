'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function TodoListDemo() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Design new landing page', completed: false, priority: 'high' },
    { id: 2, text: 'Review pull requests', completed: true, priority: 'medium' },
    { id: 3, text: 'Update documentation', completed: false, priority: 'low' },
    { id: 4, text: 'Team standup meeting', completed: true, priority: 'high' },
    { id: 5, text: 'Code review session', completed: false, priority: 'medium' },
  ]);
  const [newTodo, setNewTodo] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: priorityFilter === 'all' ? 'medium' : priorityFilter,
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const priorityColors = {
    high: '#fa709a',
    medium: '#667eea',
    low: '#43e97b',
  };

  return (
    <>
      <h2 className="demo-title">Todo List</h2>
      <p className="demo-subtitle">Task management with animations, filtering, and priority levels</p>
      <div className="demo-area">
        <motion.div
          style={{
            width: '100%',
            maxWidth: 500,
            background: 'rgba(20, 20, 30, 0.8)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 30,
            backdropFilter: 'blur(10px)',
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Animated background */}
          <motion.div
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              filter: 'blur(80px)',
              opacity: 0.2,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Header */}
          <div style={{ position: 'relative', zIndex: 1, marginBottom: 25 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 5, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              My Tasks
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              {todos.filter(t => t.completed).length} of {todos.length} completed
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ position: 'relative', zIndex: 1, marginBottom: 25 }}>
            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: 4,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(todos.filter(t => t.completed).length / todos.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Add Todo Input */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 10, marginBottom: 25 }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <motion.button
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
            >
              Add
            </motion.button>
          </div>

          {/* Filter Buttons */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['all', 'active', 'completed'].map(f => (
              <motion.button
                key={f}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  background: filter === f ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)',
                  border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
              >
                {f}
              </motion.button>
            ))}
          </div>

          {/* Todo List */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <AnimatePresence>
              {filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 15,
                    borderRadius: 12,
                    background: todo.completed ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${todo.completed ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                    marginBottom: 10,
                  }}
                >
                  {/* Priority Indicator */}
                  <motion.div
                    style={{
                      width: 4,
                      height: 40,
                      borderRadius: 2,
                      background: priorityColors[todo.priority],
                    }}
                    layoutId={`priority-${todo.id}`}
                  />

                  {/* Checkbox */}
                  <motion.button
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: todo.completed ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 'rgba(255,255,255,0.05)',
                      border: todo.completed ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ color: '#fff', fontSize: '0.9rem' }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Todo Text */}
                  <div style={{ flex: 1 }}>
                    <motion.div
                      style={{
                        fontSize: '0.95rem',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#888' : '#fff',
                      }}
                      animate={{ opacity: todo.completed ? 0.5 : 1 }}
                    >
                      {todo.text}
                    </motion.div>
                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'capitalize', marginTop: 2 }}>
                      {todo.priority} priority
                    </div>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fa709a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(250, 112, 154, 0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    🗑
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
