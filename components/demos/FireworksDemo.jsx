'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function FireworksDemo() {
  const [explosions, setExplosions] = React.useState([]);
  const [rockets, setRockets] = React.useState([]);

  const colorSchemes = [
    ['#ff4444', '#ff8844', '#ffcc44'],
    ['#44ff44', '#44ffaa', '#aaffaa'],
    ['#4488ff', '#44ccff', '#aaddff'],
    ['#ff44ff', '#ff88ff', '#ffaaff'],
    ['#ffff44', '#ffcc44', '#ff8844'],
    ['#ff4488', '#ff44cc', '#cc44ff']
  ];

  const createExplosion = (x, y) => {
    const id = Date.now() + Math.random();
    const colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    const numRings = 2 + Math.floor(Math.random() * 2);
    const particles = [];

    for (let ring = 0; ring < numRings; ring++) {
      const numParticles = 20 + ring * 10;
      const baseDistance = 40 + ring * 40;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          id: `${ring}-${i}`,
          angle: (i / numParticles) * 360 + Math.random() * 10,
          distance: baseDistance + Math.random() * 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 3 + Math.random() * 3,
          duration: 0.8 + ring * 0.3 + Math.random() * 0.3,
          delay: ring * 0.05
        });
      }
    }

    // Add sparkle particles
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: `sparkle-${i}`,
        angle: Math.random() * 360,
        distance: 20 + Math.random() * 100,
        color: '#ffffff',
        size: 2,
        duration: 1.2 + Math.random() * 0.5,
        delay: 0.1,
        isSparkle: true
      });
    }

    setExplosions(prev => [...prev, { id, x, y, particles }]);
    setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== id)), 2000);
  };

  const launchRocket = (x) => {
    const id = Date.now() + Math.random();
    const startY = 350;
    const endY = 50 + Math.random() * 100;

    setRockets(prev => [...prev, { id, x, startY, endY }]);

    setTimeout(() => {
      createExplosion(x, endY);
      setRockets(prev => prev.filter(r => r.id !== id));
    }, 600);
  };

  return (
    <>
      <h2 className="demo-title">Fireworks</h2>
      <p className="demo-subtitle">Click anywhere to launch fireworks with multi-ring explosions and sparkle trails.</p>
      <div className="demo-area">
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            launchRocket(e.clientX - rect.left);
          }}
          style={{
            width: 600,
            height: 350,
            borderRadius: 20,
            background: 'linear-gradient(to bottom, #000510 0%, #0a1025 50%, #151535 100%)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'crosshair'
          }}
        >
          {/* City silhouette */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px' }} viewBox="0 0 600 60" preserveAspectRatio="none">
            <path d="M0,60 L0,40 L30,40 L30,30 L50,30 L50,40 L80,40 L80,20 L90,20 L90,10 L100,10 L100,20 L110,20 L110,40 L150,40 L150,25 L160,25 L160,15 L170,15 L170,25 L180,25 L180,40 L220,40 L220,35 L230,35 L230,20 L250,20 L250,35 L260,35 L260,40 L300,40 L300,30 L310,30 L310,5 L320,5 L320,30 L330,30 L330,40 L380,40 L380,25 L400,25 L400,40 L450,40 L450,30 L470,30 L470,15 L480,15 L480,30 L490,30 L490,40 L550,40 L550,35 L570,35 L570,40 L600,40 L600,60 Z" fill="#0a0a15" />
          </svg>

          <div style={{ position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)', color: '#444', fontSize: '0.8rem' }}>
            Click to launch
          </div>

          {/* Rockets */}
          {rockets.map(rocket => (
            <motion.div
              key={rocket.id}
              style={{
                position: 'absolute',
                left: rocket.x,
                width: 4,
                height: 20,
                background: 'linear-gradient(to top, #ff8800, #ffcc00, #fff)',
                borderRadius: 2,
                boxShadow: '0 0 10px #ff8800, 0 0 20px #ff4400'
              }}
              initial={{ y: rocket.startY, opacity: 1 }}
              animate={{ y: rocket.endY, opacity: [1, 1, 0] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}

          {/* Explosions */}
          {explosions.map(exp => (
            <div key={exp.id}>
              {/* Flash */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: exp.x - 50,
                  top: exp.y - 50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              {exp.particles.map(p => (
                <motion.div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    width: p.size,
                    height: p.size,
                    borderRadius: '50%',
                    background: p.color,
                    left: exp.x,
                    top: exp.y,
                    boxShadow: p.isSparkle ? `0 0 6px #fff` : `0 0 ${p.size * 2}px ${p.color}`
                  }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                    y: Math.sin(p.angle * Math.PI / 180) * p.distance + (p.isSparkle ? 80 : 40),
                    scale: p.isSparkle ? [1, 1, 0] : [1, 0.5, 0],
                    opacity: [1, 0.8, 0]
                  }}
                  transition={{ duration: p.duration, ease: 'easeOut', delay: p.delay }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
