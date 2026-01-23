'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function LightningDemo() {
  const [flash, setFlash] = React.useState(0);
  const [bolts, setBolts] = React.useState([]);
  const [isAuto, setIsAuto] = React.useState(true);
  const [intensity, setIntensity] = React.useState('medium');
  const [color, setColor] = React.useState('blue');
  const [strikeCount, setStrikeCount] = React.useState(0);
  const intervalRef = React.useRef(null);

  const colorSchemes = {
    blue: {
      outer: 'rgba(100, 150, 255, 0.4)',
      middle: 'rgba(150, 180, 255, 0.7)',
      core: '#ffffff',
      flash: [100, 120, 180]
    },
    purple: {
      outer: 'rgba(150, 100, 255, 0.4)',
      middle: 'rgba(180, 150, 255, 0.7)',
      core: '#f0e0ff',
      flash: [120, 100, 180]
    },
    green: {
      outer: 'rgba(100, 255, 150, 0.4)',
      middle: 'rgba(150, 255, 180, 0.7)',
      core: '#e0fff0',
      flash: [100, 180, 120]
    },
    red: {
      outer: 'rgba(255, 100, 100, 0.4)',
      middle: 'rgba(255, 150, 150, 0.7)',
      core: '#ffe0e0',
      flash: [180, 100, 100]
    },
    gold: {
      outer: 'rgba(255, 200, 100, 0.4)',
      middle: 'rgba(255, 220, 150, 0.7)',
      core: '#fffadd',
      flash: [180, 160, 100]
    }
  };

  const intensitySettings = {
    low: { branches: 1, segments: 8, width: 0.7, rainCount: 30 },
    medium: { branches: 3, segments: 12, width: 1, rainCount: 60 },
    high: { branches: 5, segments: 18, width: 1.4, rainCount: 100 },
    extreme: { branches: 8, segments: 25, width: 2, rainCount: 150 }
  };

  const generateBolt = (startX, startY, endY, maxBranches = 3, segmentCount = 12) => {
    const points = [[startX, startY]];
    let x = startX, y = startY;
    const branches = [];
    const segmentHeight = endY / segmentCount;

    while (y < endY) {
      const dx = (Math.random() - 0.5) * 70;
      x += dx;
      y += segmentHeight * (0.5 + Math.random() * 0.8);
      x = Math.max(50, Math.min(550, x));
      points.push([x, Math.min(y, endY)]);

      if (maxBranches > 0 && Math.random() > 0.65 && y < endY - 60) {
        const branchEndY = y + 50 + Math.random() * 80;
        const branchX = x + (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 60);
        branches.push(generateBolt(x, y, Math.min(branchEndY, endY), Math.max(0, maxBranches - 2), Math.floor(segmentCount * 0.6)));
      }
    }
    return { points, branches };
  };

  const strike = React.useCallback(() => {
    const settings = intensitySettings[intensity];
    const numBolts = intensity === 'extreme' ? 2 : 1;
    const newBolts = [];

    for (let i = 0; i < numBolts; i++) {
      const startX = 100 + Math.random() * 400;
      const bolt = generateBolt(startX, 0, 350, settings.branches, settings.segments);
      newBolts.push(bolt);
    }

    setBolts(newBolts);
    setStrikeCount(prev => prev + 1);

    setFlash(1);
    setTimeout(() => setFlash(0.2), 40);
    setTimeout(() => setFlash(0.9), 70);
    setTimeout(() => setFlash(0.4), 100);
    setTimeout(() => setFlash(0.7), 130);
    setTimeout(() => setFlash(0), 180);
    setTimeout(() => setBolts([]), 500);
  }, [intensity]);

  React.useEffect(() => {
    if (isAuto) {
      const delay = intensity === 'extreme' ? 1500 : intensity === 'high' ? 2000 : 2500;
      intervalRef.current = setInterval(() => {
        strike();
      }, delay + Math.random() * 1500);
      return () => clearInterval(intervalRef.current);
    }
  }, [isAuto, strike, intensity]);

  const renderBolt = (bolt, key = 'main', opacity = 1) => {
    const scheme = colorSchemes[color];
    const settings = intensitySettings[intensity];

    return (
      <React.Fragment key={key}>
        <motion.polyline
          points={bolt.points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke={scheme.outer}
          strokeWidth={32 * settings.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 0.15, repeat: 2 }}
        />
        <polyline
          points={bolt.points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke={scheme.outer}
          strokeWidth={20 * settings.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity * 0.8}
        />
        <polyline
          points={bolt.points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke={scheme.middle}
          strokeWidth={10 * settings.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
        <motion.polyline
          points={bolt.points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke={scheme.core}
          strokeWidth={4 * settings.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 0.1, repeat: 3 }}
        />
        <polyline
          points={bolt.points.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.5 * settings.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {bolt.branches.map((branch, i) => renderBolt(branch, `${key}-branch-${i}`, opacity * 0.75))}
      </React.Fragment>
    );
  };

  const scheme = colorSchemes[color];
  const settings = intensitySettings[intensity];

  return (
    <>
      <h2 className="demo-title">Lightning</h2>
      <p className="demo-subtitle">Interactive storm with controls for intensity, color, and auto-strike modes.</p>

      <div style={{
        display: 'flex',
        gap: 20,
        marginBottom: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '15px 20px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, color: '#aaa' }}>Auto:</label>
          <button
            onClick={() => setIsAuto(!isAuto)}
            style={{
              padding: '6px 16px',
              background: isAuto ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#333',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isAuto ? 'ON' : 'OFF'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: '#aaa' }}>Intensity:</label>
          {['low', 'medium', 'high', 'extreme'].map(level => (
            <button
              key={level}
              onClick={() => setIntensity(level)}
              style={{
                padding: '6px 12px',
                background: intensity === level ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : '#333',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {level}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: '#aaa' }}>Color:</label>
          {Object.keys(colorSchemes).map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28,
                height: 28,
                background: colorSchemes[c].middle,
                border: color === c ? '2px solid #fff' : '2px solid transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: color === c ? `0 0 12px ${colorSchemes[c].middle}` : 'none'
              }}
              title={c}
            />
          ))}
        </div>

        <div style={{
          padding: '6px 14px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 6,
          fontSize: 12,
          color: '#fff',
          fontWeight: 600
        }}>
          Strikes: {strikeCount}
        </div>
      </div>

      <div className="demo-area">
        <motion.div
          style={{
            width: 600,
            height: 400,
            borderRadius: 20,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, #0f0f20 0%, #1a1a35 40%, #252545 70%, #151530 100%)'
            }}
            animate={{
              background: flash > 0
                ? `linear-gradient(to bottom, rgba(${scheme.flash[0]},${scheme.flash[1]},${scheme.flash[2]},${flash * 0.6}) 0%, rgba(${scheme.flash[0] * 0.8},${scheme.flash[1] * 0.8},${scheme.flash[2] * 0.8},${flash * 0.5}) 40%, rgba(${scheme.flash[0] * 0.6},${scheme.flash[1] * 0.6},${scheme.flash[2] * 0.6},${flash * 0.4}) 70%, rgba(${scheme.flash[0] * 0.4},${scheme.flash[1] * 0.4},${scheme.flash[2] * 0.4},${flash * 0.3}) 100%)`
                : 'linear-gradient(to bottom, #0f0f20 0%, #1a1a35 40%, #252545 70%, #151530 100%)'
            }}
            transition={{ duration: 0.03 }}
          />

          <motion.div
            style={{
              position: 'absolute',
              top: -30,
              left: -60,
              right: -60,
              height: 150,
              background: 'radial-gradient(ellipse at 25% 100%, #3a3a50 0%, transparent 45%), radial-gradient(ellipse at 75% 100%, #2a2a40 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, #1a1a30 0%, transparent 65%)',
              filter: 'blur(15px)',
              opacity: 0.9
            }}
            animate={{
              opacity: flash > 0 ? 0.5 + flash * 0.4 : 0.9,
              background: flash > 0.5
                ? `radial-gradient(ellipse at 25% 100%, rgba(${scheme.flash[0]},${scheme.flash[1]},${scheme.flash[2]},0.3) 0%, transparent 45%), radial-gradient(ellipse at 75% 100%, rgba(${scheme.flash[0] * 0.8},${scheme.flash[1] * 0.8},${scheme.flash[2] * 0.8},0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(${scheme.flash[0] * 0.6},${scheme.flash[1] * 0.6},${scheme.flash[2] * 0.6},0.25) 0%, transparent 65%)`
                : 'radial-gradient(ellipse at 25% 100%, #3a3a50 0%, transparent 45%), radial-gradient(ellipse at 75% 100%, #2a2a40 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, #1a1a30 0%, transparent 65%)'
            }}
            transition={{ duration: 0.08 }}
          />

          <motion.div
            style={{
              position: 'absolute',
              top: -20,
              left: -40,
              right: -40,
              height: 100,
              background: 'radial-gradient(ellipse at 60% 100%, rgba(40, 40, 60, 0.6) 0%, transparent 40%)',
              filter: 'blur(20px)'
            }}
            animate={{
              x: [-10, 10, -10],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {[...Array(settings.rainCount)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: -20,
                width: 1.5,
                height: 12 + Math.random() * 25,
                background: `linear-gradient(to bottom, transparent, ${scheme.middle}40)`,
                borderRadius: 2
              }}
              animate={{ y: [0, 450] }}
              transition={{
                duration: 0.3 + Math.random() * 0.4,
                repeat: Infinity,
                delay: Math.random() * 0.8,
                ease: 'linear'
              }}
            />
          ))}

          {bolts.length > 0 && (
            <motion.svg
              style={{ position: 'absolute', inset: 0, zIndex: 10 }}
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={{
                opacity: [1, 0.9, 1, 0.7, 0],
                filter: ['blur(0px)', 'blur(0.5px)', 'blur(0px)', 'blur(1px)', 'blur(2px)']
              }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] }}
            >
              {bolts.map((bolt, i) => renderBolt(bolt, i))}
            </motion.svg>
          )}

          {flash > 0.5 && (
            <motion.div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 200,
                height: 100,
                background: `radial-gradient(ellipse at 50% 100%, ${scheme.middle} 0%, transparent 70%)`,
                filter: 'blur(30px)',
                opacity: flash
              }}
            />
          )}

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to top, #05050a 0%, #0a0a15 60%, transparent 100%)'
          }} />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: '#000',
            clipPath: 'polygon(0% 100%, 0% 80%, 8% 75%, 8% 50%, 12% 50%, 12% 70%, 18% 65%, 18% 40%, 22% 40%, 22% 60%, 30% 55%, 30% 35%, 35% 35%, 35% 50%, 42% 45%, 42% 30%, 48% 30%, 48% 55%, 55% 50%, 55% 25%, 60% 25%, 60% 45%, 68% 40%, 68% 35%, 72% 35%, 72% 60%, 80% 55%, 80% 45%, 85% 45%, 85% 65%, 92% 60%, 92% 75%, 100% 70%, 100% 100%)',
            opacity: 0.9
          }} />

          <motion.button
            onClick={strike}
            className="replay-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${scheme.middle}, ${scheme.outer})`,
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${scheme.outer}`,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            ⚡ Strike
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
