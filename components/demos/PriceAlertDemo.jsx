'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function PriceAlertDemo() {
  const [alerts, setAlerts] = React.useState([]);
  const [alertId, setAlertId] = React.useState(0);
  const [autoDismiss, setAutoDismiss] = React.useState(true);
  const dismissTime = 5000;

  const alertTypes = [
    { type: 'price_up', icon: '📈', label: 'Price Up', color: '#22c55e' },
    { type: 'price_down', icon: '📉', label: 'Price Down', color: '#ef4444' },
    { type: 'volume', icon: '📊', label: 'Volume Spike', color: '#667eea' },
    { type: 'news', icon: '📰', label: 'Breaking News', color: '#fbbf24' },
    { type: 'earnings', icon: '💰', label: 'Earnings', color: '#f093fb' },
  ];

  const addAlert = (typeIndex = null) => {
    const symbols = ['AAPL', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'MSFT'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const price = (150 + Math.random() * 100).toFixed(2);
    const alertType = typeIndex !== null ? alertTypes[typeIndex] : alertTypes[Math.floor(Math.random() * alertTypes.length)];

    let message;
    switch (alertType.type) {
      case 'price_up': message = `broke above $${price}`; break;
      case 'price_down': message = `dropped below $${price}`; break;
      case 'volume': message = `unusual volume detected (${Math.floor(Math.random() * 500 + 100)}% above avg)`; break;
      case 'news': message = `new analyst report published`; break;
      case 'earnings': message = `reports earnings ${Math.random() > 0.5 ? 'tomorrow' : 'next week'}`; break;
      default: message = `price alert triggered`;
    }

    const newAlert = {
      id: alertId,
      symbol,
      price,
      alertType,
      message,
      timestamp: new Date(),
      progress: 100,
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 6));
    setAlertId(id => id + 1);

    // Auto dismiss
    if (autoDismiss) {
      const intervalId = setInterval(() => {
        setAlerts(prev => prev.map(a => a.id === newAlert.id ? { ...a, progress: Math.max(0, a.progress - 2) } : a));
      }, dismissTime / 50);

      setTimeout(() => {
        clearInterval(intervalId);
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
      }, dismissTime);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Price Alerts</h2>
        <p className="demo-subtitle">Multi-type notifications with auto-dismiss and progress indicators</p>
      </div>
      <div className="demo-area">
        {/* Alert Type Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {alertTypes.map((type, i) => (
            <motion.button
              key={type.type}
              onClick={() => addAlert(i)}
              style={{
                padding: '10px 16px',
                background: `${type.color}20`,
                border: `1px solid ${type.color}40`,
                borderRadius: 10,
                color: type.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.85rem',
              }}
              whileHover={{ scale: 1.05, background: `${type.color}30` }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Auto-dismiss Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <motion.button
            onClick={() => setAutoDismiss(!autoDismiss)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: autoDismiss ? '#22c55e' : 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: 3,
            }}
          >
            <motion.div
              animate={{ x: autoDismiss ? 22 : 0 }}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          </motion.button>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>Auto-dismiss ({dismissTime / 1000}s)</span>
        </div>

        {/* Alerts Container */}
        <div className="price-alert" style={{ minHeight: 350, width: 420 }}>
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                className="price-alert-card"
                style={{
                  marginBottom: 12,
                  borderLeft: `3px solid ${alert.alertType.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8, height: 0, marginBottom: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Progress Bar */}
                {autoDismiss && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: 2,
                      background: alert.alertType.color,
                      width: `${alert.progress}%`,
                    }}
                  />
                )}

                <motion.div
                  className="price-alert-icon"
                  style={{ background: `${alert.alertType.color}20` }}
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  {alert.alertType.icon}
                </motion.div>

                <div className="price-alert-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="price-alert-title" style={{ color: alert.alertType.color }}>
                      {alert.symbol}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      background: `${alert.alertType.color}20`,
                      borderRadius: 4,
                      color: alert.alertType.color,
                    }}>
                      {alert.alertType.label}
                    </span>
                  </div>
                  <div className="price-alert-desc">{alert.message}</div>
                  <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 4 }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <motion.button
                  className="price-alert-close"
                  onClick={() => removeAlert(alert.id)}
                  whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: 60,
                textAlign: 'center',
                color: '#444',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔔</div>
              No alerts yet. Click a button above to trigger one.
            </motion.div>
          )}
        </div>

        {/* Random Alert Button */}
        <motion.button
          className="replay-btn primary-btn"
          onClick={() => addAlert()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: 16 }}
        >
          Random Alert
        </motion.button>
      </div>
    </>
  );
}
