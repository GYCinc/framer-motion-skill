'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function MovieCardDemo() {
  const [selectedMovie, setSelectedMovie] = React.useState(0);
  const [showTrailer, setShowTrailer] = React.useState(false);

  const movies = [
    {
      id: 1,
      title: 'The Last Horizon',
      year: 2024,
      genre: 'Sci-Fi',
      rating: 8.9,
      runtime: '2h 34m',
      poster: '🎬',
      color: '#667eea',
      cast: ['Emma Stone', 'John David', 'Zoe Chen'],
      synopsis: 'In a future where humanity has spread across the stars, a lone pilot discovers a secret that could change everything.',
    },
    {
      id: 2,
      title: 'Midnight Shadows',
      year: 2023,
      genre: 'Thriller',
      rating: 8.5,
      runtime: '1h 58m',
      poster: '🌙',
      color: '#764ba2',
      cast: ['Oscar Isaac', 'Florence Pugh'],
      synopsis: 'A detective uncovers a conspiracy that reaches the highest levels of power.',
    },
    {
      id: 3,
      title: 'Ocean\'s Echo',
      year: 2024,
      genre: 'Drama',
      rating: 9.1,
      runtime: '2h 12m',
      poster: '🌊',
      color: '#4facfe',
      cast: ['Timothée Chalamet', 'Zendaya'],
      synopsis: 'A touching story of love and loss set against the backdrop of a changing world.',
    },
  ];

  const movie = movies[selectedMovie];

  return (
    <>
      <h2 className="demo-title">Movie Card</h2>
      <p className="demo-subtitle">Cinematic movie showcase with poster art, cast info, runtime details, ratings, and trailer preview.</p>
      <div className="demo-area" style={{ position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '5%', left: '15%', width: 350, height: 400, background: `radial-gradient(circle, ${movie.color}20 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <motion.div
            key={selectedMovie}
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: 280, perspective: 1000 }}
          >
            <motion.div
              style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowTrailer(!showTrailer)}
            >
              <div
                style={{
                  aspectRatio: '2/3',
                  background: `linear-gradient(180deg, ${movie.color}40, ${movie.color})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8rem',
                  position: 'relative',
                }}
              >
                {movie.poster}
                <div style={{
                  position: 'absolute',
                  top: 15,
                  left: 15,
                  padding: '8px 14px',
                  borderRadius: 20,
                  background: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ color: '#ffd700', fontSize: '1.1rem' }}>★</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>{movie.rating}</span>
                </div>
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showTrailer ? 1 : 0 }}
                >
                  <motion.div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ▶
                  </motion.div>
                </motion.div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
              }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: `${movie.color}`,
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: 10,
                  textTransform: 'uppercase',
                }}>
                  {movie.genre}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                  {movie.year} • {movie.runtime}
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            key={`details-${selectedMovie}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ flex: 1, maxWidth: 500 }}
          >
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
              {movie.title}
            </h1>
            <div style={{ display: 'flex', gap: 15, marginBottom: 25, flexWrap: 'wrap' }}>
              {movie.cast.map((actor, i) => (
                <span key={i} style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: '0.85rem',
                  color: '#ccc',
                }}>
                  {actor}
                </span>
              ))}
            </div>
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '1rem', marginBottom: 30 }}>
              {movie.synopsis}
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
              <motion.button
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${movie.color}, ${movie.color}cc)`,
                  border: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${movie.color}40` }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ Watch Trailer
              </motion.button>
              <motion.button
                style={{
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ fontSize: '1.2rem' }}>+</span> Add to List
              </motion.button>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>
                More Movies
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {movies.map((m, i) => (
                  <motion.div
                    key={m.id}
                    onClick={() => setSelectedMovie(i)}
                    style={{
                      width: 70,
                      aspectRatio: '2/3',
                      borderRadius: 10,
                      background: selectedMovie === i
                        ? `linear-gradient(180deg, ${m.color}40, ${m.color})`
                        : 'rgba(255,255,255,0.05)',
                      border: selectedMovie === i ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      opacity: selectedMovie === i ? 1 : 0.5,
                    }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {m.poster}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
