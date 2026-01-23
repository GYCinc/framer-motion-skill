'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoComponents } from '../lib/demoRegistry';
import { categories } from '../lib/categories';
import { demoNames } from '../lib/demoNames';

// DemoWrapper Component
function DemoWrapper({ componentId, demoName, children }) {
  const [rating, setRating] = React.useState(null);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  // Load rating from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(`demo_rating_${componentId}`);
    if (stored) setRating(parseInt(stored));
  }, [componentId]);

  // Save rating to localStorage
  const handleRate = (stars) => {
    setRating(stars);
    localStorage.setItem(`demo_rating_${componentId}`, stars.toString());
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    try {
      const demoFunc = demoComponents[componentId];
      if (!demoFunc) {
        console.warn(`Component ${componentId} not found`);
        return;
      }

      const funcSource = demoFunc.toString();

      const fullCode = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component: ${demoName}
${funcSource}

// Usage:
// <${demoFunc.name} />`;

      navigator.clipboard.writeText(fullCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating Control Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          padding: '10px 16px',
          background: 'rgba(15, 15, 25, 0.9)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
        }}
      >
        {/* Rating Stars */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <motion.button
              key={star}
              onClick={() => handleRate(star)}
              onHoverStart={() => setHoverRating(star)}
              onHoverEnd={() => setHoverRating(0)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '2px',
                color: (hoverRating || rating) >= star ? '#fbbf24' : '#555',
                transition: 'color 0.15s',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              ★
            </motion.button>
          ))}
          {rating && <span style={{ fontSize: '0.7rem', color: '#fbbf24', marginLeft: 4, fontWeight: 600 }}>{rating}/5</span>}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />

        {/* Copy Button */}
        <motion.button
          onClick={handleCopyCode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            borderRadius: 6,
            background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(102, 126, 234, 0.2)',
            border: 'none',
            color: copied ? '#22c55e' : '#667eea',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </motion.div>

      {/* Component Content */}
      <div style={{ paddingTop: 10 }}>
        {children}
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [active, setActive] = React.useState('appstore');
  const [showRatingPanel, setShowRatingPanel] = React.useState(false);
  const [ratings, setRatings] = React.useState({});

  const DemoComponent = demoComponents[active];
  const isScrollDemo = ['parallax', 'heroparallax', 'hscroll', 'scrollprogress', 'velocity'].includes(active);

  // Get all component IDs
  const allComponentIds = Object.keys(demoComponents);
  const totalComponents = allComponentIds.length;

  // Load ratings from localStorage
  const loadRatings = () => {
    const loaded = {};
    allComponentIds.forEach(id => {
      const stored = localStorage.getItem(`demo_rating_${id}`);
      if (stored) loaded[id] = parseInt(stored);
    });
    setRatings(loaded);
  };

  React.useEffect(() => {
    loadRatings();
    // Listen for storage changes
    const handleStorage = () => loadRatings();
    window.addEventListener('storage', handleStorage);
    // Poll for changes (for same-tab updates)
    const interval = setInterval(loadRatings, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Categorize ratings
  const toDelete = Object.entries(ratings).filter(([_, r]) => r === 1).map(([id]) => ({ id, name: demoNames[id] }));
  const best = Object.entries(ratings).filter(([_, r]) => r === 5).map(([id]) => ({ id, name: demoNames[id] }));
  const needsImprovement = Object.entries(ratings).filter(([_, r]) => r >= 2 && r <= 4).map(([id]) => ({ id, name: demoNames[id], rating: ratings[id] }));
  const ratedCount = Object.keys(ratings).length;
  const unratedCount = totalComponents - ratedCount;

  // Export ratings to console/clipboard
  const exportRatings = () => {
    const text = `=== RATING REPORT ===
Total: ${totalComponents} | Rated: ${ratedCount} | Unrated: ${unratedCount}

🗑️ TO DELETE (1 star): ${toDelete.length}
${toDelete.map(c => `  - ${c.name}`).join('\n') || '  (none)'}

⭐ BEST (5 stars): ${best.length}
${best.map(c => `  - ${c.name}`).join('\n') || '  (none)'}

🔧 NEEDS IMPROVEMENT (2-4 stars): ${needsImprovement.length}
${needsImprovement.map(c => `  - ${c.name} (${c.rating}/5)`).join('\n') || '  (none)'}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Rating report copied to clipboard!');
    }
    console.log(text);
  };

  return (
    <>
      <nav className="sidebar">
        <h1>Framer Motion</h1>

        {/* Rating Progress */}
        <div style={{ padding: '10px 15px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: 6 }}>
            <span>Rated</span>
            <span>{ratedCount}/{totalComponents}</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(ratedCount/totalComponents)*100}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          <motion.button
            onClick={() => setShowRatingPanel(true)}
            style={{ width: '100%', marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.3)', color: '#667eea', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📊 View Ratings
          </motion.button>
        </div>

        {/* Categories */}
        {Object.entries(categories).map(([cat, demos]) => (
          <React.Fragment key={cat}>
            <div className="sidebar-section">{cat}</div>
            {demos.map(d => (
              <button
                key={d}
                className={active === d ? 'active' : ''}
                onClick={() => setActive(d)}
                style={{ position: 'relative' }}
              >
                {demoNames[d]}
                {ratings[d] && (
                  <span style={{
                    position: 'absolute',
                    right: 8,
                    fontSize: '0.7rem',
                    color: ratings[d] === 1 ? '#ef4444' : ratings[d] === 5 ? '#fbbf24' : '#888',
                  }}>
                    {'★'.repeat(ratings[d])}
                  </span>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      {/* Rating Panel Modal */}
      <AnimatePresence>
        {showRatingPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRatingPanel(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: 800,
                maxHeight: '80vh',
                background: 'rgba(20, 20, 30, 0.98)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Rating Dashboard</h2>
                  <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#888' }}>{ratedCount} of {totalComponents} components rated</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    onClick={exportRatings}
                    style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.3)', color: '#667eea', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📋 Export Report
                  </motion.button>
                  <motion.button
                    onClick={() => setShowRatingPanel(false)}
                    style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflow: 'auto', padding: 25 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  {/* Delete Column */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#ef4444' }}>Delete ({toDelete.length})</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflow: 'auto' }}>
                      {toDelete.length === 0 ? (
                        <p style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>No 1-star ratings yet</p>
                      ) : toDelete.map(c => (
                        <motion.div
                          key={c.id}
                          onClick={() => { setActive(c.id); setShowRatingPanel(false); }}
                          style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: 6, fontSize: '0.85rem', cursor: 'pointer' }}
                          whileHover={{ scale: 1.02, background: 'rgba(239, 68, 68, 0.25)' }}
                        >
                          {c.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Needs Improvement Column */}
                  <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: '1.2rem' }}>🔧</span>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#fbbf24' }}>Improve ({needsImprovement.length})</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflow: 'auto' }}>
                      {needsImprovement.length === 0 ? (
                        <p style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>No 2-4 star ratings yet</p>
                      ) : needsImprovement.map(c => (
                        <motion.div
                          key={c.id}
                          onClick={() => { setActive(c.id); setShowRatingPanel(false); }}
                          style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.15)', borderRadius: 6, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                          whileHover={{ scale: 1.02, background: 'rgba(251, 191, 36, 0.25)' }}
                        >
                          <span>{c.name}</span>
                          <span style={{ color: '#fbbf24' }}>{'★'.repeat(c.rating)}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Best Column */}
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: '1.2rem' }}>⭐</span>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#22c55e' }}>Best ({best.length})</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflow: 'auto' }}>
                      {best.length === 0 ? (
                        <p style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>No 5-star ratings yet</p>
                      ) : best.map(c => (
                        <motion.div
                          key={c.id}
                          onClick={() => { setActive(c.id); setShowRatingPanel(false); }}
                          style={{ padding: '8px 12px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: 6, fontSize: '0.85rem', cursor: 'pointer' }}
                          whileHover={{ scale: 1.02, background: 'rgba(34, 197, 94, 0.25)' }}
                        >
                          {c.name} ⭐
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unrated Section */}
                {unratedCount > 0 && (
                  <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: '1.2rem' }}>📝</span>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#888' }}>Unrated ({unratedCount})</h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {allComponentIds.filter(id => !ratings[id]).slice(0, 20).map(id => (
                        <motion.button
                          key={id}
                          onClick={() => { setActive(id); setShowRatingPanel(false); }}
                          style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#888', fontSize: '0.8rem', cursor: 'pointer' }}
                          whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                        >
                          {demoNames[id]}
                        </motion.button>
                      ))}
                      {unratedCount > 20 && <span style={{ padding: '6px 12px', color: '#666', fontSize: '0.8rem' }}>+{unratedCount - 20} more</span>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="main-content">
        {!isScrollDemo && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DemoWrapper componentId={active} demoName={demoNames[active]}>
                {DemoComponent && <DemoComponent />}
              </DemoWrapper>
            </motion.div>
          </AnimatePresence>
        )}
        {isScrollDemo && (
          <>
            <div className="demo-header">
              <h2 className="demo-title">{demoNames[active]}</h2>
              <p className="demo-subtitle">
                {active === 'parallax' && 'Scroll down. Multiple layers move at different speeds.'}
                {active === 'heroparallax' && 'Scroll down. Advanced parallax with floating cards, color shifts, and scale transforms.'}
                {active === 'hscroll' && 'Scroll down. Vertical scroll transforms into horizontal card movement.'}
                {active === 'scrollprogress' && 'Scroll down. Progress bar tracks position. Cards reveal on viewport entry.'}
                {active === 'velocity' && 'Scroll up and down. Text speed responds to scroll velocity.'}
              </p>
            </div>
            <DemoWrapper componentId={active} demoName={demoNames[active]}>
              {DemoComponent && <DemoComponent />}
            </DemoWrapper>
          </>
        )}
      </div>
    </>
  );
}
