'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function TradingPanelDemo() {
  const [activeTab, setActiveTab] = React.useState('buy');
  const [orderType, setOrderType] = React.useState('market');
  const [amount, setAmount] = React.useState(100);
  const [limitPrice, setLimitPrice] = React.useState(178.00);
  const [sliderValue, setSliderValue] = React.useState(25);
  const [price, setPrice] = React.useState(178.42);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const balance = 50000;

  // Live price simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => Number((p + (Math.random() - 0.5) * 0.5).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const effectivePrice = orderType === 'market' ? price : limitPrice;
  const total = amount * effectivePrice;
  const fee = total * 0.001;

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const confirmOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowConfirm(false);
    }, 2000);
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Trading Panel</h2>
        <p className="demo-subtitle">Order types, live pricing, and confirmation flow</p>
      </div>
      <div className="demo-area">
        <div className="trading-panel" style={{ width: 420 }}>
          {/* Buy/Sell Tabs */}
          <div className="trading-tabs">
            {['buy', 'sell'].map((tab) => (
              <button
                key={tab}
                className={`trading-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    className="trading-tab-indicator"
                    layoutId="trading-tab"
                    style={{ background: tab === 'buy' ? '#22c55e' : '#ef4444' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="trading-form">
            {/* Live Price Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>AAPL Market Price</span>
              <motion.span
                key={price}
                initial={{ scale: 1.1, color: '#22c55e' }}
                animate={{ scale: 1, color: '#fff' }}
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
              >
                ${price.toFixed(2)}
              </motion.span>
            </div>

            {/* Order Type Toggle */}
            <div className="trading-input-group">
              <div className="trading-label"><span>Order Type</span></div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['market', 'limit'].map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: orderType === type ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: orderType === type ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: orderType === type ? '#667eea' : '#888',
                      cursor: 'pointer',
                      fontWeight: orderType === type ? 600 : 400,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Limit Price (conditional) */}
            <AnimatePresence>
              {orderType === 'limit' && (
                <motion.div
                  className="trading-input-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="trading-label">
                    <span>Limit Price</span>
                    <span style={{ color: limitPrice < price ? '#22c55e' : '#ef4444' }}>
                      {limitPrice < price ? `${((1 - limitPrice/price) * 100).toFixed(1)}% below` : `${((limitPrice/price - 1) * 100).toFixed(1)}% above`}
                    </span>
                  </div>
                  <motion.input
                    type="number"
                    className="trading-input"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(Number(e.target.value))}
                    step="0.01"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Amount Input */}
            <div className="trading-input-group">
              <div className="trading-label">
                <span>Shares</span>
                <span>Balance: ${balance.toLocaleString()}</span>
              </div>
              <motion.input
                type="number"
                className="trading-input"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              />
            </div>

            {/* Quick Select Slider */}
            <div className="trading-input-group">
              <div className="trading-label">
                <span>% of Balance</span>
                <span>{sliderValue}%</span>
              </div>
              <div className="trading-slider" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                setSliderValue(Math.max(0, Math.min(100, percent)));
                setAmount(Math.floor((balance * percent / 100) / effectivePrice));
              }}>
                <motion.div
                  className="trading-slider-fill"
                  animate={{ width: `${sliderValue}%` }}
                  style={{ background: activeTab === 'buy' ? '#22c55e' : '#ef4444' }}
                />
                <motion.div
                  className="trading-slider-thumb"
                  animate={{ left: `${sliderValue}%` }}
                  style={{ background: activeTab === 'buy' ? '#22c55e' : '#ef4444' }}
                />
              </div>
              <div className="trading-slider-marks">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <motion.span
                    key={mark}
                    style={{ cursor: 'pointer', color: sliderValue >= mark ? '#fff' : '#555' }}
                    onClick={() => {
                      setSliderValue(mark);
                      setAmount(Math.floor((balance * mark / 100) / effectivePrice));
                    }}
                    whileHover={{ color: '#fff' }}
                  >
                    {mark}%
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span>${(amount * effectivePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ color: '#666' }}>Fee (0.1%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 }}>
                <span>Total</span>
                <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                  ${(total + fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </motion.span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              className={`trading-btn ${activeTab}`}
              onClick={handleSubmit}
              whileHover={{ scale: 1.02, boxShadow: `0 10px 40px ${activeTab === 'buy' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === 'buy' ? 'Buy' : 'Sell'} {amount} AAPL
            </motion.button>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => !orderSuccess && setShowConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{
                  background: '#151520',
                  borderRadius: 20,
                  padding: 30,
                  width: 340,
                  textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {orderSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <motion.div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: activeTab === 'buy' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '2rem',
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      ✓
                    </motion.div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Order Executed!</div>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      {activeTab === 'buy' ? 'Bought' : 'Sold'} {amount} AAPL @ ${effectivePrice.toFixed(2)}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20 }}>Confirm Order</div>
                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#666' }}>Action</span>
                        <span style={{ color: activeTab === 'buy' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                          {activeTab.toUpperCase()} AAPL
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#666' }}>Shares</span>
                        <span>{amount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#666' }}>Price</span>
                        <span>${effectivePrice.toFixed(2)} ({orderType})</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 }}>
                        <span>Total</span>
                        <span>${(total + fee).toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <motion.button
                        onClick={() => setShowConfirm(false)}
                        style={{ flex: 1, padding: 14, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer' }}
                        whileHover={{ background: 'rgba(255,255,255,0.15)' }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={confirmOrder}
                        style={{ flex: 1, padding: 14, background: activeTab === 'buy' ? '#22c55e' : '#ef4444', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Confirm
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
