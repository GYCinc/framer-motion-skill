'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function MarketHeatmapDemo() {
  const [hoveredStock, setHoveredStock] = React.useState(null);
  const [stocks, setStocks] = React.useState([
    { symbol: 'AAPL', name: 'Apple Inc', price: 178.42, change: 2.34, marketCap: 2800, sector: 'Tech' },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 1.87, marketCap: 2750, sector: 'Tech' },
    { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: -1.23, marketCap: 1750, sector: 'Tech' },
    { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 3.12, marketCap: 1850, sector: 'Consumer' },
    { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 5.67, marketCap: 2160, sector: 'Tech' },
    { symbol: 'META', name: 'Meta', price: 505.75, change: 2.45, marketCap: 1280, sector: 'Tech' },
    { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -3.89, marketCap: 790, sector: 'Auto' },
    { symbol: 'JPM', name: 'JP Morgan', price: 195.20, change: 1.12, marketCap: 565, sector: 'Finance' },
    { symbol: 'V', name: 'Visa', price: 278.50, change: 0.89, marketCap: 520, sector: 'Finance' },
    { symbol: 'UNH', name: 'UnitedHealth', price: 527.30, change: -0.56, marketCap: 485, sector: 'Health' },
    { symbol: 'JNJ', name: 'J&J', price: 156.80, change: 0.34, marketCap: 378, sector: 'Health' },
    { symbol: 'XOM', name: 'Exxon', price: 104.20, change: -1.78, marketCap: 415, sector: 'Energy' },
    { symbol: 'CVX', name: 'Chevron', price: 152.40, change: -2.15, marketCap: 285, sector: 'Energy' },
    { symbol: 'PG', name: 'P&G', price: 162.50, change: 0.45, marketCap: 382, sector: 'Consumer' },
    { symbol: 'KO', name: 'Coca-Cola', price: 61.20, change: 0.28, marketCap: 264, sector: 'Consumer' },
  ]);

  // Live price updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      const updateIndex = Math.floor(Math.random() * stocks.length);
      setStocks(prev => prev.map((stock, i) => {
        if (i !== updateIndex) return stock;
        const delta = (Math.random() - 0.5) * 1.5;
        return {
          ...stock,
          price: Number((stock.price + delta).toFixed(2)),
          change: Number((stock.change + delta * 0.3).toFixed(2)),
        };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sectors = ['Tech', 'Finance', 'Health', 'Energy', 'Consumer', 'Auto'];
  const maxMarketCap = Math.max(...stocks.map(s => s.marketCap));

  const getColor = (change) => {
    const intensity = Math.min(Math.abs(change) / 5, 1);
    if (change >= 0) return `rgba(34, 197, 94, ${0.15 + intensity * 0.55})`;
    return `rgba(239, 68, 68, ${0.15 + intensity * 0.55})`;
  };

  const getSize = (marketCap) => {
    const ratio = marketCap / maxMarketCap;
    if (ratio > 0.8) return 'xlarge';
    if (ratio > 0.5) return 'large';
    if (ratio > 0.25) return 'medium';
    return 'small';
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Market Heatmap</h2>
        <p className="demo-subtitle">Live sector performance with market cap sizing</p>
      </div>
      <div className="demo-area">
        {/* Sector Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {sectors.map(sector => {
            const sectorStocks = stocks.filter(s => s.sector === sector);
            const avgChange = sectorStocks.reduce((sum, s) => sum + s.change, 0) / sectorStocks.length;
            return (
              <motion.div
                key={sector}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                whileHover={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <span style={{ color: '#888' }}>{sector}</span>
                <span style={{ color: avgChange >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Heatmap Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          width: '100%',
          maxWidth: 800,
        }}>
          {stocks.map((stock, i) => {
            const size = getSize(stock.marketCap);
            const isHovered = hoveredStock === stock.symbol;
            return (
              <motion.div
                key={stock.symbol}
                style={{
                  background: getColor(stock.change),
                  borderRadius: 10,
                  padding: size === 'xlarge' ? '24px 16px' : size === 'large' ? '18px 12px' : '12px 8px',
                  gridColumn: size === 'xlarge' ? 'span 2' : 'span 1',
                  gridRow: size === 'xlarge' ? 'span 2' : size === 'large' ? 'span 2' : 'span 1',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, type: 'spring' }}
                whileHover={{
                  scale: 1.03,
                  zIndex: 10,
                  boxShadow: `0 15px 40px ${stock.change >= 0 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                }}
                onHoverStart={() => setHoveredStock(stock.symbol)}
                onHoverEnd={() => setHoveredStock(null)}
              >
                <div style={{ fontSize: size === 'xlarge' ? '1.1rem' : size === 'large' ? '0.95rem' : '0.8rem', fontWeight: 600 }}>
                  {stock.symbol}
                </div>
                <motion.div
                  key={stock.change}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  style={{
                    fontSize: size === 'xlarge' ? '1.3rem' : size === 'large' ? '1rem' : '0.85rem',
                    fontWeight: 600,
                    color: stock.change >= 0 ? '#22c55e' : '#ef4444',
                    marginTop: 4,
                  }}
                >
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </motion.div>

                {/* Expanded Info on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ color: '#aaa', marginBottom: 4 }}>{stock.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Price</span>
                        <span>${stock.price.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>MCap</span>
                        <span>${stock.marketCap}B</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pulse Animation */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: stock.change >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    borderRadius: 10,
                  }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Market Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            gap: 30,
            marginTop: 24,
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ color: '#666' }}>Gainers: </span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>{stocks.filter(s => s.change >= 0).length}</span>
          </div>
          <div>
            <span style={{ color: '#666' }}>Losers: </span>
            <span style={{ color: '#ef4444', fontWeight: 600 }}>{stocks.filter(s => s.change < 0).length}</span>
          </div>
          <div>
            <span style={{ color: '#666' }}>Avg Change: </span>
            <span style={{
              color: stocks.reduce((s, st) => s + st.change, 0) / stocks.length >= 0 ? '#22c55e' : '#ef4444',
              fontWeight: 600
            }}>
              {(stocks.reduce((s, st) => s + st.change, 0) / stocks.length).toFixed(2)}%
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
