'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function AudioWaveformDemo() {
  const [isActive, setIsActive] = React.useState(true);
  const [displayMode, setDisplayMode] = React.useState('bars');
  const [colorTheme, setColorTheme] = React.useState('green');
  const [amplitude, setAmplitude] = React.useState(0.8);
  const [peakLevel, setPeakLevel] = React.useState(0);
  const [dbLevel, setDbLevel] = React.useState(-60);

  const bars = 64;
  const [heights, setHeights] = React.useState(Array(bars).fill(0.1));
  const [smoothHeights, setSmoothHeights] = React.useState(Array(bars).fill(0.1));

  const themes = {
    green: { primary: '#43e97b', secondary: '#38f9d7', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    purple: { primary: '#667eea', secondary: '#764ba2', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    orange: { primary: '#f5576c', secondary: '#f093fb', gradient: 'linear-gradient(135deg, #f5576c, #f093fb)' },
    blue: { primary: '#4facfe', secondary: '#00f2fe', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  };
  const theme = themes[colorTheme];

  React.useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const newHeights = Array(bars).fill(0).map((_, i) => {
        const time = Date.now() / 200;
        const bass = Math.abs(Math.sin(time + i * 0.1)) * (i < bars * 0.2 ? 1.3 : 0.6);
        const mid = Math.abs(Math.sin(time * 1.5 + i * 0.2)) * (i >= bars * 0.2 && i < bars * 0.6 ? 1.2 : 0.5);
        const high = Math.abs(Math.sin(time * 2 + i * 0.3)) * (i >= bars * 0.6 ? 1 : 0.4);
        const noise = Math.random() * 0.15;
        return Math.min(1, (bass + mid + high + noise) * 0.35 * amplitude);
      });
      setHeights(newHeights);
      setSmoothHeights(prev => prev.map((h, i) => h * 0.7 + newHeights[i] * 0.3));
      const maxH = Math.max(...newHeights);
      setPeakLevel(prev => Math.max(prev * 0.95, maxH));
      setDbLevel(-60 + maxH * 60);
    }, 40);
    return () => clearInterval(interval);
  }, [isActive, amplitude]);

  const renderBars = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', height: '100%' }}>
      {smoothHeights.map((h, i) => (
        <motion.div key={i}
          style={{ width: '6px', borderRadius: '3px 3px 0 0', background: `linear-gradient(180deg, ${h > 0.8 ? '#f5576c' : theme.primary} 0%, ${theme.secondary} 100%)`, position: 'relative' }}
          animate={{ height: `${h * 100}%` }} transition={{ duration: 0.04 }}>
          {h > 0.85 && <motion.div style={{ position: 'absolute', top: 0, left: -2, right: -2, height: 4, background: '#f5576c', borderRadius: 2, filter: 'blur(2px)' }}
            animate={{ opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 0.2, repeat: Infinity }} />}
        </motion.div>
      ))}
    </div>
  );

  const renderMirror = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', height: '100%' }}>
      {smoothHeights.map((h, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <motion.div style={{ width: '5px', borderRadius: '3px', background: `linear-gradient(0deg, ${theme.secondary}, ${theme.primary})` }}
            animate={{ height: `${h * 50}%` }} transition={{ duration: 0.04 }} />
          <motion.div style={{ width: '5px', borderRadius: '3px', background: `linear-gradient(180deg, ${theme.secondary}80, ${theme.primary}40)` }}
            animate={{ height: `${h * 50}%` }} transition={{ duration: 0.04 }} />
        </div>
      ))}
    </div>
  );

  const renderCircular = () => {
    const centerX = 100, centerY = 100, radius = 70;
    return (
      <svg width="200" height="200" style={{ margin: '0 auto', display: 'block' }}>
        <defs>
          <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} />
            <stop offset="100%" stopColor={theme.secondary} />
          </linearGradient>
        </defs>
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        {smoothHeights.filter((_, i) => i % 2 === 0).map((h, i, arr) => {
          const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
          const innerR = radius - 5;
          const outerR = radius + h * 35;
          const x1 = centerX + Math.cos(angle) * innerR;
          const y1 = centerY + Math.sin(angle) * innerR;
          const x2 = centerX + Math.cos(angle) * outerR;
          const y2 = centerY + Math.sin(angle) * outerR;
          return <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#circGrad)" strokeWidth="3" strokeLinecap="round"
            initial={false} animate={{ x2, y2 }} transition={{ duration: 0.04 }} />;
        })}
        <circle cx={centerX} cy={centerY} r="25" fill={`${theme.primary}30`} />
        <motion.circle cx={centerX} cy={centerY} r="20" fill={theme.primary}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 0.5, repeat: Infinity }} />
      </svg>
    );
  };

  const renderLine = () => {
    const points = smoothHeights.map((h, i) => `${(i / (smoothHeights.length - 1)) * 100},${100 - h * 100}`).join(' ');
    const fillPoints = `0,100 ${points} 100,100`;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={theme.secondary} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPoints} fill="url(#lineGrad)" />
        <polyline points={points} fill="none" stroke={theme.primary} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
        {smoothHeights.map((h, i) => h > 0.7 && (
          <circle key={i} cx={(i / (smoothHeights.length - 1)) * 100} cy={100 - h * 100} r="1" fill={theme.primary}>
            <animate attributeName="opacity" values="1;0.3;1" dur="0.3s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    );
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Audio Waveform</h2>
        <p className="demo-subtitle">Professional audio visualization with bars, mirror, circular, and line modes</p>
      </div>
      <div className="demo-area">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(15, 15, 25, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>

            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <motion.div style={{ width: 50, height: 50, borderRadius: '14px', background: theme.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }}>
                  <span style={{ fontSize: '1.4rem' }}>🎵</span>
                </motion.div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Audio Input</div>
                  <div style={{ fontSize: '0.8rem', color: isActive ? theme.primary : '#666' }}>● {isActive ? 'Recording' : 'Paused'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: dbLevel > -10 ? '#f5576c' : '#fff', fontFamily: 'monospace' }}>{dbLevel.toFixed(1)} dB</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Peak: {(peakLevel * 100).toFixed(0)}%</div>
                </div>
                <div style={{ width: 8, height: 50, background: 'rgba(0,0,0,0.4)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                  <motion.div style={{ width: '100%', background: peakLevel > 0.85 ? '#f5576c' : theme.gradient, borderRadius: 4 }}
                    animate={{ height: `${peakLevel * 100}%` }} transition={{ duration: 0.05 }} />
                </div>
              </div>
            </div>

            <div style={{ height: displayMode === 'circular' ? '220px' : '150px', padding: '20px', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${theme.primary}15 0%, transparent 70%)` }} />
              <div style={{ position: 'relative', height: '100%' }}>
                {displayMode === 'bars' && renderBars()}
                {displayMode === 'mirror' && renderMirror()}
                {displayMode === 'circular' && renderCircular()}
                {displayMode === 'line' && renderLine()}
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                {['bars', 'mirror', 'circular', 'line'].map(mode => (
                  <motion.button key={mode} onClick={() => setDisplayMode(mode)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: displayMode === mode ? theme.gradient : 'rgba(255,255,255,0.08)', color: displayMode === mode ? '#000' : '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                    {mode}
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', justifyContent: 'center' }}>
                {Object.keys(themes).map(t => (
                  <motion.button key={t} onClick={() => setColorTheme(t)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: colorTheme === t ? '2px solid #fff' : '2px solid transparent', background: themes[t].gradient, cursor: 'pointer' }} />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Gain</span>
                  <input type="range" min="0.3" max="1" step="0.1" value={amplitude} onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                    style={{ width: '100px', accentColor: theme.primary }} />
                </div>
                <motion.button onClick={() => setIsActive(!isActive)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: isActive ? '#f5576c' : theme.gradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isActive ? '⏸ Pause' : '▶ Start'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
