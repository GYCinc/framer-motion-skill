'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function ExpenseTrackerDemo() {
  const [expenses, setExpenses] = React.useState([
    { id: 1, category: 'Food', amount: 85.50, icon: '🍔', color: '#ef4444', trend: '+12%' },
    { id: 2, category: 'Transport', amount: 45.00, icon: '🚗', color: '#f59e0b', trend: '-5%' },
    { id: 3, category: 'Shopping', amount: 120.00, icon: '🛍️', color: '#8b5cf6', trend: '+23%' },
    { id: 4, category: 'Entertainment', amount: 65.00, icon: '🎬', color: '#ec4899', trend: '+8%' },
    { id: 5, category: 'Bills', amount: 200.00, icon: '💡', color: '#06b6d4', trend: '0%' },
  ]);

  const [budget, setBudget] = React.useState(1000);
  const [newExpense, setNewExpense] = React.useState({ category: '', amount: '' });
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [hoveredExpense, setHoveredExpense] = React.useState(null);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentUsed = (totalSpent / budget) * 100;

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education'];
  const icons = { Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬', Bills: '💡', Health: '🏥', Education: '📚' };
  const colors = { Food: '#ef4444', Transport: '#f59e0b', Shopping: '#8b5cf6', Entertainment: '#ec4899', Bills: '#06b6d4', Health: '#22c55e', Education: '#3b82f6' };

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses(prev => [...prev, {
        id: Date.now(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        icon: icons[newExpense.category],
        color: colors[newExpense.category],
        trend: '+0%',
      }]);
      setNewExpense({ category: '', amount: '' });
      setShowAddForm(false);
    }
  };

  // Animated counter
  const AnimatedMoney = ({ value }) => {
    const [display, setDisplay] = React.useState(0);
    React.useEffect(() => {
      let start = 0;
      const increment = value / 60;
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) { setDisplay(value); clearInterval(timer); }
        else setDisplay(start);
      }, 16);
      return () => clearInterval(timer);
    }, [value]);
    return display.toFixed(2);
  };

  return (
    <>
      <h2 className="demo-title">Expense Tracker</h2>
      <p className="demo-subtitle">Track spending by category with budget progress ring, expense list, and add new expenses.</p>
      <div className="demo-area" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
        {/* Ambient background */}
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: '100%', maxWidth: 1150, display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 28, position: 'relative', zIndex: 1 }}
        >
        {/* Left Column - Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Budget Overview - Premium Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
            style={{
              padding: 32,
              background: 'linear-gradient(145deg, rgba(15, 15, 30, 0.9), rgba(25, 25, 50, 0.8))',
              backdropFilter: 'blur(20px)',
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative rings */}
            <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, border: '1px solid rgba(102, 126, 234, 0.1)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, border: '1px solid rgba(102, 126, 234, 0.15)', borderRadius: '50%' }} />

            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}
            >
              Monthly Budget
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              style={{ fontSize: '3.8rem', fontWeight: 800, marginBottom: 28, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              ${budget.toLocaleString()}
            </motion.div>

            {/* Progress Ring - Enhanced */}
            <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
              {/* Glow effect */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: 30, borderRadius: '50%',
                  background: `radial-gradient(circle, ${percentUsed > 90 ? 'rgba(239, 68, 68, 0.3)' : percentUsed > 70 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)'} 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <motion.circle
                  cx="100" cy="100" r="85"
                  fill="none"
                  stroke={`url(#expenseGradient${percentUsed > 90 ? 'Red' : percentUsed > 70 ? 'Yellow' : 'Green'})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={534}
                  initial={{ strokeDashoffset: 534 }}
                  animate={{ strokeDashoffset: 534 - (534 * Math.min(percentUsed, 100) / 100) }}
                  transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="expenseGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="expenseGradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="expenseGradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring' }}
                  style={{ fontSize: '2.5rem', fontWeight: 800, color: percentUsed > 90 ? '#ef4444' : percentUsed > 70 ? '#f59e0b' : '#22c55e' }}
                >
                  {percentUsed.toFixed(0)}%
                </motion.div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Budget Used</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                style={{ padding: 18, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>Spent</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>$<AnimatedMoney value={totalSpent} /></div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                style={{ padding: 18, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 16, border: '1px solid rgba(34, 197, 94, 0.2)' }}
              >
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>Remaining</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>$<AnimatedMoney value={remaining} /></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Add Expense Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              width: '100%', padding: 20, borderRadius: 18,
              background: showAddForm ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #667eea, #8b5cf6)',
              border: showAddForm ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
              color: '#fff', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              boxShadow: showAddForm ? 'none' : '0 8px 30px rgba(102, 126, 234, 0.35)',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              animate={{ rotate: showAddForm ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ fontSize: '1.4rem' }}
            >
              +
            </motion.span>
            {showAddForm ? 'Cancel' : 'Add New Expense'}
          </motion.button>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 100 }}
                style={{
                  padding: 28, background: 'rgba(15, 15, 30, 0.8)', backdropFilter: 'blur(20px)',
                  borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
                }}
              >
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 10, fontWeight: 600 }}>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                      fontSize: '0.95rem', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{icons[cat]} {cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 10, fontWeight: 600 }}>Amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', fontWeight: 600 }}>$</span>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      style={{
                        width: '100%', padding: '14px 18px 14px 36px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                        fontSize: '1.1rem', outline: 'none', fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
                <motion.button
                  style={{
                    width: '100%', padding: 16, borderRadius: 14,
                    background: 'linear-gradient(135deg, #22c55e, #10b981)', border: 'none',
                    color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addExpense}
                >
                  Add Expense
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Expenses List */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
          style={{
            padding: 32,
            background: 'rgba(15, 15, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Expenses</h3>
            <div style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(102, 126, 234, 0.15)', border: '1px solid rgba(102, 126, 234, 0.25)', fontSize: '0.8rem', color: '#667eea', fontWeight: 600 }}>
              {expenses.length} categories
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AnimatePresence>
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, scale: 0.9 }}
                  transition={{ delay: 0.4 + index * 0.08, type: 'spring' }}
                  onHoverStart={() => setHoveredExpense(expense.id)}
                  onHoverEnd={() => setHoveredExpense(null)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  style={{
                    padding: 20, borderRadius: 18,
                    background: hoveredExpense === expense.id
                      ? `linear-gradient(135deg, ${expense.color}15, ${expense.color}08)`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${hoveredExpense === expense.id ? expense.color + '30' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `linear-gradient(135deg, ${expense.color}25, ${expense.color}15)`,
                      border: `2px solid ${expense.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                      boxShadow: `0 4px 15px ${expense.color}20`,
                    }}
                  >
                    {expense.icon}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{expense.category}</span>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        color: expense.trend.startsWith('+') ? '#22c55e' : expense.trend.startsWith('-') ? '#ef4444' : 'rgba(255,255,255,0.4)',
                      }}>
                        {expense.trend}
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(expense.amount / totalSpent) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.08, duration: 0.8, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: `linear-gradient(90deg, ${expense.color}, ${expense.color}80)`,
                          boxShadow: `0 0 10px ${expense.color}40`,
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 6, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      {((expense.amount / totalSpent) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <motion.div
                      style={{ fontSize: '1.4rem', fontWeight: 800, color: expense.color }}
                      animate={hoveredExpense === expense.id ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      ${expense.amount.toFixed(2)}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total Bar - Premium */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            style={{
              marginTop: 24, padding: 24, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.15))',
              border: '1px solid rgba(102, 126, 234, 0.25)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Total Expenses</span>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>This month</div>
            </div>
            <motion.span
              style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ${totalSpent.toFixed(2)}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
