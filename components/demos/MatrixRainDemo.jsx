'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function MatrixRainDemo() {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  const MatrixColumn = ({ delay, speed, x }) => {
    const [characters, setCharacters] = React.useState(() =>
      [...Array(25)].map(() => chars[Math.floor(Math.random() * chars.length)])
    );

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCharacters(prev => prev.map((c, i) =>
          Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : c
        ));
      }, 100);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          fontSize: '14px',
          fontFamily: '"MS Gothic", "Hiragino Kaku Gothic Pro", monospace',
          lineHeight: 1.2
        }}
        animate={{ y: ['-50%', '150%'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          delay: delay,
          ease: 'linear'
        }}
      >
        {characters.map((char, i) => (
          <span
            key={i}
            style={{
              color: i === 0 ? '#ffffff' : i < 3 ? '#aaffaa' : `rgba(0, 255, 70, ${Math.max(0, 1 - i * 0.04)})`,
              textShadow: i === 0
                ? '0 0 15px #fff, 0 0 30px #0f0'
                : i < 3
                ? '0 0 10px #0f0'
                : '0 0 5px rgba(0, 255, 70, 0.5)',
              opacity: Math.max(0.1, 1 - i * 0.04)
            }}
          >
            {char}
          </span>
        ))}
      </motion.div>
    );
  };

  const columns = React.useMemo(() =>
    [...Array(40)].map((_, i) => ({
      x: `${(i / 40) * 100}%`,
      delay: Math.random() * 5,
      speed: 2 + Math.random() * 4
    })), []
  );

  return (
    <>
      <h2 className="demo-title">Matrix Rain</h2>
      <p className="demo-subtitle">Digital rain with Japanese katakana and dynamic character morphing.</p>
      <div className="demo-area">
        <div style={{
          width: 600,
          height: 350,
          borderRadius: 20,
          background: '#000a00',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Scan line effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Glow at top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            background: 'linear-gradient(to bottom, rgba(0, 50, 0, 0.5), transparent)',
            pointerEvents: 'none'
          }} />

          {columns.map((col, i) => (
            <MatrixColumn key={i} {...col} />
          ))}

          {/* Reflection glow at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to top, rgba(0, 30, 0, 0.8), transparent)',
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    </>
  );
}
