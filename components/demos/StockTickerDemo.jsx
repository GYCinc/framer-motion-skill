'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function StockTickerDemo() {
  const [stocks, setStocks] = React.useState([
    { symbol: 'AAPL', price: 178.42, change: 2.34, volume: '52.3M', flash: null },
    { symbol: 'GOOGL', price: 141.80, change: -1.23, volume: '18.7M', flash: null },
    { symbol: 'MSFT', price: 378.91, change: 5.67, volume: '24.1M', flash: null },
    { symbol: 'AMZN', price: 178.25, change: 3.12, volume: '31.5M', flash: null },
    { symbol: 'TSLA', price: 248.50, change: -4.89, volume: '89.2M', flash: null },
    { symbol: 'NVDA', price: 875.28, change: 12.45, volume: '41.8M', flash: null },
    { symbol: 'META', price: 505.75, change: 8.32, volume: '15.6M', flash: null },
    { symbol: 'NFLX', price: 628.40, change: -2.15, volume: '8.9M', flash: null },
  ]);
  const [isPaused, setIsPaused] = React.useState(false);

  // Live price simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      const updateIndex = Math.floor(Math.random() * stocks.length);
      setStocks(prev => prev.map((stock, i) => {
        if (i !== updateIndex) return { ...stock, flash: null };
        const delta = (Math.random() - 0.5) * 3;
        const newPrice = Math.max(1, stock.price + delta);
        const flashDir = delta > 0 ? 'up' : 'down';
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number((stock.change + delta * 0.05).toFixed(2)),
          flash: flashDir,
        };
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Stock Ticker</h2>
        <p className="demo-subtitle">Live updating prices with flash animations. Hover to pause.</p>
      </div>
      <div className="demo-area">
        <div
          className="stock-ticker-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ cursor: 'default' }}
        >
          <motion.div
            className="stock-ticker"
            animate={{ x: isPaused ? undefined : [0, -1400] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...stocks, ...stocks, ...stocks].map((stock, i) => (
              <motion.div
                key={i}
                className="stock-ticker-item"
                whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 12px', margin: '0 -12px' }}
                animate={stock.flash ? {
                  background: stock.flash === 'up'
                    ? ['rgba(34, 197, 94, 0.3)', 'transparent']
                    : ['rgba(239, 68, 68, 0.3)', 'transparent'],
                } : {}}
                transition={{ duration: 0.5 }}
                style={{ borderRadius: 6, padding: '6px 10px' }}
              >
                <span className="symbol">{stock.symbol}</span>
                <motion.span
                  className="price"
                  key={`${stock.symbol}-${stock.price}`}
                  initial={stock.flash ? { scale: 1.2, color: stock.flash === 'up' ? '#22c55e' : '#ef4444' } : false}
                  animate={{ scale: 1, color: '#888' }}
                  transition={{ duration: 0.3 }}
                >
                  ${stock.price.toFixed(2)}
                </motion.span>
                <span className={`change ${stock.change >= 0 ? 'up' : 'down'}`}>
                  {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)}%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#555', marginLeft: 8 }}>{stock.volume}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, fontSize: '0.8rem', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Live updates
          </span>
          <span>|</span>
          <span>{isPaused ? '⏸ Paused' : '▶ Scrolling'}</span>
        </div>
      </div>
    </>
  );
}
