'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function OrderBookDemo() {
  const [midPrice, setMidPrice] = React.useState(178.42);
  const [lastTrade, setLastTrade] = React.useState({ price: 178.42, side: 'buy', amount: 0 });
  const [asks, setAsks] = React.useState([
    { price: 178.55, amount: 125, total: 22312.5, flash: false },
    { price: 178.52, amount: 340, total: 60696.8, flash: false },
    { price: 178.50, amount: 580, total: 103530, flash: false },
    { price: 178.48, amount: 210, total: 37480.8, flash: false },
    { price: 178.45, amount: 450, total: 80302.5, flash: false },
  ]);
  const [bids, setBids] = React.useState([
    { price: 178.40, amount: 380, total: 67792, flash: false },
    { price: 178.38, amount: 520, total: 92757.6, flash: false },
    { price: 178.35, amount: 290, total: 51721.5, flash: false },
    { price: 178.32, amount: 610, total: 108775.2, flash: false },
    { price: 178.30, amount: 175, total: 31202.5, flash: false },
  ]);
  const [trades, setTrades] = React.useState([]);
  const maxTotal = 120000;

  // Live order book simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      const updateBids = Math.random() > 0.5;
      const updateIndex = Math.floor(Math.random() * 5);
      const amountDelta = Math.floor((Math.random() - 0.5) * 200);

      if (updateBids) {
        setBids(prev => prev.map((order, i) => {
          if (i !== updateIndex) return { ...order, flash: false };
          const newAmount = Math.max(50, order.amount + amountDelta);
          return {
            ...order,
            amount: newAmount,
            total: newAmount * order.price,
            flash: true,
          };
        }));
      } else {
        setAsks(prev => prev.map((order, i) => {
          if (i !== updateIndex) return { ...order, flash: false };
          const newAmount = Math.max(50, order.amount + amountDelta);
          return {
            ...order,
            amount: newAmount,
            total: newAmount * order.price,
            flash: true,
          };
        }));
      }

      // Simulate occasional trades
      if (Math.random() > 0.7) {
        const isBuy = Math.random() > 0.5;
        const tradeAmount = Math.floor(Math.random() * 200) + 50;
        const tradePrice = midPrice + (Math.random() - 0.5) * 0.1;
        setLastTrade({ price: tradePrice, side: isBuy ? 'buy' : 'sell', amount: tradeAmount });
        setMidPrice(tradePrice);
        setTrades(prev => [{ id: Date.now(), price: tradePrice, amount: tradeAmount, side: isBuy ? 'buy' : 'sell' }, ...prev].slice(0, 5));
      }
    }, 600);
    return () => clearInterval(interval);
  }, [midPrice]);

  const spread = (asks[asks.length - 1]?.price || 0) - (bids[0]?.price || 0);
  const spreadPercent = ((spread / midPrice) * 100).toFixed(3);

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Order Book</h2>
        <p className="demo-subtitle">Live updating bid/ask depth with simulated trade executions</p>
      </div>
      <div className="demo-area" style={{ flexDirection: 'row', gap: 30, alignItems: 'flex-start' }}>
        <div className="order-book">
          <div className="order-book-header">
            <span className="order-book-title">AAPL Order Book</span>
            <motion.span
              className="order-book-spread"
              key={spread.toFixed(2)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              Spread: ${spread.toFixed(2)} ({spreadPercent}%)
            </motion.span>
          </div>

          {/* Column Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '8px 0', fontSize: '0.7rem', color: '#555', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>Price</span>
            <span style={{ textAlign: 'center' }}>Size</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          {/* Asks (sells) - reversed for display */}
          {[...asks].reverse().map((order, i) => (
            <motion.div
              key={`ask-${order.price}`}
              className="order-book-row"
              style={{ color: '#ef4444' }}
              animate={{
                background: order.flash ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="order-book-bar ask"
                animate={{ width: `${(order.total / maxTotal) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              <span className="price">${order.price.toFixed(2)}</span>
              <motion.span
                className="amount"
                key={order.amount}
                initial={order.flash ? { scale: 1.2, color: '#fff' } : false}
                animate={{ scale: 1, color: '#888' }}
              >
                {order.amount}
              </motion.span>
              <span className="total">${(order.total / 1000).toFixed(1)}K</span>
            </motion.div>
          ))}

          {/* Mid price with last trade indicator */}
          <motion.div
            className="order-book-mid"
            style={{ position: 'relative' }}
          >
            <motion.div
              className="order-book-mid-price"
              key={midPrice.toFixed(2)}
              initial={{ scale: 1.1, color: lastTrade.side === 'buy' ? '#22c55e' : '#ef4444' }}
              animate={{ scale: 1, color: '#fff' }}
              transition={{ duration: 0.3 }}
            >
              ${midPrice.toFixed(2)}
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              <motion.span
                key={lastTrade.amount}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '0.7rem', color: lastTrade.side === 'buy' ? '#22c55e' : '#ef4444' }}
              >
                {lastTrade.side === 'buy' ? '↑' : '↓'} {lastTrade.amount} @ ${lastTrade.price.toFixed(2)}
              </motion.span>
            </div>
          </motion.div>

          {/* Bids (buys) */}
          {bids.map((order, i) => (
            <motion.div
              key={`bid-${order.price}`}
              className="order-book-row"
              style={{ color: '#22c55e' }}
              animate={{
                background: order.flash ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="order-book-bar bid"
                animate={{ width: `${(order.total / maxTotal) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              <span className="price">${order.price.toFixed(2)}</span>
              <motion.span
                className="amount"
                key={order.amount}
                initial={order.flash ? { scale: 1.2, color: '#fff' } : false}
                animate={{ scale: 1, color: '#888' }}
              >
                {order.amount}
              </motion.span>
              <span className="total">${(order.total / 1000).toFixed(1)}K</span>
            </motion.div>
          ))}
        </div>

        {/* Recent Trades Panel */}
        <div style={{
          width: 200,
          background: 'rgba(15, 15, 25, 0.95)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 16,
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Recent Trades
          </div>
          <AnimatePresence>
            {trades.map((trade, i) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1 - i * 0.15, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontSize: '0.8rem',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <span style={{ color: trade.side === 'buy' ? '#22c55e' : '#ef4444' }}>
                  ${trade.price.toFixed(2)}
                </span>
                <span style={{ color: '#666' }}>{trade.amount}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {trades.length === 0 && (
            <div style={{ color: '#444', fontSize: '0.8rem', textAlign: 'center', padding: 20 }}>
              Waiting for trades...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
