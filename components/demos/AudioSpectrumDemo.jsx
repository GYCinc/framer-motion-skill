'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function AudioSpectrumDemo() {
  const [isActive, setIsActive] = React.useState(true);
  const [visualMode, setVisualMode] = React.useState('bars');
  const [colorTheme, setColorTheme] = React.useState('spectrum');
  const bins = 48;
  const [spectrum, setSpectrum] = React.useState(Array(bins).fill(0));
  const [peaks, setPeaks] = React.useState(Array(bins).fill(0));
  const [waterfall, setWaterfall] = React.useState([]);
  const maxWaterfallRows = 20;

  const themes = {
    spectrum: (val, i) => `hsl(${280 - val * 100 - (i / bins) * 60}, 85%, ${45 + val * 25}%)`,
    fire: (val, i) => `hsl(${45 - val * 45}, 100%, ${40 + val * 30}%)`,
    ice: (val, i) => `hsl(${200 + val * 40}, 80%, ${40 + val * 35}%)`,
    neon: (val, i) => `hsl(${(i / bins) * 360}, 100%, ${50 + val * 20}%)`,
  };

  React.useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const newSpectrum = Array(bins).fill(0).map((_, i) => {
        const freq = i / bins;
        const time = Date.now() / 200;
        const base = Math.sin(time + i * 0.4) * 0.25 + 0.35;
        const bass = freq < 0.2 ? 0.4 * Math.sin(time * 1.5) * 0.5 + 0.5 : 0;
        const mid = freq > 0.2 && freq < 0.5 ? 0.25 : 0;
        const high = freq > 0.7 ? Math.random() * 0.2 : 0;
        return Math.min(1, Math.max(0.05, base + bass + mid + high + Math.random() * 0.15));
      });
      setSpectrum(newSpectrum);

      // Peak detection with decay
      setPeaks(prev => prev.map((p, i) => {
        if (newSpectrum[i] > p) return newSpectrum[i];
        return Math.max(newSpectrum[i], p - 0.02);
      }));

      // Waterfall history
      setWaterfall(prev => {
        const next = [...prev, newSpectrum];
        return next.slice(-maxWaterfallRows);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const getColor = themes[colorTheme];

  // Calculate average levels for display
  const avgLevel = spectrum.reduce((a, b) => a + b, 0) / bins;
  const peakLevel = Math.max(...spectrum);

  // Circular visualization SVG
  const CircularSpectrum = () => {
    const cx = 150, cy = 150, baseR = 60, maxR = 120;
    return (
      <svg width={300} height={300} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Base circle */}
        <circle cx={cx} cy={cy} r={baseR} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Spectrum bars as radial lines */}
        {spectrum.map((val, i) => {
          const angle = (i / bins) * Math.PI * 2 - Math.PI / 2;
          const innerR = baseR;
          const outerR = baseR + val * (maxR - baseR);
          const x1 = cx + Math.cos(angle) * innerR;
          const y1 = cy + Math.sin(angle) * innerR;
          const x2 = cx + Math.cos(angle) * outerR;
          const y2 = cy + Math.sin(angle) * outerR;
          return (
            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={getColor(val, i)} strokeWidth={3} strokeLinecap="round" filter="url(#glow)"
              initial={false} animate={{ x2, y2 }} transition={{ duration: 0.05 }}
            />
          );
        })}
        {/* Center info */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">{Math.round(avgLevel * 100)}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#888" fontSize="10">AVG LEVEL</text>
      </svg>
    );
  };

  // 3D Perspective bars
  const Perspective3D = () => (
    <div style={{ height: 200, perspective: '600px', perspectiveOrigin: '50% 30%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px' }}>
      {spectrum.map((val, i) => (
        <motion.div key={i} style={{
          width: 8, background: getColor(val, i), borderRadius: '2px 2px 0 0',
          transformStyle: 'preserve-3d', transformOrigin: 'bottom',
          boxShadow: `0 0 10px ${getColor(val, i)}50`,
        }}
          animate={{ height: val * 160, rotateX: -15, translateZ: Math.sin((i / bins) * Math.PI) * 30 }}
          transition={{ duration: 0.05 }}
        />
      ))}
    </div>
  );

  // Waterfall display
  const Waterfall = () => (
    <div style={{ height: 200, overflow: 'hidden', borderRadius: '12px', background: 'rgba(0,0,0,0.4)' }}>
      {waterfall.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: 'flex', height: 200 / maxWaterfallRows, opacity: 0.3 + (rowIdx / maxWaterfallRows) * 0.7 }}>
          {row.map((val, i) => (
            <div key={i} style={{ flex: 1, background: getColor(val, i), opacity: val }} />
          ))}
        </div>
      ))}
    </div>
  );

  // Mirror/symmetric bars
  const MirrorBars = () => (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', height: '50%' }}>
        {spectrum.map((val, i) => (
          <motion.div key={i} style={{ width: 6, background: `linear-gradient(0deg, ${getColor(val, i)}, transparent)`, borderRadius: '3px 3px 0 0' }}
            animate={{ height: `${val * 100}%` }} transition={{ duration: 0.05 }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '3px', height: '50%' }}>
        {spectrum.map((val, i) => (
          <motion.div key={i} style={{ width: 6, background: `linear-gradient(180deg, ${getColor(val, i)}80, transparent)`, borderRadius: '0 0 3px 3px' }}
            animate={{ height: `${val * 60}%` }} transition={{ duration: 0.05 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Audio Spectrum</h2>
        <p className="demo-subtitle">Professional frequency analyzer with circular, 3D, waterfall, and mirror modes</p>
      </div>
      <div className="demo-area">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(12, 12, 20, 0.95)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Stats bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: getColor(avgLevel, 24) }}>{Math.round(avgLevel * 100)}</div>
                <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Level</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: peakLevel > 0.85 ? '#ef4444' : '#10b981' }}>{Math.round(peakLevel * 100)}</div>
                <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Peak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{bins}</div>
                <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Bands</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <motion.div style={{ width: 10, height: 10, borderRadius: '50%' }}
                  animate={{ background: isActive ? '#10b981' : '#ef4444', boxShadow: isActive ? '0 0 10px #10b981' : 'none' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{isActive ? 'Active' : 'Paused'}</span>
              </div>
            </div>

            {/* Visualization area */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '16px', marginBottom: '16px', minHeight: 220 }}>
              {visualMode === 'bars' && (
                <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', position: 'relative' }}>
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75, 1].map(y => (
                    <div key={y} style={{ position: 'absolute', left: 0, right: 0, bottom: `${y * 100}%`, borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
                  ))}
                  {spectrum.map((val, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      {/* Peak indicator */}
                      <motion.div style={{ position: 'absolute', width: 8, height: 3, background: '#fff', borderRadius: '1px', left: 0 }}
                        animate={{ bottom: peaks[i] * 195 }} transition={{ duration: 0.05 }}
                      />
                      {/* Main bar */}
                      <motion.div style={{ width: 8, background: `linear-gradient(0deg, ${getColor(val, i)}, ${getColor(val * 0.7, i)})`, borderRadius: '2px 2px 0 0', boxShadow: val > 0.7 ? `0 0 15px ${getColor(val, i)}60` : 'none' }}
                        animate={{ height: val * 190 }} transition={{ duration: 0.05 }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {visualMode === 'circular' && <CircularSpectrum />}
              {visualMode === '3d' && <Perspective3D />}
              {visualMode === 'waterfall' && <Waterfall />}
              {visualMode === 'mirror' && <MirrorBars />}
            </div>

            {/* Frequency labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.65rem', color: '#555', padding: '0 8px' }}>
              <span>20 Hz</span><span>100</span><span>500</span><span>1k</span><span>5k</span><span>10k</span><span>20 kHz</span>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Visual mode selector */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['bars', 'circular', '3d', 'waterfall', 'mirror'].map(mode => (
                  <motion.button key={mode} onClick={() => setVisualMode(mode)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', border: 'none',
                      background: visualMode === mode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                      color: visualMode === mode ? '#fff' : '#666', fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem', textTransform: 'capitalize',
                    }}
                  >{mode}</motion.button>
                ))}
              </div>

              {/* Color theme selector */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#555' }}>Theme:</span>
                {Object.keys(themes).map(theme => (
                  <motion.button key={theme} onClick={() => setColorTheme(theme)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    style={{
                      width: 24, height: 24, borderRadius: '6px', border: colorTheme === theme ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                      background: theme === 'spectrum' ? 'linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4)' :
                        theme === 'fire' ? 'linear-gradient(135deg, #ef4444, #f59e0b, #fbbf24)' :
                        theme === 'ice' ? 'linear-gradient(135deg, #0ea5e9, #06b6d4, #22d3ee)' :
                        'linear-gradient(135deg, #ef4444, #22c55e, #3b82f6, #a855f7)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>

              {/* Play/pause */}
              <motion.button onClick={() => setIsActive(!isActive)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 20px', borderRadius: '10px', border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem',
                }}
              >{isActive ? '⏹ Stop' : '▶ Start'}</motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
