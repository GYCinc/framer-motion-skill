'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function MarketOverviewDemo() {
  const [key, setKey] = React.useState(0);
  const [timeRange, setTimeRange] = React.useState('1D');
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [indices, setIndices] = React.useState([
    { name: 'S&P 500', symbol: 'SPX', value: 5021.84, change: 1.23, open: 4961.50, high: 5035.20, low: 4955.30, volume: '3.2B', prevClose: 4960.52 },
    { name: 'DOW JONES', symbol: 'DJI', value: 38996.39, change: 0.85, open: 38665.00, high: 39125.50, low: 38580.25, volume: '285M', prevClose: 38667.12 },
    { name: 'NASDAQ', symbol: 'IXIC', value: 15942.55, change: -0.42, open: 16012.00, high: 16085.30, low: 15890.15, volume: '4.8B', prevClose: 16009.89 },
    { name: 'RUSSELL 2K', symbol: 'RUT', value: 2045.32, change: 0.65, open: 2032.10, high: 2058.45, low: 2028.90, volume: '1.1B', prevClose: 2032.05 },
  ]);
  const [displayValues, setDisplayValues] = React.useState({});
  const [flashIndices, setFlashIndices] = React.useState({});

  const timeRanges = ['1D', '1W', '1M', '3M', 'YTD', '1Y'];

  const chartDataByRange = {
    '1D': { points: 24, labels: ['9:30', '11:00', '12:30', '2:00', '4:00'] },
    '1W': { points: 7, labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    '1M': { points: 22, labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    '3M': { points: 13, labels: ['Jan', 'Feb', 'Mar'] },
    'YTD': { points: 12, labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    '1Y': { points: 12, labels: ['Jan', 'Apr', 'Jul', 'Oct'] },
  };

  const generateChartPoints = (up, count) => {
    const points = [];
    let value = up ? 30 : 70;
    for (let i = 0; i < count; i++) {
      value += (up ? 1 : -1) * (Math.random() * 8 - 2);
      value = Math.max(10, Math.min(90, value));
      points.push(value);
    }
    return points;
  };

  const [chartPoints, setChartPoints] = React.useState(() =>
    indices.map(idx => generateChartPoints(idx.change > 0, chartDataByRange[timeRange].points))
  );

  React.useEffect(() => {
    setChartPoints(indices.map(idx => generateChartPoints(idx.change > 0, chartDataByRange[timeRange].points)));
    setKey(k => k + 1);
  }, [timeRange]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map((idx, i) => {
        const delta = (Math.random() - 0.5) * idx.value * 0.001;
        const newValue = idx.value + delta;
        const newChange = ((newValue - idx.prevClose) / idx.prevClose) * 100;
        if (Math.abs(delta) > idx.value * 0.0003) {
          setFlashIndices(f => ({ ...f, [i]: delta > 0 ? 'up' : 'down' }));
          setTimeout(() => setFlashIndices(f => ({ ...f, [i]: null })), 300);
        }
        return { ...idx, value: newValue, change: newChange, high: Math.max(idx.high, newValue), low: Math.min(idx.low, newValue) };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    indices.forEach((idx, i) => {
      const startVal = displayValues[i] || idx.value * 0.99;
      const endVal = idx.value;
      let frame = 0;
      const frames = 20;
      const animate = () => {
        frame++;
        const progress = frame / frames;
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValues(d => ({ ...d, [i]: startVal + (endVal - startVal) * eased }));
        if (frame < frames) requestAnimationFrame(animate);
      };
      animate();
    });
  }, [indices]);

  const createPath = (points, width = 200, height = 60) => {
    const step = width / (points.length - 1);
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - p * 0.6}`).join(' ');
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Market Overview</h2>
        <p className="demo-subtitle">Live indices with time ranges & detailed stats</p>
      </div>
      <div className="demo-area">
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', justifyContent: 'center' }}>
          {timeRanges.map(range => (
            <motion.button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: timeRange === range ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </div>

        <div className="market-overview" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {indices.map((index, i) => (
            <motion.div
              key={`${key}-${index.name}`}
              className="market-index-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                boxShadow: flashIndices[i] ? `0 0 20px ${flashIndices[i] === 'up' ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}` : '0 10px 30px rgba(0,0,0,0.2)'
              }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
              style={{ cursor: 'pointer', padding: '14px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>{index.symbol}</div>
                  <div className="index-name" style={{ fontSize: '13px' }}>{index.name}</div>
                </div>
                <motion.div
                  className={`index-change ${index.change > 0 ? 'up' : 'down'}`}
                  animate={flashIndices[i] ? { scale: [1, 1.2, 1] } : {}}
                  style={{ fontSize: '12px', padding: '3px 8px' }}
                >
                  {index.change > 0 ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)}%
                </motion.div>
              </div>

              <motion.div
                className="index-value"
                style={{ fontSize: '22px', margin: '8px 0' }}
                animate={flashIndices[i] ? { color: flashIndices[i] === 'up' ? '#22c55e' : '#ef4444' } : { color: '#fff' }}
              >
                {(displayValues[i] || index.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>

              <div className="index-chart" style={{ height: '50px', marginBottom: '8px' }}>
                <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <motion.path
                    d={createPath(chartPoints[i] || [])}
                    fill="none"
                    stroke={index.change > 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: i * 0.15 }}
                  />
                  <motion.path
                    d={`${createPath(chartPoints[i] || [])} L 200 60 L 0 60 Z`}
                    fill={`url(#overview-gradient-${i})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1 + i * 0.15 }}
                  />
                  <defs>
                    <linearGradient id={`overview-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={index.change > 0 ? '#22c55e' : '#ef4444'} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <AnimatePresence>
                {selectedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '6px' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11px' }}>
                      <div style={{ color: '#888' }}>Open: <span style={{ color: '#fff' }}>{index.open.toLocaleString()}</span></div>
                      <div style={{ color: '#888' }}>Prev Close: <span style={{ color: '#fff' }}>{index.prevClose.toLocaleString()}</span></div>
                      <div style={{ color: '#888' }}>High: <span style={{ color: '#22c55e' }}>{index.high.toLocaleString()}</span></div>
                      <div style={{ color: '#888' }}>Low: <span style={{ color: '#ef4444' }}>{index.low.toLocaleString()}</span></div>
                      <div style={{ color: '#888' }}>Volume: <span style={{ color: '#fff' }}>{index.volume}</span></div>
                      <div style={{ color: '#888' }}>Range: <span style={{ color: '#fff' }}>{timeRange}</span></div>
                    </div>
                    <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                      <motion.div
                        style={{
                          position: 'absolute',
                          left: `${((index.value - index.low) / (index.high - index.low)) * 100}%`,
                          top: '-2px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: index.change > 0 ? '#22c55e' : '#ef4444',
                          transform: 'translateX(-50%)',
                        }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((index.value - index.low) / (index.high - index.low)) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #22c55e)', borderRadius: '2px' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#888' }}>
          <span>🟢 Market Open</span>
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </>
  );
}
