'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function TimerWidgetDemo() {
  const [seconds, setSeconds] = React.useState(300); // 5 minutes
  const [isActive, setIsActive] = React.useState(false);
  const [initialSeconds, setInitialSeconds] = React.useState(300);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  React.useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = (initialSeconds - seconds) / initialSeconds;
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (1 - progress) * circumference;

  const presetTimes = [60, 180, 300, 600, 900];

  return (
    <>
      <h2 className="demo-title">Timer Widget</h2>
      <p className="demo-subtitle">Countdown timer with circular progress animation and intuitive controls</p>
      <div className="demo-area">
        <motion.div
          style={{
            width: 380,
            background: 'rgba(20, 20, 30, 0.8)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 30,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Animated background */}
          <motion.div
            style={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Time display */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 25 }}>
            <motion.div
              key={formatTime(time)}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                fontSize: '3.5rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: 3,
              }}
            >
              {formatTime(time)}
            </motion.div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 10 }}>
              {isActive ? '⏱ Running' : time > 0 ? '⏸ Paused' : '▶ Ready'}
            </div>
          </div>

          {/* Control buttons */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 25 }}>
            <motion.button
              onClick={toggle}
              style={{
                padding: '14px 28px',
                borderRadius: 16,
                background: isActive
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(79, 172, 254, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? 'Pause' : 'Start'}
            </motion.button>

            <motion.button
              onClick={lap}
              style={{
                padding: '14px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              disabled={time === 0}
            >
              Lap
            </motion.button>

            <motion.button
              onClick={reset}
              style={{
                padding: '14px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>

          {/* Laps */}
          <AnimatePresence>
            {laps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginBottom: 12 }}>Lap Times</div>
                <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {laps.slice().reverse().map((lapTime, index) => {
                    const actualIndex = laps.length - index;
                    return (
                      <motion.div
                        key={actualIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>Lap {actualIndex}</span>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          {formatTime(lapTime)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
