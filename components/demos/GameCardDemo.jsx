'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function GameCardDemo() {
  const [gameId, setGameId] = React.useState(1);
  const [hoveredGame, setHoveredGame] = React.useState(null);
  const [isOnline, setIsOnline] = React.useState(true);

  const games = [
    { id: 1, title: 'Cyber Legends', genre: 'Action RPG', rating: 4.8, cover: '🎮', color: '#667eea', achievements: 45, players: '2.1M', level: 47, xp: 78, friendsOnline: 5, lastPlayed: '2h ago' },
    { id: 2, title: 'Stellar Quest', genre: 'Space Adventure', rating: 4.9, cover: '🚀', color: '#764ba2', achievements: 62, players: '1.8M', level: 23, xp: 42, friendsOnline: 2, lastPlayed: '1d ago' },
    { id: 3, title: 'Shadow Ninja', genre: 'Stealth Action', rating: 4.7, cover: '⚔️', color: '#f093fb', achievements: 38, players: '3.2M', level: 65, xp: 91, friendsOnline: 8, lastPlayed: '5h ago' },
  ];

  const selectedGame = games.find(g => g.id === gameId);

  return (
    <>
      <h2 className="demo-title">Game Card</h2>
      <p className="demo-subtitle">Game showcase with cover art, ratings, genre tags, achievements tracker, and instant play action.</p>
      <div className="demo-area" style={{ position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 350, height: 350, background: `radial-gradient(circle, ${selectedGame.color}20 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, flex: 1 }}>
            <AnimatePresence>
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredGame(game.id)}
                  onHoverEnd={() => setHoveredGame(null)}
                  onClick={() => setGameId(game.id)}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: gameId === game.id ? `linear-gradient(135deg, ${game.color}20, ${game.color}10)` : 'rgba(255,255,255,0.03)',
                    border: gameId === game.id ? `2px solid ${game.color}` : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${game.color}, ${game.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      marginBottom: 16,
                      position: 'relative',
                    }}
                    animate={{ scale: hoveredGame === game.id ? 1.05 : 1 }}
                  >
                    {game.cover}
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span style={{ color: '#ffd700' }}>★</span>
                      {game.rating}
                    </motion.div>
                  </motion.div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>{game.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: `${game.color}20`,
                      color: game.color,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>{game.genre}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                    <span>🏆 {game.achievements} Achievements</span>
                    <span>👥 {game.players}</span>
                  </div>
                  {hoveredGame === game.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: `0 4px 20px ${game.color}40`,
                      }}
                    >
                      ▶
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            key={gameId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              width: 320,
              padding: 25,
              borderRadius: 20,
              background: 'rgba(20, 20, 35, 0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Now Playing</h3>
            <motion.div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${selectedGame.color}, ${selectedGame.color}40)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                marginBottom: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {selectedGame.cover}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 20,
                }}
              >
                <motion.button
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ▶
                </motion.button>
              </motion.div>
            </motion.div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>{selectedGame.title}</h4>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{selectedGame.genre}</p>
            </div>
            {/* XP Progress */}
            <div style={{ marginBottom: 16, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${selectedGame.color}, ${selectedGame.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, boxShadow: `0 0 15px ${selectedGame.color}40` }}
                    animate={{ boxShadow: [`0 0 10px ${selectedGame.color}30`, `0 0 20px ${selectedGame.color}50`, `0 0 10px ${selectedGame.color}30`] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    {selectedGame.level}
                  </motion.div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Level {selectedGame.level}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{selectedGame.xp}% to next</span>
              </div>
              <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: `linear-gradient(90deg, ${selectedGame.color}, ${selectedGame.color}80)`, boxShadow: `0 0 10px ${selectedGame.color}60` }}
                  initial={{ width: 0 }} animate={{ width: `${selectedGame.xp}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ color: '#888' }}>Achievements</span>
                <span style={{ color: selectedGame.color, fontWeight: 600 }}>28/{selectedGame.achievements}</span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                <motion.div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${selectedGame.color}, ${selectedGame.color}cc)`, boxShadow: `0 0 10px ${selectedGame.color}50` }}
                  initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Play Time', value: '127h', icon: '⏱️' },
                { label: 'Rank', value: '#4,231', icon: '🏆' },
              ].map((stat, i) => (
                <motion.div key={i} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.06)', borderColor: `${selectedGame.color}30` }}>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{stat.icon}</span> {stat.label}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Friends online */}
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(67, 233, 123, 0.08)', border: '1px solid rgba(67, 233, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex' }}>
                  {[...Array(Math.min(3, selectedGame.friendsOnline))].map((_, i) => (
                    <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${['#667eea', '#f093fb', '#43e97b'][i]}, ${['#667eea', '#f093fb', '#43e97b'][i]}80)`, border: '2px solid rgba(20, 20, 35, 1)', marginLeft: i > 0 ? -8 : 0 }} />
                  ))}
                  {selectedGame.friendsOnline > 3 && (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(20, 20, 35, 1)', marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
                      +{selectedGame.friendsOnline - 3}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#43e97b', fontWeight: 600 }}>{selectedGame.friendsOnline} friends online</span>
              </div>
              <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: '#43e97b' }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
