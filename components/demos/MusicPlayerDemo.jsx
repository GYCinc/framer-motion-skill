'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function MusicPlayerDemo() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(35);
  const [currentSong, setCurrentSong] = React.useState(0);
  const [volume, setVolume] = React.useState(75);

  const songs = [
    { title: 'Midnight Dreams', artist: 'Luna Wave', duration: '3:45', color: '#667eea' },
    { title: 'Electric Soul', artist: 'Neon Pulse', duration: '4:12', color: '#f093fb' },
    { title: 'Starlight', artist: 'Cosmic Dust', duration: '3:58', color: '#4facfe' },
    { title: 'Ocean Breeze', artist: 'Tidal Flow', duration: '4:30', color: '#43e97b' },
  ];

  const currentSongData = songs[currentSong];

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => prev >= 100 ? 0 : prev + 0.5);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <>
      <h2 className="demo-title">Music Player</h2>
      <p className="demo-subtitle">Interactive music player with album art, progress tracking, and playlist management</p>
      <div className="demo-area">
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
          {/* Main Player */}
          <motion.div
            style={{
              width: 340,
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
            {/* Animated background gradient */}
            <motion.div
              style={{
                position: 'absolute',
                top: -80,
                right: -80,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${currentSongData.color} 0%, ${currentSongData.color}99 100%)`,
                filter: 'blur(80px)',
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 120, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Album Art */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: 25 }}>
              <motion.div
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${currentSongData.color}, ${currentSongData.color}66)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  boxShadow: `0 20px 60px ${currentSongData.color}40`,
                }}
                animate={isPlaying ? {
                  rotate: [0, 360],
                  scale: [1, 1.02, 1],
                } : {
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
                whileHover={{ scale: 1.05 }}
              >
                🎵
              </motion.div>
            </div>

            {/* Song Info */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 20 }}>
              <motion.h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: 5,
                  background: `linear-gradient(135deg, ${currentSongData.color}, #fff)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                key={currentSong}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {currentSongData.title}
              </motion.h3>
              <motion.p
                style={{ fontSize: '1rem', color: '#888' }}
                key={`artist-${currentSong}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {currentSongData.artist}
              </motion.p>
            </div>

            {/* Progress Bar */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: 20 }}>
              <div
                style={{
                  width: '100%',
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = ((e.clientX - rect.left) / rect.width) * 100;
                  setProgress(percent);
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${currentSongData.color}, ${currentSongData.color}cc)`,
                    borderRadius: 3,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.85rem', color: '#666' }}>
                <span>{Math.floor((progress / 100) * 180)}:{Math.floor(((progress / 100) * 60) % 60).toString().padStart(2, '0')}</span>
                <span>{currentSongData.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
              <motion.button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSong((currentSong - 1 + songs.length) % songs.length)}
              >
                ⏮
              </motion.button>

              <motion.button
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${currentSongData.color}, ${currentSongData.color}cc)`,
                  border: 'none',
                  color: '#fff',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 10px 40px ${currentSongData.color}50`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸' : '▶️'}
              </motion.button>

              <motion.button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentSong((currentSong + 1) % songs.length)}
              >
                ⏭
              </motion.button>
            </div>

            {/* Volume Control */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
              <span style={{ fontSize: '1.2rem' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${currentSongData.color} ${(volume / 100) * 100}%, rgba(255,255,255,0.1) ${(volume / 100) * 100}%)`,
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '1.2rem' }}>🔊</span>
            </div>
          </motion.div>

          {/* Playlist */}
          <motion.div
            style={{
              width: 300,
              background: 'rgba(20, 20, 30, 0.8)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 20,
              backdropFilter: 'blur(10px)',
              maxHeight: 520,
              overflowY: 'auto',
            }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h4 style={{ fontSize: '1rem', color: '#888', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Playlist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {songs.map((song, index) => (
                <motion.div
                  key={index}
                  style={{
                    padding: 15,
                    borderRadius: 12,
                    background: index === currentSong ? `linear-gradient(135deg, ${song.color}22, ${song.color}11)` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${index === currentSong ? `${song.color}40` : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  whileHover={{ scale: 1.02, background: index === currentSong ? `linear-gradient(135deg, ${song.color}33, ${song.color}22)` : 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentSong(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${song.color}, ${song.color}66)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {index === currentSong && isPlaying ? (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        🎵
                      </motion.span>
                    ) : '🎵'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 2, color: index === currentSong ? song.color : '#fff' }}>{song.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{song.artist}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{song.duration}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
