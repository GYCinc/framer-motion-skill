'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function ScoreBoardDemo() {
  const [teams, setTeams] = React.useState([
    { id: 1, name: 'Thunder Hawks', logo: '⚡', score: 2450, wins: 12, losses: 3, trend: 'up', change: +150, streak: 5, kills: 324, assists: 489, avgKDA: 4.2 },
    { id: 2, name: 'Fire Storm', logo: '🔥', score: 2380, wins: 11, losses: 4, trend: 'down', change: -80, streak: 2, kills: 298, assists: 412, avgKDA: 3.8 },
    { id: 3, name: 'Ice Dragons', logo: '🐉', score: 2290, wins: 10, losses: 5, trend: 'up', change: +120, streak: 3, kills: 276, assists: 398, avgKDA: 3.5 },
    { id: 4, name: 'Shadow Wolves', logo: '🐺', score: 2150, wins: 9, losses: 6, trend: 'neutral', change: 0, streak: 0, kills: 245, assists: 356, avgKDA: 3.1 },
    { id: 5, name: 'Golden Lions', logo: '🦁', score: 2080, wins: 8, losses: 7, trend: 'up', change: +90, streak: 4, kills: 223, assists: 334, avgKDA: 2.9 },
    { id: 6, name: 'Storm Raiders', logo: '⛈️', score: 1950, wins: 7, losses: 8, trend: 'down', change: -45, streak: 1, kills: 198, assists: 289, avgKDA: 2.6 },
    { id: 7, name: 'Phoenix Squad', logo: '🦅', score: 1820, wins: 6, losses: 9, trend: 'up', change: +65, streak: 2, kills: 167, assists: 256, avgKDA: 2.3 },
  ]);

  const [liveMatches, setLiveMatches] = React.useState([
    { id: 1, home: 'Thunder Hawks', away: 'Fire Storm', homeScore: 3, awayScore: 2, time: '78\'', status: 'live', possession: 62, homeShotsOnTarget: 8, awayShotsOnTarget: 5 },
    { id: 2, home: 'Ice Dragons', away: 'Shadow Wolves', homeScore: 1, awayScore: 1, time: '62\'', status: 'live', possession: 48, homeShotsOnTarget: 4, awayShotsOnTarget: 6 },
    { id: 3, home: 'Golden Lions', away: 'Storm Raiders', homeScore: 2, awayScore: 0, time: '45\'', status: 'live', possession: 55, homeShotsOnTarget: 7, awayShotsOnTarget: 2 },
  ]);

  const [selectedMatch, setSelectedMatch] = React.useState(liveMatches[0]);
  const [hoveredTeam, setHoveredTeam] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('list'); // 'list' or 'stats'
  const [scoreEvents, setScoreEvents] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatches(prev => prev.map(match => {
        const newHomeScore = Math.random() > 0.92 ? match.homeScore + 1 : match.homeScore;
        const newAwayScore = Math.random() > 0.92 ? match.awayScore + 1 : match.awayScore;

        // Track score events
        if (newHomeScore !== match.homeScore || newAwayScore !== match.awayScore) {
          setScoreEvents(events => [...events, { matchId: match.id, time: Date.now() }]);
          setTimeout(() => setScoreEvents(events => events.filter(e => Date.now() - e.time < 3000)), 3000);
        }

        return {
          ...match,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          time: `${Math.min(parseInt(match.time) + 1, 90)}'`,
          possession: Math.max(35, Math.min(65, match.possession + (Math.random() - 0.5) * 8)),
          homeShotsOnTarget: Math.random() > 0.8 ? match.homeShotsOnTarget + 1 : match.homeShotsOnTarget,
          awayShotsOnTarget: Math.random() > 0.8 ? match.awayShotsOnTarget + 1 : match.awayShotsOnTarget,
        };
      }));

      // Dynamically update team scores
      setTeams(prevTeams => prevTeams.map(team => ({
        ...team,
        change: Math.random() > 0.7 ? (Math.random() > 0.5 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 50)) : team.change,
      })));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const podiumColors = ['#fbbf24', '#94a3b8', '#b45309'];
  const podiumGradients = [
    'linear-gradient(180deg, rgba(251, 191, 36, 0.35), rgba(251, 191, 36, 0.1))',
    'linear-gradient(180deg, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.08))',
    'linear-gradient(180deg, rgba(180, 83, 9, 0.3), rgba(180, 83, 9, 0.08))',
  ];

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
      {/* Ambient effects */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ width: '100%', maxWidth: 1450, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 26, position: 'relative', zIndex: 1 }}
      >
        {/* Left Column - Leaderboard */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
          style={{
            padding: 32, borderRadius: 28,
            background: 'rgba(15, 15, 30, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Leaderboard
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Season 2026 • Week 3</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* View Toggle */}
              <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: viewMode === 'list' ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'transparent',
                    color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 List
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('stats')}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: viewMode === 'stats' ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'transparent',
                    color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                >
                  📈 Stats
                </motion.button>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  padding: '12px 22px', borderRadius: 30,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.2))',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}
                />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e' }}>LIVE</span>
              </motion.div>
            </div>
          </div>

          {/* Podium - Enhanced */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14, marginBottom: 36, height: 200, padding: '0 20px' }}>
            {[1, 0, 2].map((position, displayIndex) => {
              const team = sortedTeams[position];
              const heights = [160, 200, 120];
              const widths = [110, 130, 110];
              return (
                <motion.div
                  key={position}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: heights[position], opacity: 1 }}
                  transition={{ delay: 0.3 + displayIndex * 0.15, type: 'spring', stiffness: 60 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  style={{
                    width: widths[position], display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: podiumGradients[position],
                    borderRadius: '18px 18px 0 0',
                    border: `2px solid ${podiumColors[position]}50`,
                    boxShadow: `0 -10px 40px ${podiumColors[position]}20`,
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Shine effect */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

                  {position === 0 && (
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ fontSize: '2.5rem', marginTop: 12 }}
                    >
                      👑
                    </motion.div>
                  )}
                  <motion.div
                    style={{ fontSize: position === 0 ? '2.8rem' : '2.2rem', marginTop: position === 0 ? 8 : 16 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, delay: position * 0.5, repeat: Infinity }}
                  >
                    {team?.logo}
                  </motion.div>
                  <div style={{ fontSize: position === 0 ? '1rem' : '0.85rem', fontWeight: 700, marginTop: 8, textAlign: 'center', padding: '0 8px' }}>{team?.name}</div>
                  <div style={{ fontSize: position === 0 ? '1.4rem' : '1.1rem', fontWeight: 800, color: podiumColors[position], marginTop: 4 }}>{team?.score}</div>
                  <motion.div
                    style={{
                      marginTop: 'auto', width: '100%', padding: position === 0 ? 14 : 10, textAlign: 'center',
                      background: `${podiumColors[position]}30`,
                      fontSize: position === 0 ? '2rem' : '1.5rem', fontWeight: 800,
                    }}
                  >
                    {position + 1}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Rankings - Enhanced with Stats View */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Full Rankings</h3>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{teams.length} teams</span>
            </div>
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {sortedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ delay: index * 0.05, type: 'spring' }}
                      onHoverStart={() => setHoveredTeam(team.id)}
                      onHoverEnd={() => setHoveredTeam(null)}
                      whileHover={{ scale: 1.02, x: 8 }}
                      style={{
                        padding: 18, borderRadius: 16,
                        background: hoveredTeam === team.id
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(139, 92, 246, 0.1))'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${hoveredTeam === team.id ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                        display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <motion.div
                        style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: index < 3 ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.1rem', fontWeight: 800,
                          boxShadow: index < 3 ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none',
                        }}
                      >
                        {index + 1}
                      </motion.div>
                      <motion.div
                        style={{ fontSize: '2.2rem' }}
                        animate={hoveredTeam === team.id ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {team.logo}
                      </motion.div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{team.name}</span>
                          {team.streak >= 3 && (
                            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 6, background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontWeight: 600 }}>
                              🔥 {team.streak}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 12 }}>
                          <span style={{ color: '#22c55e' }}>{team.wins}W</span>
                          <span style={{ color: '#ef4444' }}>{team.losses}L</span>
                          <span>{((team.wins / (team.wins + team.losses)) * 100).toFixed(0)}% WR</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{team.score.toLocaleString()}</div>
                        <motion.div
                          style={{
                            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end',
                            color: team.change > 0 ? '#22c55e' : team.change < 0 ? '#ef4444' : 'rgba(255,255,255,0.3)',
                            fontWeight: 600,
                          }}
                          animate={team.change !== 0 ? { y: [0, -3, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {team.change > 0 && '↑'}
                          {team.change < 0 && '↓'}
                          {team.change !== 0 ? `${Math.abs(team.change)}` : '—'}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {sortedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        padding: 18, borderRadius: 16,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: index < 3 ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.9rem', fontWeight: 800,
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ fontSize: '1.8rem' }}>{team.logo}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{team.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                            {team.score.toLocaleString()} pts
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        <div style={{ padding: 10, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 10, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>KDA</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{team.avgKDA}</div>
                        </div>
                        <div style={{ padding: 10, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 10, border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Kills</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#667eea' }}>{team.kills}</div>
                        </div>
                        <div style={{ padding: 10, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 10, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Assists</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8b5cf6' }}>{team.assists}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column - Live Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Featured Live Match - Premium */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 80 }}
            style={{
              padding: 0, borderRadius: 28, overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.15))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.25)',
              boxShadow: '0 15px 50px rgba(102, 126, 234, 0.15)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Featured Match</h3>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  padding: '10px 18px', borderRadius: 25,
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 12px #ef4444' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>LIVE</span>
              </motion.div>
            </div>

            {/* Match Content */}
            <div style={{ padding: 28 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMatch.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    {/* Home Team */}
                    <motion.div style={{ textAlign: 'center', flex: 1 }} whileHover={{ scale: 1.05 }}>
                      <motion.div
                        style={{ fontSize: '4rem', marginBottom: 12 }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {teams.find(t => t.name === selectedMatch.home)?.logo}
                      </motion.div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedMatch.home}</div>
                    </motion.div>

                    {/* Score */}
                    <div style={{ textAlign: 'center', padding: '0 24px' }}>
                      <motion.div
                        style={{
                          fontSize: '4rem', fontWeight: 900, letterSpacing: -2,
                          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.8))',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                          textShadow: '0 4px 30px rgba(102, 126, 234, 0.3)',
                        }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {selectedMatch.homeScore} : {selectedMatch.awayScore}
                      </motion.div>
                      <motion.div
                        style={{
                          marginTop: 12, padding: '10px 24px', borderRadius: 14,
                          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
                          fontSize: '1.2rem', fontWeight: 700, display: 'inline-block',
                        }}
                      >
                        ⏱️ {selectedMatch.time}
                      </motion.div>
                    </div>

                    {/* Away Team */}
                    <motion.div style={{ textAlign: 'center', flex: 1 }} whileHover={{ scale: 1.05 }}>
                      <motion.div
                        style={{ fontSize: '4rem', marginBottom: 12 }}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      >
                        {teams.find(t => t.name === selectedMatch.away)?.logo}
                      </motion.div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedMatch.away}</div>
                    </motion.div>
                  </div>

                  {/* Match Stats */}
                  <div style={{ marginTop: 24 }}>
                    {/* Possession Bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                        <span>{selectedMatch.possession.toFixed(0)}%</span>
                        <span style={{ fontWeight: 600 }}>Possession</span>
                        <span>{(100 - selectedMatch.possession).toFixed(0)}%</span>
                      </div>
                      <div style={{ height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <motion.div
                          animate={{ width: `${selectedMatch.possession}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, #667eea, #8b5cf6)', position: 'relative' }}
                        >
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Shots on Target */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', padding: 12, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 12, border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#667eea', marginBottom: 4 }}>{selectedMatch.homeShotsOnTarget}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Shots</div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>ON TARGET</div>
                      <div style={{ textAlign: 'center', padding: 12, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginBottom: 4 }}>{selectedMatch.awayShotsOnTarget}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Shots</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Other Live Matches */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 80 }}
            style={{
              padding: 26, borderRadius: 24,
              background: 'rgba(15, 15, 30, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>All Live Matches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {liveMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: 18, borderRadius: 16, cursor: 'pointer',
                    background: selectedMatch.id === match.id
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.15))'
                      : 'rgba(255,255,255,0.03)',
                    border: selectedMatch.id === match.id
                      ? '2px solid rgba(102, 126, 234, 0.35)'
                      : '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: selectedMatch.id === match.id ? '0 8px 25px rgba(102, 126, 234, 0.15)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.8rem' }}>{teams.find(t => t.name === match.home)?.logo}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{match.home.split(' ')[0]}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>{match.homeScore} - {match.awayScore}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{match.time}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{match.away.split(' ')[0]}</span>
                    <span style={{ fontSize: '1.8rem' }}>{teams.find(t => t.name === match.away)?.logo}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Summary - Enhanced */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, type: 'spring', stiffness: 80 }}
            style={{
              padding: 26, borderRadius: 24,
              background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              boxShadow: '0 10px 35px rgba(34, 197, 94, 0.12)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 18 }}>Today's Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { icon: '🏆', value: teams.length, label: 'Teams', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
                { icon: '⚡', value: liveMatches.length, label: 'Live', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
                { icon: '🎯', value: teams.reduce((s, t) => s + t.wins, 0), label: 'Total Wins', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
                { icon: '🔥', value: Math.max(...teams.map(t => t.score)).toLocaleString(), label: 'Top Score', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 100 }}
                  style={{
                    textAlign: 'center', padding: 16, borderRadius: 14,
                    background: stat.bg,
                    border: `1px solid ${stat.color}40`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color, marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Additional Mini Stats */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Avg KDA', value: (teams.reduce((sum, t) => sum + t.avgKDA, 0) / teams.length).toFixed(1), color: '#667eea' },
                { label: 'Total Kills', value: teams.reduce((sum, t) => sum + t.kills, 0), color: '#8b5cf6' },
                { label: 'Streaks', value: teams.filter(t => t.streak >= 3).length, color: '#fbbf24' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    flex: 1, minWidth: 80,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
