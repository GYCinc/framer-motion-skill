'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function LeaderboardDemo() {
  const [period, setPeriod] = React.useState('weekly');
  const [leaderboard, setLeaderboard] = React.useState([
    { id: 1, name: 'Alex Thompson', avatar: '👨‍💻', score: 28450, trend: 'up', change: 12, color: '#FFD700' },
    { id: 2, name: 'Sarah Chen', avatar: '👩‍🎨', score: 26820, trend: 'up', change: 8, color: '#C0C0C0' },
    { id: 3, name: 'Marcus Johnson', avatar: '🧑‍🚀', score: 25100, trend: 'down', change: -3, color: '#CD7F32' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🔬', score: 23450, trend: 'up', change: 5, color: '#667eea' },
    { id: 5, name: 'Jordan Lee', avatar: '🧑‍🎤', score: 21890, trend: 'same', change: 0, color: '#764ba2' },
    { id: 6, name: 'Mike Johnson', avatar: '👨‍🎨', score: 20340, trend: 'up', change: 15, color: '#f093fb' },
    { id: 7, name: 'Lisa Park', avatar: '👩‍💼', score: 19780, trend: 'down', change: -2, color: '#43e97b' },
    { id: 8, name: 'David Kim', avatar: '👨‍🔬', score: 18920, trend: 'up', change: 4, color: '#4facfe' },
  ]);
  const TrendIcon = ({ trend, change }) => {
    if (trend === 'up') return React.createElement('span', { style: { color: '#22c55e', fontSize: '0.9rem' } }, `↑ ${change}`);
    if (trend === 'down') return React.createElement('span', { style: { color: '#ef4444', fontSize: '0.9rem' } }, `↓ ${Math.abs(change)}`);
    return React.createElement('span', { style: { color: '#888', fontSize: '0.9rem' } }, '-');
  };
  return (
    <>
      <h2 className="demo-title">Leaderboard</h2>
      <p className="demo-subtitle">Competitive rankings with scores, trends, avatars, and animated positions</p>
      <div className="demo-area" style={{ gap: 40 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {['daily', 'weekly', 'monthly', 'all-time'].map((p) => <motion.button key={p} onClick={() => setPeriod(p)} style={{ padding: '10px 20px', borderRadius: 25, background: period === p ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)', border: period === p ? 'none' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{p.replace('-', ' ')}</motion.button>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
          {[{ ...leaderboard[1], position: 2, height: 140 }, { ...leaderboard[0], position: 1, height: 180 }, { ...leaderboard[2], position: 3, height: 100 }].map((user) => (
            <motion.div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: user.position * 0.1, type: 'spring', stiffness: 200 }}>
              <motion.div style={{ width: 40, height: 40, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: user.position <= 3 ? '#000' : '#fff', boxShadow: `0 4px 20px ${user.color}66` }} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: user.position * 0.2 }}>{user.position === 1 ? '👑' : user.position}</motion.div>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: user.position === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : user.position === 2 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' : 'linear-gradient(135deg, #CD7F32, #B87233)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: `4px solid ${user.color}`, boxShadow: `0 8px 30px ${user.color}66` }}>{user.avatar}</div>
              <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{user.name}</div><div style={{ fontSize: '0.8rem', color: user.trend === 'up' ? '#22c55e' : user.trend === 'down' ? '#ef4444' : '#888' }}>{user.score.toLocaleString()} pts</div></div>
              <motion.div style={{ width: 100, height: user.height, borderRadius: '12px 12px 0 0', background: `linear-gradient(180deg, ${user.color}88, ${user.color}22)`, border: '2px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 15 }} whileHover={{ scaleY: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}><TrendIcon trend={user.trend} change={user.change} /></motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div style={{ width: '100%', maxWidth: 500, background: 'rgba(20, 20, 30, 0.9)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
              {leaderboard.map((user, index) => (
                <motion.div key={user.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '12px 20px', borderRadius: 12, background: index < 3 ? `${user.color}11` : 'rgba(255,255,255,0.02)', margin: '0 10px', border: index < 3 ? `1px solid ${user.color}33` : '1px solid transparent' }} whileHover={{ scale: 1.02, background: index < 3 ? `${user.color}22` : 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.98 }}>
                  <div style={{ width: 35, textAlign: 'center' }}>{index < 3 ? React.createElement('div', { style: { width: 32, height: 32, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 } }, index + 1) : React.createElement('span', { style: { fontSize: '1.1rem', fontWeight: 600, color: '#888' } }, `#${index + 1}`)}</div>
                  <div style={{ width: 45, height: 45, borderRadius: '50%', background: index < 3 ? `linear-gradient(135deg, ${user.color}, ${user.color}66)` : 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: index < 3 ? `2px solid ${user.color}` : 'none' }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>{user.name}</div><div style={{ fontSize: '0.8rem', color: index < 3 ? user.color : '#888' }}>{user.score.toLocaleString()} points</div></div>
                  <motion.div style={{ padding: '6px 12px', borderRadius: 20, background: user.trend === 'up' ? 'rgba(34, 197, 94, 0.15)' : user.trend === 'down' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 4 }} whileHover={{ scale: 1.05 }}><TrendIcon trend={user.trend} change={user.change} /></motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
