'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function WatchlistDemo() {
  const [stocks, setStocks] = React.useState([
    { symbol: 'AAPL', name: 'Apple Inc', price: 178.42, change: 2.34, volume: '52.4M', marketCap: '2.78T', dayHigh: 180.25, dayLow: 176.80, up: true, starred: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 4.56, volume: '48.2M', marketCap: '2.16T', dayHigh: 882.90, dayLow: 869.15, up: true, starred: true },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -2.15, volume: '112.8M', marketCap: '789.5B', dayHigh: 254.30, dayLow: 246.90, up: false, starred: false },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 141.80, change: -1.23, volume: '24.6M', marketCap: '1.78T', dayHigh: 143.75, dayLow: 141.20, up: false, starred: false },
    { symbol: 'AMZN', name: 'Amazon.com', price: 178.25, change: 3.12, volume: '38.9M', marketCap: '1.85T', dayHigh: 180.40, dayLow: 175.60, up: true, starred: true },
  ]);
  const [deletingStock, setDeletingStock] = React.useState(null);
  const [expandedStock, setExpandedStock] = React.useState(null);
  const [sortBy, setSortBy] = React.useState('default');

  // Generate unique sparkline paths for each stock
  const generateSparkline = (seed) => {
    const points = [];
    let value = 50;
    for (let i = 0; i < 15; i++) {
      value += (Math.sin(seed + i * 0.5) * 10) + (Math.random() * 4 - 2);
      points.push(Math.max(20, Math.min(80, value)));
    }
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 6} ${100 - p}`).join(' ');
  };

  // Simulate price updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const delta = (Math.random() - 0.5) * 2;
        const newPrice = stock.price + delta;
        const newChange = stock.change + delta * 0.1;
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(newChange.toFixed(2)),
          up: newChange >= 0,
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleStar = (symbol) => {
    setStocks(prev => prev.map(s => s.symbol === symbol ? { ...s, starred: !s.starred } : s));
  };

  const deleteStock = (symbol) => {
    setDeletingStock(symbol);
    setTimeout(() => {
      setStocks(prev => prev.filter(s => s.symbol !== symbol));
      setDeletingStock(null);
      if (expandedStock === symbol) setExpandedStock(null);
    }, 300);
  };

  const toggleExpand = (symbol) => {
    setExpandedStock(expandedStock === symbol ? null : symbol);
  };

  const addStock = () => {
    const available = [
      { symbol: 'META', name: 'Meta Platforms', price: 505.75, volume: '18.2M', marketCap: '1.32T' },
      { symbol: 'MSFT', name: 'Microsoft', price: 378.91, volume: '22.4M', marketCap: '2.82T' },
      { symbol: 'AMD', name: 'AMD Inc', price: 178.90, volume: '56.8M', marketCap: '289.4B' },
      { symbol: 'NFLX', name: 'Netflix', price: 628.40, volume: '4.2M', marketCap: '270.8B' },
    ].filter(s => !stocks.find(st => st.symbol === s.symbol));
    if (available.length > 0) {
      const newStock = available[0];
      const change = Number((Math.random() * 6 - 3).toFixed(2));
      setStocks(prev => [...prev, {
        ...newStock,
        change,
        up: change >= 0,
        starred: false,
        dayHigh: newStock.price * 1.02,
        dayLow: newStock.price * 0.98,
      }]);
    }
  };

  const sortedStocks = React.useMemo(() => {
    const sorted = [...stocks];
    if (sortBy === 'starred') return sorted.sort((a, b) => b.starred - a.starred);
    if (sortBy === 'gain') return sorted.sort((a, b) => b.change - a.change);
    if (sortBy === 'loss') return sorted.sort((a, b) => a.change - b.change);
    return sorted;
  }, [stocks, sortBy]);

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Enhanced Watchlist</h2>
        <p className="demo-subtitle">Click row to expand • Drag to reorder • Star favorites • Swipe left to delete</p>
      </div>
      <div className="demo-area">
        <div className="stock-watchlist" style={{ width: 640, maxWidth: '100%' }}>
          {/* Header with controls */}
          <div className="watchlist-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: '1rem' }}>Your Watchlist</span>
              <motion.span
                style={{
                  background: 'rgba(102, 126, 234, 0.2)',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: '0.75rem',
                  color: '#667eea',
                  fontWeight: 600,
                }}
                key={stocks.length}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {stocks.length}
              </motion.span>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#aaa',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <option value="default">Default</option>
                <option value="starred">Starred</option>
                <option value="gain">Top Gainers</option>
                <option value="loss">Top Losers</option>
              </select>

              <motion.button
                onClick={addStock}
                style={{
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: 'none',
                  color: '#667eea',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                whileHover={{ scale: 1.05, background: 'rgba(102, 126, 234, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                + Add Stock
              </motion.button>
            </div>
          </div>

          {/* Market summary bar */}
          <motion.div
            layout
            style={{
              display: 'flex',
              gap: 16,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              borderRadius: 10,
              marginBottom: 16,
              fontSize: '0.75rem',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ color: '#666', marginBottom: 2 }}>Portfolio Value</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                ${(stocks.reduce((sum, s) => sum + s.price, 0)).toFixed(2)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#666', marginBottom: 2 }}>Avg Change</div>
              <div style={{
                color: stocks.reduce((s, st) => s + st.change, 0) / stocks.length >= 0 ? '#22c55e' : '#ef4444',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                {stocks.length > 0 ? (stocks.reduce((s, st) => s + st.change, 0) / stocks.length).toFixed(2) : '0.00'}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#666', marginBottom: 2 }}>Gainers/Losers</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                <span style={{ color: '#22c55e' }}>{stocks.filter(s => s.change >= 0).length}</span>
                <span style={{ color: '#666', margin: '0 4px' }}>/</span>
                <span style={{ color: '#ef4444' }}>{stocks.filter(s => s.change < 0).length}</span>
              </div>
            </div>
          </motion.div>

          <Reorder.Group values={sortedStocks} onReorder={setStocks} axis="y">
            <AnimatePresence mode="popLayout">
              {sortedStocks.map((stock, i) => {
                const isExpanded = expandedStock === stock.symbol;
                const sparkPath = generateSparkline(i * 3.14);

                return (
                <Reorder.Item
                  key={stock.symbol}
                  value={stock}
                  style={{ listStyle: 'none' }}
                >
                  <motion.div
                    className="watchlist-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: deletingStock === stock.symbol ? 0 : 1,
                      x: deletingStock === stock.symbol ? -100 : 0,
                      height: deletingStock === stock.symbol ? 0 : 'auto',
                    }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                    style={{ cursor: 'grab', position: 'relative', overflow: 'hidden' }}
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -60) deleteStock(stock.symbol);
                    }}
                  >
                    {/* Drag Handle */}
                    <div style={{ color: '#333', marginRight: 8, cursor: 'grab' }}>⋮⋮</div>

                    {/* Star Button */}
                    <motion.button
                      onClick={() => toggleStar(stock.symbol)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginRight: 12,
                        color: stock.starred ? '#fbbf24' : '#333',
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={stock.starred ? { rotate: [0, 15, -15, 0] } : {}}
                    >
                      {stock.starred ? '★' : '☆'}
                    </motion.button>

                    <div className="watchlist-info" style={{ flex: 1 }}>
                      <span className="watchlist-symbol">{stock.symbol}</span>
                      <span className="watchlist-name">{stock.name}</span>
                    </div>

                    <div className="watchlist-chart">
                      <svg width="100%" height="100%" viewBox="0 0 80 40" preserveAspectRatio="none">
                        <motion.path
                          d={stock.up ? pathD : pathDown}
                          fill="none"
                          stroke={stock.up ? '#22c55e' : '#ef4444'}
                          strokeWidth="1.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                        />
                      </svg>
                    </div>

                    <div className="watchlist-price-wrap">
                      <motion.div
                        className="watchlist-price"
                        key={stock.price}
                        initial={{ scale: 1.15, color: stock.up ? '#22c55e' : '#ef4444' }}
                        animate={{ scale: 1, color: '#fff' }}
                        transition={{ duration: 0.3 }}
                      >
                        ${stock.price.toFixed(2)}
                      </motion.div>
                      <motion.span
                        className={`watchlist-change ${stock.up ? 'up' : 'down'}`}
                        key={stock.change}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                      >
                        {stock.up ? '+' : ''}{stock.change.toFixed(2)}%
                      </motion.span>
                    </div>

                    {/* Delete hint on swipe */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        right: -70,
                        top: 0,
                        bottom: 0,
                        width: 60,
                        background: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.8rem',
                      }}
                    >
                      Delete
                    </motion.div>
                  </motion.div>
                </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>

          {stocks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: 40, textAlign: 'center', color: '#555' }}
            >
              Your watchlist is empty. Click + Add to get started.
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
