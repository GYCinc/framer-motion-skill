'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function AlarmClockDemo() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [alarms, setAlarms] = React.useState([
    { id: 1, time: '07:00', label: 'Morning Workout', enabled: true, days: ['Mon', 'Wed', 'Fri'] },
    { id: 2, time: '08:30', label: 'Team Standup', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 3, time: '22:00', label: 'Bedtime Reminder', enabled: false, days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] },
  ]);
  const [newAlarmTime, setNewAlarmTime] = React.useState('12:00');
  const [newAlarmLabel, setNewAlarmLabel] = React.useState('');
  const [showAddAlarm, setShowAddAlarm] = React.useState(false);
  const [ringingAlarm, setRingingAlarm] = React.useState(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check if any alarm should ring
      const currentTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTimeStr && !ringingAlarm) {
          setRingingAlarm(alarm);
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, ringingAlarm]);

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(alarm =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const addAlarm = () => {
    if (newAlarmLabel.trim()) {
      setAlarms(prev => [...prev, {
        id: Date.now(),
        time: newAlarmTime,
        label: newAlarmLabel,
        enabled: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      }]);
      setNewAlarmTime('12:00');
      setNewAlarmLabel('');
      setShowAddAlarm(false);
    }
  };

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const dismissAlarm = () => {
    setRingingAlarm(null);
  };

  const snoozeAlarm = () => {
    setRingingAlarm(null);
    // In a real app, this would snooze for 5-10 minutes
  };

  return (
    <>
      <h2 className="demo-title">Alarm Clock</h2>
      <p className="demo-subtitle">Alarm manager with time picker, toggle switch, and repeating days selection.</p>
      <div className="demo-area" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        style={{
          width: 900,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 30,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Clock Display */}
        <motion.div
          style={{
            padding: 40,
            background: 'rgba(20, 20, 30, 0.8)',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Circular Clock */}
          <motion.div
            style={{
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
              border: '4px solid rgba(102, 126, 234, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 30,
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(102, 126, 234, 0.3)',
                '0 0 50px rgba(102, 126, 234, 0.5)',
                '0 0 30px rgba(102, 126, 234, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div style={{
              fontSize: '4rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'SF Mono, Monaco, monospace',
              lineHeight: 1,
            }}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div style={{
              fontSize: '1.2rem',
              color: '#888',
              marginTop: 10,
            }}>
              {currentTime.toLocaleTimeString('en-US', { second: '2-digit', hour12: false })}
            </div>
          </motion.div>

          {/* Add Alarm Button */}
          <motion.button
            style={{
              padding: '15px 40px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddAlarm(!showAddAlarm)}
          >
            {showAddAlarm ? 'Cancel' : '+ Add Alarm'}
          </motion.button>

          {/* Add Alarm Form */}
          <AnimatePresence>
            {showAddAlarm && (
              <motion.div
                style={{
                  marginTop: 25,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 15,
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Alarm label..."
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <motion.button
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #43e97b, #00f2fe)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAlarm}
                >
                  Save Alarm
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Alarms List */}
        <motion.div
          style={{
            padding: 40,
            background: 'rgba(20, 20, 30, 0.8)',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 25,
            background: 'linear-gradient(135deg, #f093fb, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            My Alarms
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {alarms.map((alarm, i) => (
              <motion.div
                key={alarm.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: alarm.enabled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: alarm.enabled ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                  opacity: alarm.enabled ? 1 : 0.5,
                }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: alarm.enabled ? 1 : 0.5 }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    {/* Time */}
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: alarm.enabled ? '#667eea' : '#666',
                      fontFamily: 'SF Mono, Monaco, monospace',
                    }}>
                      {alarm.time}
                    </div>

                    {/* Label & Days */}
                    <div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: alarm.enabled ? '#fff' : '#666',
                        marginBottom: 4,
                      }}>
                        {alarm.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        {alarm.days.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Toggle Switch */}
                    <motion.button
                      style={{
                        width: 50,
                        height: 28,
                        borderRadius: 14,
                        background: alarm.enabled ? '#667eea' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAlarm(alarm.id)}
                    >
                      <motion.div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: 3,
                          left: alarm.enabled ? 27 : 3,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'rgba(250, 112, 154, 0.1)',
                        border: '1px solid rgba(250, 112, 154, 0.3)',
                        color: '#fa709a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                      whileHover={{ scale: 1.1, background: 'rgba(250, 112, 154, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteAlarm(alarm.id)}
                    >
                      ×
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Ringing Alarm Overlay */}
      <AnimatePresence>
        {ringingAlarm && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 30,
              zIndex: 1000,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                fontSize: '6rem',
                animation: 'ring 0.5s ease-in-out infinite',
              }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⏰
            </motion.div>

            <motion.div
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#667eea',
                textAlign: 'center',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {ringingAlarm.time}
            </motion.div>

            <div style={{ fontSize: '1.5rem', color: '#fff' }}>{ringingAlarm.label}</div>

            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
              <motion.button
                style={{
                  padding: '15px 40px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #43e97b, #00f2fe)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissAlarm}
              >
                Dismiss
              </motion.button>

              <motion.button
                style={{
                  padding: '15px 40px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={snoozeAlarm}
              >
                Snooze (5m)
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
