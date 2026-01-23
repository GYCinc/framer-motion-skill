'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function PodcastPlayerDemo() {
  const [currentEpisode, setCurrentEpisode] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const [progress, setProgress] = React.useState(15);
  const [currentChapter, setCurrentChapter] = React.useState(1);
  const [bookmarked, setBookmarked] = React.useState({});
  const [showNotes, setShowNotes] = React.useState(false);
  const [volume, setVolume] = React.useState(80);

  const episodes = [
    {
      id: 1, title: 'The Future of AI', show: 'Tech Horizons', host: 'Sarah Chen',
      date: 'Jan 15, 2024', duration: '45:32', listens: '124K', color: '#667eea', cover: '🤖',
      description: 'Exploring the cutting edge of artificial intelligence and its impact on society. We dive deep into machine learning, neural networks, and the ethical implications of AI development.',
      notes: 'Links mentioned:\n• OpenAI GPT-4 Paper\n• AI Safety Research Institute\n• "Life 3.0" by Max Tegmark\n\nKey takeaways:\n1. AI alignment is crucial\n2. Transparency in AI development\n3. Regulation vs Innovation balance',
      chapters: [
        { time: '0:00', title: 'Introduction', pct: 0 },
        { time: '5:20', title: 'Current State of AI', pct: 12 },
        { time: '18:45', title: 'Ethical Considerations', pct: 41 },
        { time: '32:10', title: 'Future Predictions', pct: 71 },
        { time: '40:00', title: 'Q&A Session', pct: 88 },
      ],
    },
    {
      id: 2, title: 'Climate Solutions', show: 'Earth Forward', host: 'Dr. James Wu',
      date: 'Jan 8, 2024', duration: '52:18', listens: '98K', color: '#43e97b', cover: '🌍',
      description: 'Innovative technologies and policies addressing climate change. From carbon capture to renewable energy breakthroughs.',
      notes: 'Resources:\n• IPCC Report 2024\n• Project Drawdown\n• Carbon Brief\n\nAction items:\n1. Calculate your carbon footprint\n2. Support green initiatives\n3. Vote for climate-conscious leaders',
      chapters: [
        { time: '0:00', title: 'Introduction', pct: 0 },
        { time: '8:30', title: 'Renewable Energy', pct: 16 },
        { time: '22:15', title: 'Carbon Capture', pct: 43 },
        { time: '35:40', title: 'Policy Changes', pct: 68 },
        { time: '45:00', title: 'Action Steps', pct: 86 },
      ],
    },
    {
      id: 3, title: 'Space Exploration', show: 'Cosmic Journey', host: 'Dr. Maya Patel',
      date: 'Jan 1, 2024', duration: '38:45', listens: '156K', color: '#764ba2', cover: '🚀',
      description: 'The latest developments in space travel and discovery. Mars missions, moon bases, and the future of humanity among the stars.',
      notes: 'Topics covered:\n• Artemis Program\n• SpaceX Starship\n• James Webb discoveries\n\nFun facts:\n1. Mars is 225 million km away\n2. ISS orbits at 28,000 km/h\n3. Moon is 384,400 km from Earth',
      chapters: [
        { time: '0:00', title: 'Introduction', pct: 0 },
        { time: '6:15', title: 'Mars Mission', pct: 16 },
        { time: '20:30', title: 'Moon Base', pct: 53 },
        { time: '30:00', title: 'Commercial Space', pct: 77 },
      ],
    },
  ];

  const episode = episodes[currentEpisode];
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const waveformBars = 50;

  React.useEffect(() => {
    let interval;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(100, prev + 0.2 * playbackSpeed));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, playbackSpeed]);

  // Update current chapter based on progress
  React.useEffect(() => {
    const chapters = episode.chapters;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (progress >= chapters[i].pct) {
        setCurrentChapter(i);
        break;
      }
    }
  }, [progress, currentEpisode]);

  const formatTime = (pct) => {
    const totalSec = (pct / 100) * (parseInt(episode.duration.split(':')[0]) * 60 + parseInt(episode.duration.split(':')[1]));
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const skipTime = (seconds) => {
    const totalSec = parseInt(episode.duration.split(':')[0]) * 60 + parseInt(episode.duration.split(':')[1]);
    const currentSec = (progress / 100) * totalSec;
    const newSec = Math.max(0, Math.min(totalSec, currentSec + seconds));
    setProgress((newSec / totalSec) * 100);
  };

  return (
    <>
      <h2 className="demo-title">Podcast Player</h2>
      <p className="demo-subtitle">Premium podcast player with waveform visualization, chapter navigation, show notes, bookmarks, and playback controls.</p>
      <div className="demo-area" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Dynamic ambient glow */}
        <motion.div
          animate={{ background: `radial-gradient(circle at 70% 30%, ${episode.color}20 0%, transparent 50%)` }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        />

        <div style={{ display: 'flex', gap: 30, width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1 }}>
          {/* Episode List */}
          <div style={{ width: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.3rem' }}>🎙️</span> Episodes
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>{episodes.length} episodes</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {episodes.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  onClick={() => { setCurrentEpisode(i); setProgress(0); }}
                  style={{
                    padding: 14, borderRadius: 14,
                    background: currentEpisode === i ? `linear-gradient(135deg, ${ep.color}20, ${ep.color}10)` : 'rgba(255,255,255,0.03)',
                    border: currentEpisode === i ? `1px solid ${ep.color}50` : '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer', display: 'flex', gap: 12,
                  }}
                  whileHover={{ scale: 1.01, background: currentEpisode === i ? `linear-gradient(135deg, ${ep.color}25, ${ep.color}15)` : 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Episode cover */}
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: `linear-gradient(135deg, ${ep.color}, ${ep.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                    {ep.cover}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ep.title}
                      </div>
                      {currentEpisode === i && isPlaying && (
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          {[0, 1, 2].map(b => (
                            <motion.div key={b} style={{ width: 3, background: ep.color, borderRadius: 1 }} animate={{ height: [4, 12, 4] }} transition={{ duration: 0.4, delay: b * 0.1, repeat: Infinity }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: 6 }}>{ep.show} • {ep.host}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.7rem', color: '#666' }}>
                      <span>{ep.date}</span>
                      <span>•</span>
                      <span>{ep.duration}</span>
                      <span>•</span>
                      <span>👂 {ep.listens}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Player */}
          <div style={{ flex: 1 }}>
            <motion.div
              key={currentEpisode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: 24, borderRadius: 20, background: 'rgba(20, 20, 35, 0.9)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 15 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <motion.div
                  style={{ width: 80, height: 80, borderRadius: 14, background: `linear-gradient(135deg, ${episode.color}, ${episode.color}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0, boxShadow: `0 10px 30px ${episode.color}40` }}
                  animate={{ scale: isPlaying ? [1, 1.03, 1] : 1 }}
                  transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                >
                  {episode.cover}
                </motion.div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: episode.color, marginBottom: 4, fontWeight: 600 }}>{episode.show}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>{episode.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>Hosted by {episode.host}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    onClick={() => setBookmarked(prev => ({ ...prev, [episode.id]: !prev[episode.id] }))}
                    style={{ width: 36, height: 36, borderRadius: 10, background: bookmarked[episode.id] ? `${episode.color}30` : 'rgba(255,255,255,0.05)', border: bookmarked[episode.id] ? `1px solid ${episode.color}` : '1px solid rgba(255,255,255,0.1)', color: bookmarked[episode.id] ? episode.color : '#888', cursor: 'pointer', fontSize: '1rem' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >🔖</motion.button>
                  <motion.button
                    style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888', cursor: 'pointer', fontSize: '1rem' }}
                    whileHover={{ scale: 1.1, color: '#fff' }}
                    whileTap={{ scale: 0.9 }}
                  >⬇️</motion.button>
                </div>
              </div>

              {/* Waveform visualization */}
              <div style={{ marginBottom: 15, padding: '10px 0' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: 50, cursor: 'pointer' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = ((e.clientX - rect.left) / rect.width) * 100;
                    setProgress(Math.max(0, Math.min(100, pct)));
                  }}
                >
                  {[...Array(waveformBars)].map((_, i) => {
                    const barPct = (i / waveformBars) * 100;
                    const isPast = barPct <= progress;
                    const baseHeight = 10 + Math.sin(i * 0.5) * 20 + Math.random() * 15;
                    return (
                      <motion.div
                        key={i}
                        style={{ width: 4, borderRadius: 2, background: isPast ? episode.color : 'rgba(255,255,255,0.15)' }}
                        animate={{ height: isPlaying && isPast ? [baseHeight, baseHeight * 1.3, baseHeight] : baseHeight }}
                        transition={{ duration: 0.3, delay: i * 0.01, repeat: isPlaying && isPast ? Infinity : 0 }}
                      />
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: '#888' }}>
                  <span>{formatTime(progress)}</span>
                  <span style={{ color: episode.color }}>{episode.chapters[currentChapter]?.title}</span>
                  <span>{episode.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                <motion.button onClick={() => skipTime(-30)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }} whileHover={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} whileTap={{ scale: 0.95 }}>
                  -30s
                </motion.button>

                <motion.button onClick={() => setCurrentEpisode(prev => Math.max(0, prev - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer', padding: 8 }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>⏮</motion.button>

                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${episode.color}, ${episode.color}cc)`, border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  whileHover={{ scale: 1.1, boxShadow: `0 8px 30px ${episode.color}50` }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? '⏸' : '▶️'}
                </motion.button>

                <motion.button onClick={() => setCurrentEpisode(prev => Math.min(episodes.length - 1, prev + 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer', padding: 8 }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>⏭</motion.button>

                <motion.button onClick={() => skipTime(30)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', color: '#888', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }} whileHover={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} whileTap={{ scale: 0.95 }}>
                  +30s
                </motion.button>
              </div>

              {/* Speed & Volume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Speed</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {speeds.map((speed) => (
                      <motion.button key={speed} onClick={() => setPlaybackSpeed(speed)}
                        style={{ padding: '4px 10px', borderRadius: 6, background: playbackSpeed === speed ? `${episode.color}30` : 'rgba(255,255,255,0.03)', border: playbackSpeed === speed ? `1px solid ${episode.color}50` : '1px solid rgba(255,255,255,0.08)', color: playbackSpeed === speed ? episode.color : '#888', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >{speed}x</motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.9rem' }}>{volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative' }} onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100)); }}>
                    <div style={{ width: `${volume}%`, height: '100%', borderRadius: 2, background: episode.color }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chapters & Notes Toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              <motion.button onClick={() => setShowNotes(false)} style={{ flex: 1, padding: '10px 15px', borderRadius: 10, background: !showNotes ? `${episode.color}20` : 'rgba(255,255,255,0.03)', border: !showNotes ? `1px solid ${episode.color}50` : '1px solid rgba(255,255,255,0.05)', color: !showNotes ? episode.color : '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }} whileHover={{ scale: 1.02 }}>
                Chapters ({episode.chapters.length})
              </motion.button>
              <motion.button onClick={() => setShowNotes(true)} style={{ flex: 1, padding: '10px 15px', borderRadius: 10, background: showNotes ? `${episode.color}20` : 'rgba(255,255,255,0.03)', border: showNotes ? `1px solid ${episode.color}50` : '1px solid rgba(255,255,255,0.05)', color: showNotes ? episode.color : '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }} whileHover={{ scale: 1.02 }}>
                Show Notes
              </motion.button>
            </div>

            {/* Chapters or Notes Content */}
            <AnimatePresence mode="wait">
              {!showNotes ? (
                <motion.div key="chapters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: 16, borderRadius: 14, background: 'rgba(20, 20, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {episode.chapters.map((chapter, i) => {
                      const isActive = currentChapter === i;
                      const isPast = progress >= chapter.pct;
                      return (
                        <motion.div
                          key={i}
                          onClick={() => setProgress(chapter.pct)}
                          style={{ padding: 12, borderRadius: 10, background: isActive ? `${episode.color}15` : 'rgba(255,255,255,0.02)', border: isActive ? `1px solid ${episode.color}40` : '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                          whileHover={{ background: isActive ? `${episode.color}20` : 'rgba(255,255,255,0.05)' }}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: isPast ? episode.color : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: isPast ? '#fff' : '#666' }}>
                            {isPast ? '✓' : i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, color: isActive ? '#fff' : '#bbb' }}>{chapter.title}</div>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>{chapter.time}</div>
                          {isActive && isPlaying && (
                            <div style={{ display: 'flex', gap: 2 }}>
                              {[0, 1, 2].map(b => (
                                <motion.div key={b} style={{ width: 2, background: episode.color, borderRadius: 1 }} animate={{ height: [4, 10, 4] }} transition={{ duration: 0.3, delay: b * 0.08, repeat: Infinity }} />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: 18, borderRadius: 14, background: 'rgba(20, 20, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.8, marginBottom: 15, whiteSpace: 'pre-line' }}>{episode.description}</p>
                  <div style={{ padding: 14, borderRadius: 10, background: `${episode.color}10`, border: `1px solid ${episode.color}30` }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 10, color: episode.color }}>📝 Episode Notes</h5>
                    <pre style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{episode.notes}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
