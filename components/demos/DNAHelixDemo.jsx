'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function DNAHelixDemo() {
  const [rotation, setRotation] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const numPairs = 24;
  const radius = 70;
  const verticalSpacing = 14;

  React.useEffect(() => {
    if (isPaused) return;
    let animationId;
    const animate = () => {
      setRotation(r => (r + 1.5) % 360);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const basePairs = [
    { a: '#00d4ff', b: '#ff00aa', label: 'A-T' },
    { a: '#00ff88', b: '#ffaa00', label: 'G-C' },
    { a: '#aa88ff', b: '#ff6644', label: 'C-G' },
    { a: '#88ffcc', b: '#ff4488', label: 'T-A' }
  ];

  return (
    <>
      <h2 className="demo-title">DNA Helix</h2>
      <p className="demo-subtitle">Interactive 3D double helix with base pair connections and depth shading.</p>
      <div className="demo-area">
        <div
          onClick={() => setIsPaused(!isPaused)}
          style={{
            width: 300,
            height: 400,
            position: 'relative',
            perspective: 1000,
            cursor: 'pointer',
            background: 'radial-gradient(ellipse at center, #1a1a35 0%, #0a0a15 100%)',
            borderRadius: 20,
            overflow: 'hidden'
          }}
        >
          {/* Glow background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 150, 255, 0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformStyle: 'preserve-3d'
          }}>
            {[...Array(numPairs)].map((_, i) => {
              const angle = (i / numPairs) * 720 + rotation;
              const rad = angle * Math.PI / 180;
              const x1 = Math.sin(rad) * radius;
              const z1 = Math.cos(rad) * radius;
              const x2 = -x1;
              const z2 = -z1;
              const y = i * verticalSpacing - (numPairs * verticalSpacing) / 2;

              const depthFactor1 = (z1 + radius) / (radius * 2);
              const depthFactor2 = (z2 + radius) / (radius * 2);
              const size1 = 10 + depthFactor1 * 8;
              const size2 = 10 + depthFactor2 * 8;
              const opacity1 = 0.4 + depthFactor1 * 0.6;
              const opacity2 = 0.4 + depthFactor2 * 0.6;

              const pair = basePairs[i % basePairs.length];

              return (
                <React.Fragment key={i}>
                  {/* Backbone strand 1 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: size1,
                      height: size1,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 30%, ${pair.a}, ${pair.a}88)`,
                      transform: `translate3d(${x1 - size1/2}px, ${y}px, ${z1}px)`,
                      boxShadow: `0 0 ${10 + depthFactor1 * 15}px ${pair.a}66, inset 0 0 10px rgba(255,255,255,0.3)`,
                      opacity: opacity1,
                      zIndex: Math.round(z1)
                    }}
                  />
                  {/* Backbone strand 2 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: size2,
                      height: size2,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 30%, ${pair.b}, ${pair.b}88)`,
                      transform: `translate3d(${x2 - size2/2}px, ${y}px, ${z2}px)`,
                      boxShadow: `0 0 ${10 + depthFactor2 * 15}px ${pair.b}66, inset 0 0 10px rgba(255,255,255,0.3)`,
                      opacity: opacity2,
                      zIndex: Math.round(z2)
                    }}
                  />
                  {/* Base pair connection */}
                  <div
                    style={{
                      position: 'absolute',
                      height: 3,
                      width: Math.abs(x1 * 2),
                      background: `linear-gradient(90deg, ${pair.a}aa, #ffffff33, ${pair.b}aa)`,
                      transform: `translate3d(${-Math.abs(x1)}px, ${y}px, ${(z1 + z2) / 2}px)`,
                      opacity: Math.min(opacity1, opacity2) * 0.7,
                      borderRadius: 2,
                      zIndex: Math.round((z1 + z2) / 2) - 1
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>

          {/* Instructions */}
          <div style={{
            position: 'absolute',
            bottom: 15,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#555',
            fontSize: '0.75rem'
          }}>
            Click to {isPaused ? 'resume' : 'pause'}
          </div>
        </div>
      </div>
    </>
  );
}
