'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function StockCardDemo() {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [stocks, setStocks] = React.useState([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 4.23, up: true, high52: 974.00, low52: 393.00, marketCap: '2.16T', volume: '41.8M', pe: 68.4, points: [45, 52, 48, 61, 55, 70, 65, 78, 72, 85, 80, 92] },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -2.15, up: false, high52: 299.29, low52: 138.80, marketCap: '791B', volume: '89.2M', pe: 47.2, points: [85, 78, 82, 70, 75, 62, 68, 55, 60, 48, 52, 45] },
    { symbol: 'AMD', name: 'AMD Inc', price: 178.90, change: 1.87, up: true, high52: 227.30, low52: 93.12, marketCap: '289B', volume: '52.1M', pe: 298.5, points: [40, 48, 45, 58, 52, 65, 60, 72, 68, 78, 75, 85] },
  ]);

  // Live price simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const delta = (Math.random() - 0.5) * 5;
        const newPrice = Math.max(1, stock.price + delta);
        const newChange = stock.change + delta * 0.02;
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(newChange.toFixed(2)),
          up: newChange >= 0,
        };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Stock Card</h2>
        <p className="demo-subtitle">Hover to reveal detailed stats with live price updates</p>
      </div>
      <div className="demo-area" style={{ flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
        {stocks.map((stock, idx) => {
          const pathD = stock.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 25} ${100 - p}`).join(' ');
          const isHovered = hoveredCard === idx;
          const range52Progress = ((stock.price - stock.low52) / (stock.high52 - stock.low52)) * 100;

          return (
            <motion.div
              key={stock.symbol}
              className="stock-card"
              style={{ width: isHovered ? 360 : 320, overflow: 'hidden' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ scale: 1.02, y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
              onHoverStart={() => setHoveredCard(idx)}
              onHoverEnd={() => setHoveredCard(null)}
              layout
            >
              <div className="stock-card-header">
                <div>
                  <div className="stock-card-symbol">{stock.symbol}</div>
                  <div className="stock-card-name">{stock.name}</div>
                </div>
                <motion.div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: stock.up ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stock.up ? '📈' : '📉'}
                </motion.div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <motion.div
                  className="stock-card-price"
                  key={stock.price}
                  initial={{ color: stock.up ? '#22c55e' : '#ef4444' }}
                  animate={{ color: '#fff' }}
                  transition={{ duration: 0.5 }}
                >
                  ${stock.price.toFixed(2)}
                </motion.div>
                <motion.span
                  className={`stock-card-change ${stock.up ? 'up' : 'down'}`}
                  key={stock.change}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {stock.up ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)}%
                </motion.span>
              </div>

              {/* 52 Week Range */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: 16, overflow: 'hidden' }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 6 }}>52 Week Range</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem' }}>
                      <span style={{ color: '#ef4444' }}>${stock.low52.toFixed(2)}</span>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${range52Progress}%` }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #ef4444, #fbbf24, #22c55e)',
                            borderRadius: 2,
                          }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        />
                        <motion.div
                          initial={{ left: 0 }}
                          animate={{ left: `${range52Progress}%` }}
                          style={{
                            position: 'absolute',
                            top: -3,
                            width: 10,
                            height: 10,
                            background: '#fff',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        />
                      </div>
                      <span style={{ color: '#22c55e' }}>${stock.high52.toFixed(2)}</span>
                    </div>

                    {/* Stats Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 12,
                        marginTop: 16,
                        padding: 12,
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2 }}>Market Cap</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{stock.marketCap}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2 }}>Volume</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{stock.volume}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2 }}>P/E Ratio</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{stock.pe.toFixed(1)}</div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="stock-card-chart" style={{ marginTop: isHovered ? 12 : 20 }}>
                <svg width="100%" height="100%" viewBox="0 0 275 100" preserveAspectRatio="none">
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={stock.up ? '#22c55e' : '#ef4444'}
                    strokeWidth={isHovered ? 3 : 2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: idx * 0.2 }}
                  />
                  <motion.path
                    d={`${pathD} L 275 100 L 0 100 Z`}
                    fill={`url(#gradient-card-${idx})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.5 : 0.3 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                  />
                  {isHovered && (
                    <motion.circle
                      cx={275}
                      cy={100 - stock.points[stock.points.length - 1]}
                      r={5}
                      fill={stock.up ? '#22c55e' : '#ef4444'}
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <defs>
                    <linearGradient id={`gradient-card-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stock.up ? '#22c55e' : '#ef4444'} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
