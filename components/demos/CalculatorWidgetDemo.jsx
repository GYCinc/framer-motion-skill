'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function CalculatorWidgetDemo() {
  const [display, setDisplay] = React.useState('0');
  const [previousValue, setPreviousValue] = React.useState(null);
  const [operation, setOperation] = React.useState(null);
  const [newNumber, setNewNumber] = React.useState(true);
  const [memory, setMemory] = React.useState(0);
  const [history, setHistory] = React.useState([]);
  const [isScientific, setIsScientific] = React.useState(false);
  const [pressedBtn, setPressedBtn] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    if (previousValue === null) {
      setPreviousValue(parseFloat(display));
    } else if (operation) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, parseFloat(display), operation);
      const expr = `${previousValue} ${operation} ${display} = ${result}`;
      setHistory(h => [expr, ...h].slice(0, 5));
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setNewNumber(false);
    }
  };

  const handlePercent = () => setDisplay(String(parseFloat(display) / 100));
  const handleSqrt = () => setDisplay(String(Math.sqrt(parseFloat(display))));
  const handleSquare = () => setDisplay(String(Math.pow(parseFloat(display), 2)));
  const handleSin = () => setDisplay(String(Math.sin(parseFloat(display) * Math.PI / 180)));
  const handleCos = () => setDisplay(String(Math.cos(parseFloat(display) * Math.PI / 180)));
  const handleLog = () => setDisplay(String(Math.log10(parseFloat(display))));
  const handleLn = () => setDisplay(String(Math.log(parseFloat(display))));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const basicButtons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const scientificButtons = [
    ['sin', 'cos', 'log', 'ln'],
    ['√', 'x²', 'MC', 'MR'],
    ['M+', 'M-', '(', ')'],
  ];

  const isOperator = (btn) => ['+', '-', '×', '÷'].includes(btn);
  const isSpecial = (btn) => ['C', '±', '%'].includes(btn);
  const isMemory = (btn) => ['MC', 'MR', 'M+', 'M-'].includes(btn);
  const isSciFn = (btn) => ['sin', 'cos', 'log', 'ln', '√', 'x²'].includes(btn);

  const handleBtn = (btn) => {
    setPressedBtn(btn);
    setTimeout(() => setPressedBtn(null), 100);

    if (btn === 'C') handleClear();
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') handlePercent();
    else if (btn === '.') handleDecimal();
    else if (btn === '=') handleEquals();
    else if (isOperator(btn)) handleOperator(btn);
    else if (btn === 'sin') handleSin();
    else if (btn === 'cos') handleCos();
    else if (btn === 'log') handleLog();
    else if (btn === 'ln') handleLn();
    else if (btn === '√') handleSqrt();
    else if (btn === 'x²') handleSquare();
    else if (btn === 'MC') setMemory(0);
    else if (btn === 'MR') { setDisplay(String(memory)); setNewNumber(true); }
    else if (btn === 'M+') setMemory(m => m + parseFloat(display));
    else if (btn === 'M-') setMemory(m => m - parseFloat(display));
    else if (!['(', ')'].includes(btn)) handleNumber(btn);
  };

  const Button = ({ btn, flex = 1 }) => {
    const isZeroBtn = btn === '0';
    const isEqualsBtn = btn === '=';
    const isPressed = pressedBtn === btn;

    return (
      <motion.button
        onClick={() => handleBtn(btn)}
        style={{
          flex: isZeroBtn ? 2 : flex,
          height: isScientific ? 50 : 60,
          borderRadius: 14,
          background: isEqualsBtn
            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            : isOperator(btn)
            ? 'rgba(102, 126, 234, 0.2)'
            : isSpecial(btn)
            ? 'rgba(255,255,255,0.08)'
            : isMemory(btn)
            ? 'rgba(67, 233, 123, 0.15)'
            : isSciFn(btn)
            ? 'rgba(250, 112, 154, 0.15)'
            : 'rgba(255,255,255,0.05)',
          border: isEqualsBtn
            ? 'none'
            : isOperator(btn)
            ? '1px solid rgba(102, 126, 234, 0.4)'
            : isMemory(btn)
            ? '1px solid rgba(67, 233, 123, 0.3)'
            : isSciFn(btn)
            ? '1px solid rgba(250, 112, 154, 0.3)'
            : '1px solid rgba(255,255,255,0.08)',
          color: isEqualsBtn
            ? '#fff'
            : isOperator(btn)
            ? '#667eea'
            : isSpecial(btn)
            ? '#f093fb'
            : isMemory(btn)
            ? '#43e97b'
            : isSciFn(btn)
            ? '#fa709a'
            : '#fff',
          fontSize: isSciFn(btn) ? '0.85rem' : isOperator(btn) || isSpecial(btn) || isEqualsBtn ? '1.3rem' : '1.4rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isEqualsBtn ? '0 8px 24px rgba(240, 147, 251, 0.3)' : 'none',
        }}
        animate={{ scale: isPressed ? 0.92 : 1, background: isPressed && !isEqualsBtn ? 'rgba(255,255,255,0.15)' : undefined }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
      >
        {btn}
      </motion.button>
    );
  };

  return (
    <>
      <h2 className="demo-title">Calculator Widget</h2>
      <p className="demo-subtitle">Memory functions, history tape, scientific mode, and haptic-style feedback</p>
      <div className="demo-area">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', justifyContent: 'center' }}>
          <motion.div
            style={{
              width: isScientific ? 340 : 300,
              background: 'rgba(20, 20, 30, 0.9)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 20,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Animated background */}
            <motion.div
              style={{
                position: 'absolute', bottom: -80, left: -80,
                width: 250, height: 250, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                filter: 'blur(80px)', opacity: 0.2,
              }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Mode toggle + Memory indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 1 }}>
              <motion.button
                onClick={() => setIsScientific(!isScientific)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: 'none',
                  background: isScientific ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {isScientific ? '⚡ Scientific' : '🔢 Basic'}
              </motion.button>
              {memory !== 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: '4px 8px', borderRadius: '6px',
                    background: 'rgba(67, 233, 123, 0.15)', border: '1px solid rgba(67, 233, 123, 0.3)',
                    fontSize: '0.65rem', color: '#43e97b', fontWeight: 600,
                  }}
                >
                  M: {memory}
                </motion.div>
              )}
            </div>

            {/* Display */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
              <motion.div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: 16,
                  padding: '20px 16px',
                  textAlign: 'right',
                  minHeight: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {operation && previousValue !== null && (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                    {previousValue} {operation}
                  </div>
                )}
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', wordBreak: 'break-all' }}>
                  {display}
                </div>
              </motion.div>
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: copied ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: copied ? '#43e97b' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              >
                {copied ? '✓ Copied' : '📋'}
              </motion.button>
            </div>

            {/* Scientific buttons */}
            {isScientific && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ marginBottom: 12 }}
              >
                {scientificButtons.map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    {row.map(btn => <Button key={btn} btn={btn} />)}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Basic buttons */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {basicButtons.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {row.map(btn => <Button key={btn} btn={btn} />)}
                </div>
              ))}
            </div>
          </motion.div>

          {/* History panel */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                width: 200,
                background: 'rgba(20, 20, 30, 0.8)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 16,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                History
              </div>
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.7)',
                    padding: '8px 0',
                    borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
