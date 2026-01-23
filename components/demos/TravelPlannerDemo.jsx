'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function TravelPlannerDemo() {
  const [destinations, setDestinations] = React.useState([
    { id: 1, city: 'Paris', country: 'France', image: '🗼', dates: 'Jun 15-20', price: 1200, rating: 4.8, weather: '22°C', flights: 5 },
    { id: 2, city: 'Tokyo', country: 'Japan', image: '🗾', dates: 'Jul 10-18', price: 1800, rating: 4.9, weather: '28°C', flights: 3 },
    { id: 3, city: 'Bali', country: 'Indonesia', image: '🏝️', dates: 'Aug 5-12', price: 900, rating: 4.7, weather: '30°C', flights: 7 },
  ]);

  const [itinerary, setItinerary] = React.useState([
    { id: 1, time: '09:00', activity: 'City Tour', location: 'Downtown', icon: '🚌', duration: '3h' },
    { id: 2, time: '12:00', activity: 'Lunch Reservation', location: 'Le Café', icon: '🍽️', duration: '1.5h' },
    { id: 3, time: '15:00', activity: 'Museum Visit', location: 'Louvre', icon: '🎨', duration: '3h' },
    { id: 4, time: '19:00', activity: 'Dinner & Show', location: 'Cabaret', icon: '🎭', duration: '4h' },
  ]);

  const [selectedDestination, setSelectedDestination] = React.useState(destinations[0]);
  const [bookingStep, setBookingStep] = React.useState(0);
  const [travelers, setTravelers] = React.useState(2);
  const [hoveredDest, setHoveredDest] = React.useState(null);

  return (
    <>
      <h2 className="demo-title">Travel Planner</h2>
      <p className="demo-subtitle">Browse destinations, view itineraries, and plan your next adventure with booking steps.</p>
      <div className="demo-area" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
        {/* Ambient background */}
        <div style={{ position: 'absolute', top: '5%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '5%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: '100%', maxWidth: 1400, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28, position: 'relative', zIndex: 1 }}
        >
          {/* Left Column - Destinations */}
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}
          >
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 6, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Explore Destinations
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }}>Find your perfect getaway</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ padding: '10px 20px', borderRadius: 30, background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontSize: '1.2rem' }}>✈️</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>{destinations.reduce((sum, d) => sum + d.flights, 0)} flights available</span>
            </motion.div>
          </motion.div>

          {/* Destination Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginBottom: 28 }}>
            <AnimatePresence>
              {destinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.1 + index * 0.12, type: 'spring', stiffness: 80 }}
                  onClick={() => setSelectedDestination(dest)}
                  onHoverStart={() => setHoveredDest(dest.id)}
                  onHoverEnd={() => setHoveredDest(null)}
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: 0, borderRadius: 24, cursor: 'pointer',
                    background: selectedDestination.id === dest.id
                      ? 'linear-gradient(145deg, rgba(102, 126, 234, 0.25), rgba(139, 92, 246, 0.2))'
                      : 'rgba(15, 15, 30, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: selectedDestination.id === dest.id
                      ? '2px solid rgba(102, 126, 234, 0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: selectedDestination.id === dest.id
                      ? '0 20px 40px rgba(102, 126, 234, 0.2)'
                      : '0 8px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Image/Icon Header */}
                  <div style={{
                    height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(139, 92, 246, 0.1))`,
                    position: 'relative',
                  }}>
                    <motion.div
                      style={{ fontSize: '5rem' }}
                      animate={hoveredDest === dest.id ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      {dest.image}
                    </motion.div>
                    {/* Weather badge */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)', fontSize: '0.8rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      ☀️ {dest.weather}
                    </div>
                    {/* Selected indicator */}
                    {selectedDestination.id === dest.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute', top: 12, left: 12,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #22c55e, #10b981)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>✓</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{dest.city}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{dest.country}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#667eea' }}>${dest.price}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>per person</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        📅 {dest.dates}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 12, background: 'rgba(251, 191, 36, 0.15)' }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>⭐</span>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Destination Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(102, 126, 234, 0.4)' }}
              style={{
                padding: 30, borderRadius: 24, cursor: 'pointer',
                background: 'rgba(15, 15, 30, 0.4)',
                border: '2px dashed rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 200, transition: 'border-color 0.3s ease',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                style={{
                  width: 60, height: 60, borderRadius: 20,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.15))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', marginBottom: 16,
                }}
              >
                +
              </motion.div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Add Destination</span>
            </motion.div>
          </div>

          {/* Map Preview - Enhanced */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
            style={{
              padding: 28, borderRadius: 24,
              background: 'rgba(15, 15, 30, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Map</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {['🌍', '🛰️', '🗺️'].map((icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: i === 0 ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: i === 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>
            </div>
            <div style={{
              height: 180, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.8), rgba(15, 25, 50, 0.9))',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              {/* Grid pattern */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }} />

              <motion.div
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', opacity: 0.2 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌐
              </motion.div>

              {/* Destination pins */}
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, type: 'spring' }}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  style={{
                    position: 'absolute',
                    left: `${20 + i * 28}%`,
                    top: `${30 + (i % 2) * 25}%`,
                    cursor: 'pointer',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: selectedDestination.id === dest.id
                        ? 'linear-gradient(135deg, #667eea, #8b5cf6)'
                        : 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                      boxShadow: selectedDestination.id === dest.id ? '0 8px 25px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
                      border: selectedDestination.id === dest.id ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={() => setSelectedDestination(dest)}
                  >
                    {dest.image}
                  </motion.div>
                </motion.div>
              ))}

              {/* Flight path lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <motion.path
                  d="M 80 90 Q 150 40 220 75"
                  fill="none"
                  stroke="rgba(102, 126, 234, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Itinerary & Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Itinerary - Enhanced */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
            style={{
              padding: 28, borderRadius: 24,
              background: 'rgba(15, 15, 30, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>Today's Itinerary</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{selectedDestination.city}, {selectedDestination.country}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 16px', borderRadius: 12,
                  background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.25)',
                  color: '#667eea', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                + Add
              </motion.button>
            </div>
            <div style={{ position: 'relative', paddingLeft: 36 }}>
              {/* Timeline line with gradient */}
              <div style={{
                position: 'absolute', left: 11, top: 8, bottom: 8, width: 3, borderRadius: 2,
                background: 'linear-gradient(180deg, #667eea, #8b5cf6, #ec4899)',
              }} />

              <AnimatePresence>
                {itinerary.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: 0.4 + index * 0.12, type: 'spring' }}
                    whileHover={{ x: 8 }}
                    style={{ marginBottom: index === itinerary.length - 1 ? 0 : 18, position: 'relative' }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute', left: -32, width: 24, height: 24, borderRadius: 8,
                        background: 'linear-gradient(135deg, #667eea, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        fontSize: '0.8rem',
                      }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, delay: index * 0.4, repeat: Infinity }}
                    >
                      {item.icon}
                    </motion.div>
                    <div style={{
                      padding: 18, borderRadius: 16,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: '0.9rem', color: '#667eea', fontWeight: 700 }}>{item.time}</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 8 }}>
                          {item.duration}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{item.activity}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>📍</span> {item.location}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Booking Panel - Enhanced */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
            style={{
              padding: 28, borderRadius: 24,
              background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.15), rgba(139, 92, 246, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ fontSize: '3rem' }}>{selectedDestination.image}</div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Book {selectedDestination.city}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                  {selectedDestination.dates} · {selectedDestination.country}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {bookingStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12, fontWeight: 600 }}>Number of Travelers</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[1, 2, 3, 4].map(num => (
                        <motion.button
                          key={num}
                          onClick={() => setTravelers(num)}
                          style={{
                            flex: 1, padding: 16, borderRadius: 14,
                            background: travelers === num ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                            border: travelers === num ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: travelers === num ? '0 6px 20px rgba(102, 126, 234, 0.3)' : 'none',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {num}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: 18, borderRadius: 16, background: 'rgba(0,0,0,0.2)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Price per person</span>
                      <span style={{ fontWeight: 700 }}>${selectedDestination.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total ({travelers} travelers)</span>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#667eea' }}>${selectedDestination.price * travelers}</span>
                    </div>
                  </div>
                  <motion.button
                    style={{
                      width: '100%', padding: 18, borderRadius: 16,
                      background: 'linear-gradient(135deg, #667eea, #8b5cf6)', border: 'none',
                      color: '#fff', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setBookingStep(1)}
                  >
                    Continue to Checkout
                  </motion.button>
                </motion.div>
              )}

              {bookingStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <div style={{ padding: 22, borderRadius: 18, background: 'rgba(0,0,0,0.25)', marginBottom: 20 }}>
                    {[
                      { label: '✈️ Round-trip Flight', price: 450 },
                      { label: '🏨 Hotel (5 nights)', price: 600 },
                      { label: '🎫 Activities & Tours', price: 150 },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                        <span style={{ fontWeight: 600 }}>${item.price}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid rgba(102, 126, 234, 0.3)' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#667eea' }}>${(450 + 600 + 150) * travelers}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                      style={{
                        flex: 1, padding: 16, borderRadius: 14,
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBookingStep(0)}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      style={{
                        flex: 2, padding: 16, borderRadius: 14,
                        background: 'linear-gradient(135deg, #22c55e, #10b981)', border: 'none',
                        color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(34, 197, 94, 0.3)',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🎉 Complete Booking
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </>
  );
}
