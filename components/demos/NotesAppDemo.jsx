'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function NotesAppDemo() {
  const [notes, setNotes] = React.useState([
    { id: 1, title: 'Project Ideas', content: 'Build a real-time collaboration tool with React and WebSockets...', category: 'work', color: '#667eea', date: '2024-01-15' },
    { id: 2, title: 'Shopping List', content: 'Groceries: Milk, Eggs, Bread, Coffee...', category: 'personal', color: '#f093fb', date: '2024-01-14' },
    { id: 3, title: 'Meeting Notes', content: 'Discussed Q1 roadmap and feature priorities...', category: 'work', color: '#4facfe', date: '2024-01-13' },
    { id: 4, title: 'Book Recommendations', content: '1. Atomic Habits 2. Deep Work 3. The Pragmatic Programmer...', category: 'personal', color: '#43e97b', date: '2024-01-12' },
  ]);
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2 className="demo-title">Notes App</h2>
      <p className="demo-subtitle">Organize thoughts with searchable notes, categories, and smooth animations</p>
      <div className="demo-area">
        <div style={{ display: 'flex', gap: 30 }}>
          {/* Notes List */}
          <motion.div
            style={{
              width: 380,
            }}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Search Bar */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 14,
                  background: 'rgba(20, 20, 30, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Create Button */}
            <motion.button
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreating(true)}
            >
              <span style={{ fontSize: '1.2rem' }}>+</span> Create New Note
            </motion.button>

            {/* Notes Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <AnimatePresence>
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      background: 'rgba(20, 20, 30, 0.8)',
                      border: `1px solid ${note.color}30`,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    whileHover={{ scale: 1.02, borderColor: `${note.color}60` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNote(note)}
                  >
                    {/* Color accent */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 4,
                        height: '100%',
                        background: note.color,
                      }}
                    />

                    <div style={{ marginLeft: 10 }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, color: note.color }}>{note.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {note.content}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#666' }}>
                        <span style={{ textTransform: 'capitalize' }}>{note.category}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Note Detail / Create */}
          <motion.div
            style={{
              flex: 1,
              maxWidth: 500,
              background: 'rgba(20, 20, 30, 0.8)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 30,
              backdropFilter: 'blur(10px)',
              minHeight: 500,
            }}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
          >
            {selectedNote ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedNote.color }} />
                    <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'capitalize' }}>{selectedNote.category}</span>
                  </div>

                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: 20,
                    background: `linear-gradient(135deg, ${selectedNote.color}, #fff)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {selectedNote.title}
                  </h3>

                  <div style={{
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#ccc',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {selectedNote.content}
                  </div>

                  <div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
                    {['Edit', 'Share', 'Delete'].map((action, i) => (
                      <motion.button
                        key={action}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 20,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            ) : isCreating ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 20 }}>Create Note</h3>
                <input
                  type="text"
                  placeholder="Note title..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem',
                    marginBottom: 15,
                    outline: 'none',
                  }}
                />
                <textarea
                  placeholder="Start writing..."
                  rows={12}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    marginBottom: 20,
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                  >
                    Save Note
                  </motion.button>
                  <motion.button
                    style={{
                      padding: '12px 24px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  textAlign: 'center',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{ fontSize: '4rem', marginBottom: 20 }}>📝</div>
                <p style={{ fontSize: '1.1rem' }}>Select a note or create a new one</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
