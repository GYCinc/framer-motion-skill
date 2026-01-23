'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function Door3DDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <h2 className="demo-title">3D Door</h2>
      <p className="demo-subtitle">Click to open/close the door with realistic 3D hinge rotation.</p>
      <div className="demo-area">
        <div style={{ perspective: 1200 }}>
          <div style={{
            width: 180,
            height: 300,
            position: 'relative',
            transformStyle: 'preserve-3d'
          }}>
            {/* Door frame */}
            <div style={{
              position: 'absolute',
              inset: -8,
              background: '#333',
              borderRadius: 4,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
            }} />
            {/* Room inside */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #1a1a2e, #0a0a15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
                style={{ fontSize: '3rem' }}
              >
                🎁
              </motion.div>
            </div>
            {/* Door */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #8B4513, #654321)',
                borderRadius: 2,
                transformOrigin: 'left center',
                cursor: 'pointer',
                boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              animate={{ rotateY: isOpen ? -110 : 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 15 }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* Door handle */}
              <div style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                width: 12,
                height: 40,
                background: '#C0A060',
                borderRadius: 3,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
              }} />
              {/* Door panels */}
              <div style={{
                width: '70%',
                height: '35%',
                border: '3px solid rgba(0,0,0,0.2)',
                borderRadius: 4,
                position: 'absolute',
                top: '10%'
              }} />
              <div style={{
                width: '70%',
                height: '35%',
                border: '3px solid rgba(0,0,0,0.2)',
                borderRadius: 4,
                position: 'absolute',
                bottom: '10%'
              }} />
            </motion.div>
          </div>
        </div>
        <p style={{ marginTop: 20, color: '#666', fontSize: '0.85rem' }}>Click the door to {isOpen ? 'close' : 'open'}</p>
      </div>
    </>
  );
}
