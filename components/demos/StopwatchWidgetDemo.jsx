'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function StopwatchWidgetDemo() {
  const [time, setTime] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [laps, setLaps] = React.useState([]);
  const [startTime, setStartTime] = React.useState(null);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatTimeCompact = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  React.useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggle();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        lap();
      } else if (e.code === 'KeyR' && e.shiftKey) {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, time]);

  const toggle = () => {
    setIsActive(!isActive);
    if (!isActive && !startTime) {
      setStartTime(Date.now());
    }
  };

  const reset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
    setStartTime(null);
  };

  const lap = () => {
    if (time > 0) {
      setLaps([...laps, time]);
    }
  };

  // Calculate split times (time between laps)
  const splits = React.useMemo(() => {
    if (laps.length === 0) return [];
    const splitTimes = [laps[0]];
    for (let i = 1; i < laps.length; i++) {
      splitTimes.push(laps[i] - laps[i - 1]);
    }
    return splitTimes;
  }, [laps]);

  // Find best and worst laps
  const bestLap = splits.length > 0 ? Math.min(...splits) : null;
  const worstLap = splits.length > 0 ? Math.max(...splits) : null;
  const avgLap = splits.length > 0 ? splits.reduce((a, b) => a + b, 0) / splits.length : null;

  const copyToClipboard = () => {
    const data = `Stopwatch Results\n${'='.repeat(40)}\nTotal Time: ${formatTime(time)}\nLaps: ${laps.length}\n\n${laps.map((lap, i) => `Lap ${i + 1}: ${formatTime(lap)} (Split: ${formatTime(splits[i])})`).join('\n')}`;
    navigator.clipboard.writeText(data);
  };

  const clearLaps = () => {
    setLaps([]);
  };

  return (
    <>
      <h2 className="demo-title">Stopwatch Widget</h2>
      <p className="demo-subtitle">Professional stopwatch with lap splits, statistics, and keyboard shortcuts</p>
      <div className="demo-area">
        <motion.div
          style={{
            width: 480,
            background: 'rgba(20, 20, 30, 0.95)',
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.1)',
            padding: 35,
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Animated background gradients */}
          <motion.div
            style={{
              position: 'absolute',
              top: -150,
              right: -150,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              filter: 'blur(100px)',
              opacity: 0.15,
            }}
            animate={{
              scale: isActive ? [1, 1.4, 1] : 1,
              rotate: isActive ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              bottom: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              filter: 'blur(80px)',
              opacity: 0.12,
            }}
            animate={{
              scale: isActive ? [1, 1.3, 1] : 1,
              rotate: isActive ? [0, -90, 0] : 0,
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Progress circle */}
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 0 }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradientStopwatch)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{
                  strokeDashoffset: isActive ? 0 : 2 * Math.PI * 45,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <defs>
                <linearGradient id="progressGradientStopwatch" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4facfe" />
                  <stop offset="100%" stopColor="#00f2fe" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Main time display with enhanced styling */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 30 }}>
            <motion.div
              animate={isActive ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                fontSize: '4rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                background: 'linear-gradient(135deg, #667eea, #764ba2, #4facfe)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: 4,
                textShadow: '0 0 40px rgba(102, 126, 234, 0.3)',
              }}
            >
              {formatTime(time)}
            </motion.div>

            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <motion.div
                animate={isActive ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isActive ? '#10b981' : time > 0 ? '#f59e0b' : '#6b7280',
                  boxShadow: isActive ? '0 0 12px #10b981' : 'none',
                }}
              />
              <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, letterSpacing: 1 }}>
                {isActive ? 'RUNNING' : time > 0 ? 'PAUSED' : 'READY'}
              </div>
            </div>

            {/* Lap counter */}
            {laps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 12,
                  fontSize: '0.75rem',
                  color: '#666',
                  fontWeight: 600,
                }}
              >
                {laps.length} {laps.length === 1 ? 'Lap' : 'Laps'} Recorded
              </motion.div>
            )}
          </div>

          {/* Primary controls */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <motion.button
              onClick={toggle}
              style={{
                padding: '16px 36px',
                borderRadius: 18,
                background: isActive
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 10px 30px rgba(245, 87, 108, 0.4)'
                  : '0 10px 30px rgba(102, 126, 234, 0.4)',
                letterSpacing: 0.5,
                minWidth: 120,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: isActive
                  ? '0 14px 40px rgba(245, 87, 108, 0.5)'
                  : '0 14px 40px rgba(102, 126, 234, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? '⏸ Pause' : time > 0 ? '▶ Resume' : '▶ Start'}
            </motion.button>

            <motion.button
              onClick={lap}
              disabled={time === 0}
              style={{
                padding: '16px 36px',
                borderRadius: 18,
                background: time === 0
                  ? 'rgba(255,255,255,0.03)'
                  : 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))',
                border: '2px solid',
                borderColor: time === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(79, 172, 254, 0.4)',
                color: time === 0 ? '#444' : '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: time === 0 ? 'not-allowed' : 'pointer',
                letterSpacing: 0.5,
                minWidth: 120,
              }}
              whileHover={time > 0 ? {
                scale: 1.05,
                borderColor: 'rgba(79, 172, 254, 0.6)',
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3))',
              } : {}}
              whileTap={time > 0 ? { scale: 0.95 } : {}}
            >
              ⏱ Lap
            </motion.button>
          </div>

          {/* Secondary controls */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 25 }}>
            <motion.button
              onClick={reset}
              disabled={time === 0 && laps.length === 0}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: time === 0 && laps.length === 0 ? '#444' : '#ef4444',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: time === 0 && laps.length === 0 ? 'not-allowed' : 'pointer',
              }}
              whileHover={time > 0 || laps.length > 0 ? {
                scale: 1.05,
                background: 'rgba(239, 68, 68, 0.2)',
              } : {}}
              whileTap={time > 0 || laps.length > 0 ? { scale: 0.95 } : {}}
            >
              🔄 Reset
            </motion.button>

            {laps.length > 0 && (
              <>
                <motion.button
                  onClick={clearLaps}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#aaa',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑 Clear Laps
                </motion.button>

                <motion.button
                  onClick={copyToClipboard}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#aaa',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  📋 Copy
                </motion.button>
              </>
            )}
          </div>

          {/* Statistics panel */}
          <AnimatePresence>
            {splits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: 16,
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: 12, textAlign: 'center', fontWeight: 600, letterSpacing: 1 }}>LAP STATISTICS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: 4 }}>BEST</div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#10b981',
                      }}>
                        {formatTimeCompact(bestLap)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: 4 }}>AVERAGE</div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#4facfe',
                      }}>
                        {formatTimeCompact(avgLap)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: 4 }}>WORST</div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#ef4444',
                      }}>
                        {formatTimeCompact(worstLap)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Laps list with splits */}
          <AnimatePresence>
            {laps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  fontSize: '0.7rem',
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}>
                  LAP TIMES & SPLITS
                </div>
                <div style={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  paddingRight: 4,
                }}>
                  {laps.slice().reverse().map((lapTime, index) => {
                    const actualIndex = laps.length - index;
                    const splitTime = splits[actualIndex - 1];
                    const isBest = splitTime === bestLap && splits.length > 1;
                    const isWorst = splitTime === worstLap && splits.length > 1;

                    return (
                      <motion.div
                        key={actualIndex}
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 18px',
                          background: isBest
                            ? 'rgba(16, 185, 129, 0.08)'
                            : isWorst
                              ? 'rgba(239, 68, 68, 0.08)'
                              : 'rgba(255,255,255,0.03)',
                          borderRadius: 12,
                          border: '1px solid',
                          borderColor: isBest
                            ? 'rgba(16, 185, 129, 0.3)'
                            : isWorst
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(255,255,255,0.06)',
                          position: 'relative',
                        }}
                      >
                        {/* Lap number */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#888',
                          }}>
                            {actualIndex}
                          </div>
                          <div>
                            <div style={{
                              fontSize: '1.05rem',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              color: '#fff',
                              letterSpacing: 0.5,
                            }}>
                              {formatTime(lapTime)}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#666',
                              marginTop: 2,
                            }}>
                              +{formatTimeCompact(splitTime)} {isBest ? '🏆' : isWorst ? '🐌' : ''}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard shortcuts hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 20,
              padding: 12,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.7rem',
              color: '#555',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            <span style={{ color: '#777' }}>Shortcuts:</span> Space = Start/Pause • L = Lap • Shift+R = Reset
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
