'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function FitnessTrackerDemo() {
  const [workouts, setWorkouts] = React.useState([
    { id: 1, type: 'Running', duration: 30, calories: 320, date: 'Today', icon: '🏃', intensity: 85 },
    { id: 2, type: 'Weight Training', duration: 45, calories: 280, date: 'Yesterday', icon: '🏋️', intensity: 92 },
    { id: 3, type: 'Yoga', duration: 60, calories: 180, date: '2 days ago', icon: '🧘', intensity: 45 },
    { id: 4, type: 'Cycling', duration: 40, calories: 350, date: '3 days ago', icon: '🚴', intensity: 78 },
  ]);

  const [streak, setStreak] = React.useState(7);
  const [weeklyGoal, setWeeklyGoal] = React.useState(5);
  const [hoveredWorkout, setHoveredWorkout] = React.useState(null);
  const weeklyProgress = workouts.filter(w => w.date === 'Today' || w.date === 'Yesterday').length;
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  const progressData = [65, 80, 45, 90, 70, 85, 60];
  const maxProgress = Math.max(...progressData);

  // Animated counter hook
  const AnimatedNumber = ({ value, duration = 1.5 }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    React.useEffect(() => {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }, [value]);
    return displayValue;
  };

  return (
    <>
      <h2 className="demo-title">Fitness Tracker</h2>
      <p className="demo-subtitle">Track workouts, calories, streaks, and weekly progress with animated stats and charts.</p>
      <div className="demo-area" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
        {/* Ambient glow background */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: '100%', maxWidth: 1200, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, position: 'relative', zIndex: 1 }}
        >
        {/* Streak Card - Premium */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -5 }}
          style={{
            padding: 28,
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(239, 68, 68, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(251, 146, 60, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(251, 146, 60, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <motion.div
            style={{ position: 'absolute', right: -30, top: -30, fontSize: '10rem', opacity: 0.08, filter: 'blur(2px)' }}
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >🔥</motion.div>
          <motion.div
            style={{ fontSize: '2.8rem', marginBottom: 8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >🔥</motion.div>
          <motion.div
            style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, #fb923c, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}
          >
            <AnimatedNumber value={streak} />
          </motion.div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.5px' }}>Day Streak</div>
          <motion.div
            style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ delay: 0.5, duration: 1.2 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #fb923c, #ef4444)', borderRadius: 2 }}
            />
          </motion.div>
        </motion.div>

        {/* Calories Card - Premium */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -5 }}
          style={{
            padding: 28,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(34, 197, 94, 0.25)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <motion.div
            style={{ position: 'absolute', right: -20, bottom: -20, fontSize: '8rem', opacity: 0.06 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >⚡</motion.div>
          <motion.div
            style={{ fontSize: '2.8rem', marginBottom: 8 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >⚡</motion.div>
          <motion.div style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, #22c55e, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
            <AnimatedNumber value={totalCalories} />
          </motion.div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Calories Burned</div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>+12% vs last week</div>
        </motion.div>

        {/* Minutes Card - Premium */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -5 }}
          style={{
            padding: 28,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(139, 92, 246, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(102, 126, 234, 0.25)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <motion.div
            style={{ fontSize: '2.8rem', marginBottom: 8 }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >⏱️</motion.div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <motion.span style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <AnimatedNumber value={totalMinutes} />
            </motion.span>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>min</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Active Time</div>
        </motion.div>

        {/* Weekly Progress - Enhanced */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
          style={{
            gridColumn: 'span 2',
            padding: 28,
            background: 'rgba(15, 15, 25, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Weekly Progress</h3>
            <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.3)', fontSize: '0.8rem', color: '#667eea', fontWeight: 600 }}>
              This Week
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 140 }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const progress = progressData[i];
              const height = (progress / maxProgress) * 120;
              const isToday = i === 4;
              return (
                <motion.div
                  key={day}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                >
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 50 }}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      background: isToday
                        ? 'linear-gradient(180deg, #ec4899, #8b5cf6)'
                        : 'linear-gradient(180deg, rgba(102, 126, 234, 0.8), rgba(139, 92, 246, 0.6))',
                      boxShadow: isToday ? '0 4px 20px rgba(236, 72, 153, 0.4)' : '0 2px 10px rgba(102, 126, 234, 0.2)',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                        padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.8)',
                        fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
                      }}
                    >
                      {progress}%
                    </motion.div>
                  </motion.div>
                  <span style={{
                    fontSize: '0.8rem',
                    color: isToday ? '#ec4899' : 'rgba(255,255,255,0.5)',
                    fontWeight: isToday ? 700 : 500
                  }}>{day}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Weekly Goal Ring - Enhanced */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
          style={{
            padding: 28,
            background: 'rgba(15, 15, 25, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Weekly Goal</h3>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
            {/* Glow effect */}
            <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)', filter: 'blur(15px)' }} />
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
              <motion.circle
                cx="80" cy="80" r="65"
                fill="none"
                stroke="url(#fitnessGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={408}
                initial={{ strokeDashoffset: 408 }}
                animate={{ strokeDashoffset: 408 - (408 * weeklyProgress / weeklyGoal) }}
                transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="fitnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <motion.div
                style={{ fontSize: '2.2rem', fontWeight: 800 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                {weeklyProgress}<span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)' }}>/{weeklyGoal}</span>
              </motion.div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Workouts</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Workouts - Enhanced */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
          style={{
            gridColumn: 'span 3',
            padding: 28,
            background: 'rgba(15, 15, 25, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Workouts</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 20px', borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea, #8b5cf6)', border: 'none',
                color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
            >
              + Add Workout
            </motion.button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <AnimatePresence>
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                  onHoverStart={() => setHoveredWorkout(workout.id)}
                  onHoverEnd={() => setHoveredWorkout(null)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  style={{
                    padding: 20, borderRadius: 18,
                    background: hoveredWorkout === workout.id
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(139, 92, 246, 0.1))'
                      : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer',
                    transition: 'background 0.3s ease',
                  }}
                >
                  <motion.div
                    style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: 'linear-gradient(135deg, #667eea, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    }}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {workout.icon}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{workout.type}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                      <span>⏱️ {workout.duration}m</span>
                      <span>🔥 {workout.calories} cal</span>
                    </div>
                    <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${workout.intensity}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                        style={{ height: '100%', background: workout.intensity > 80 ? 'linear-gradient(90deg, #ef4444, #f97316)' : 'linear-gradient(90deg, #22c55e, #10b981)', borderRadius: 2 }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{workout.date}</div>
                    <div style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                      background: workout.intensity > 80 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: workout.intensity > 80 ? '#ef4444' : '#22c55e',
                    }}>
                      {workout.intensity}% intensity
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
