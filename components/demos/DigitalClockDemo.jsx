'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function DigitalClockDemo() {
  const [time, setTime] = React.useState(new Date());
  const [timezone, setTimezone] = React.useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [is24Hour, setIs24Hour] = React.useState(false);
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [showMilliseconds, setShowMilliseconds] = React.useState(false);
  const [showDate, setShowDate] = React.useState(true);
  const [showTimezoneOffset, setShowTimezoneOffset] = React.useState(false);
  const [displayTheme, setDisplayTheme] = React.useState('dark');
  const [animationStyle, setAnimationStyle] = React.useState('flip');
  const [worldClocksVisible, setWorldClocksVisible] = React.useState(false);
  const [prevDigits, setPrevDigits] = React.useState({});

  React.useEffect(() => {
    const interval = showMilliseconds ? 50 : 1000;
    const timer = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [showMilliseconds]);

  const timezones = [
    { tz: 'America/New_York', label: 'New York', flag: '🗽', short: 'NYC' },
    { tz: 'Europe/London', label: 'London', flag: '🇬🇧', short: 'LON' },
    { tz: 'Asia/Tokyo', label: 'Tokyo', flag: '🇯🇵', short: 'TYO' },
    { tz: 'Australia/Sydney', label: 'Sydney', flag: '🇦🇺', short: 'SYD' },
    { tz: 'America/Los_Angeles', label: 'Los Angeles', flag: '🌴', short: 'LAX' },
    { tz: 'Europe/Paris', label: 'Paris', flag: '🇫🇷', short: 'PAR' },
    { tz: 'Asia/Dubai', label: 'Dubai', flag: '🇦🇪', short: 'DXB' },
    { tz: 'Asia/Singapore', label: 'Singapore', flag: '🇸🇬', short: 'SIN' },
    { tz: 'America/Chicago', label: 'Chicago', flag: '🌆', short: 'CHI' },
    { tz: 'Asia/Hong_Kong', label: 'Hong Kong', flag: '🇭🇰', short: 'HKG' },
  ];

  const themes = {
    dark: {
      bg: 'linear-gradient(145deg, rgba(15,15,25,0.98) 0%, rgba(10,10,20,0.98) 100%)',
      digitBg: 'linear-gradient(180deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.98) 50%, rgba(15,15,30,0.95) 100%)',
      colors: ['#667eea', '#764ba2', '#f093fb'],
      glowColor: 'rgba(102,126,234,0.25)',
      textColor: '#fff',
      subTextColor: 'rgba(255,255,255,0.6)',
    },
    light: {
      bg: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
      digitBg: 'linear-gradient(180deg, #ffffff 0%, #f8f9fb 50%, #f5f7fa 100%)',
      colors: ['#2563eb', '#7c3aed', '#db2777'],
      glowColor: 'rgba(37,99,235,0.15)',
      textColor: '#1e293b',
      subTextColor: '#64748b',
    },
    neon: {
      bg: 'linear-gradient(145deg, #000000 0%, #0a0a0a 100%)',
      digitBg: 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(5,5,5,0.98) 50%, rgba(0,0,0,0.95) 100%)',
      colors: ['#00ffff', '#ff00ff', '#ffff00'],
      glowColor: 'rgba(0,255,255,0.4)',
      textColor: '#00ffff',
      subTextColor: '#ff00ff',
    },
    matrix: {
      bg: 'linear-gradient(145deg, #0d0208 0%, #001a00 100%)',
      digitBg: 'linear-gradient(180deg, rgba(0,20,0,0.95) 0%, rgba(0,10,0,0.98) 50%, rgba(0,5,0,0.95) 100%)',
      colors: ['#00ff41', '#00cc33', '#00ff88'],
      glowColor: 'rgba(0,255,65,0.3)',
      textColor: '#00ff41',
      subTextColor: '#00cc33',
    },
    retro: {
      bg: 'linear-gradient(145deg, #2d1b00 0%, #1a0f00 100%)',
      digitBg: 'linear-gradient(180deg, rgba(60,30,0,0.95) 0%, rgba(40,20,0,0.98) 50%, rgba(30,15,0,0.95) 100%)',
      colors: ['#ff6b35', '#ff9f1c', '#ffbf69'],
      glowColor: 'rgba(255,107,53,0.3)',
      textColor: '#ff6b35',
      subTextColor: '#ffbf69',
    },
  };

  const currentTheme = themes[displayTheme];

  const getTimeComponents = (date, tz = timezone) => {
    const opts = { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24Hour };
    const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(date);
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const second = parts.find(p => p.type === 'second')?.value || '00';
    const period = parts.find(p => p.type === 'dayPeriod')?.value || '';
    const millisecond = String(date.getMilliseconds()).padStart(3, '0');
    return { hour, minute, second, period, millisecond };
  };

  const getTimezoneOffset = (tz) => {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' });
    const parts = formatter.formatToParts(new Date());
    return parts.find(p => p.type === 'timeZoneName')?.value || '';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const { hour, minute, second, period, millisecond } = getTimeComponents(time);
  const dateStr = formatDate(time);
  const currentTz = timezones.find(t => t.tz === timezone) || { label: timezone, flag: '🌍', short: 'UTC' };
  const tzOffset = getTimezoneOffset(timezone);

  const FlipDigit = ({ value, label, color, size = 'large' }) => {
    const isChanged = prevDigits[label + value] !== value;
    React.useEffect(() => {
      if (isChanged) setPrevDigits(prev => ({ ...prev, [label + value]: value }));
    }, [value, label, isChanged]);

    const dimensions = size === 'large' ? { width: '70px', height: '90px', fontSize: '3rem' }
                     : size === 'medium' ? { width: '50px', height: '65px', fontSize: '2rem' }
                     : { width: '32px', height: '42px', fontSize: '1.3rem' };

    const getAnimation = () => {
      if (animationStyle === 'flip') {
        return isChanged ? { rotateX: [-90, 0], opacity: [0, 1] } : {};
      } else if (animationStyle === 'slide') {
        return isChanged ? { y: [-20, 0], opacity: [0, 1] } : {};
      } else {
        return isChanged ? { opacity: [0, 1], scale: [0.8, 1] } : {};
      }
    };

    return (
      <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size === 'small' ? '4px' : '8px' }}>
        <motion.div
          key={value}
          initial={isChanged ? getAnimation() : false}
          animate={isChanged ? { rotateX: 0, y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: animationStyle === 'fade' ? 0.2 : 0.3, ease: 'easeOut' }}
          style={{
            ...dimensions,
            borderRadius: size === 'small' ? '8px' : '16px',
            background: currentTheme.digitBg,
            border: displayTheme === 'light' ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontFamily: 'SF Mono, Monaco, monospace',
            color: currentTheme.textColor, position: 'relative', overflow: 'hidden',
            boxShadow: displayTheme === 'neon' || displayTheme === 'matrix'
              ? `0 0 20px ${color}, 0 0 40px ${color}40, inset 0 0 10px ${color}20`
              : `0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px ${color}20`,
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: displayTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.4)' }} />
          <span style={{
            background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: displayTheme === 'neon' || displayTheme === 'matrix' ? `drop-shadow(0 0 8px ${color})` : 'none'
          }}>{value}</span>
        </motion.div>
        {label && <span style={{ fontSize: size === 'small' ? '0.5rem' : '0.65rem', color: currentTheme.subTextColor, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>{label}</span>}
      </motion.div>
    );
  };

  const Separator = ({ color = currentTheme.colors[0] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 8px', marginBottom: '24px' }}>
      {[0, 1].map(i => (
        <motion.div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </div>
  );

  const SmallSeparator = ({ color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 4px', marginBottom: '12px' }}>
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, opacity: 0.6 }} />
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, opacity: 0.6 }} />
    </div>
  );

  const WorldClockCard = ({ tz }) => {
    const tzData = timezones.find(t => t.tz === tz);
    const { hour, minute, second } = getTimeComponents(time, tz);
    const offset = getTimezoneOffset(tz);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: currentTheme.digitBg,
          borderRadius: '16px',
          padding: '16px',
          border: displayTheme === 'light' ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
          minWidth: '200px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>{tzData.flag}</span>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: currentTheme.textColor }}>{tzData.label}</div>
            <div style={{ fontSize: '0.65rem', color: currentTheme.subTextColor, opacity: 0.6 }}>{offset}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <FlipDigit value={hour[0]} label="" color={currentTheme.colors[0]} size="small" />
          <FlipDigit value={hour[1]} label="" color={currentTheme.colors[0]} size="small" />
          <SmallSeparator color={currentTheme.colors[0]} />
          <FlipDigit value={minute[0]} label="" color={currentTheme.colors[1]} size="small" />
          <FlipDigit value={minute[1]} label="" color={currentTheme.colors[1]} size="small" />
          <SmallSeparator color={currentTheme.colors[1]} />
          <FlipDigit value={second[0]} label="" color={currentTheme.colors[2]} size="small" />
          <FlipDigit value={second[1]} label="" color={currentTheme.colors[2]} size="small" />
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Digital Clock</h2>
        <p className="demo-subtitle">Production-grade digital clock with multiple themes, world clocks, and advanced display options</p>
      </div>
      <div className="demo-area">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: currentTheme.bg, borderRadius: '32px', border: displayTheme === 'light' ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)', marginBottom: '24px' }}>

            <motion.div style={{ position: 'absolute', top: '-50%', left: '50%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)`, filter: 'blur(80px)', transform: 'translateX(-50%)', pointerEvents: 'none' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

            <div style={{ padding: '20px 28px', borderBottom: displayTheme === 'light' ? '2px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{currentTz.flag}</span>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: currentTheme.textColor }}>{currentTz.label}</div>
                  <div style={{ fontSize: '0.7rem', color: currentTheme.subTextColor, opacity: 0.6 }}>
                    {timezone} {showTimezoneOffset && `(${tzOffset})`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <motion.button onClick={() => setIs24Hour(!is24Hour)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: is24Hour ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: is24Hour ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {is24Hour ? '24H' : '12H'}
                </motion.button>
                <motion.button onClick={() => setShowSeconds(!showSeconds)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: showSeconds ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: showSeconds ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  SEC
                </motion.button>
                <motion.button onClick={() => setShowMilliseconds(!showMilliseconds)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: showMilliseconds ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: showMilliseconds ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  MS
                </motion.button>
                <motion.button onClick={() => setShowDate(!showDate)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: showDate ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: showDate ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  DATE
                </motion.button>
                <motion.button onClick={() => setShowTimezoneOffset(!showTimezoneOffset)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: showTimezoneOffset ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: showTimezoneOffset ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  UTC
                </motion.button>
                <motion.button onClick={() => setWorldClocksVisible(!worldClocksVisible)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: worldClocksVisible ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: worldClocksVisible ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  🌍 WORLD
                </motion.button>
              </div>
            </div>

            <div style={{ padding: '40px 28px 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'wrap', gap: '8px' }}>
              <FlipDigit value={hour[0]} label="hour" color={currentTheme.colors[0]} />
              <FlipDigit value={hour[1]} label="" color={currentTheme.colors[0]} />
              <Separator color={currentTheme.colors[0]} />
              <FlipDigit value={minute[0]} label="min" color={currentTheme.colors[1]} />
              <FlipDigit value={minute[1]} label="" color={currentTheme.colors[1]} />
              {showSeconds && (
                <>
                  <Separator color={currentTheme.colors[1]} />
                  <FlipDigit value={second[0]} label="sec" color={currentTheme.colors[2]} />
                  <FlipDigit value={second[1]} label="" color={currentTheme.colors[2]} />
                </>
              )}
              {showMilliseconds && (
                <>
                  <Separator color={currentTheme.colors[2]} />
                  <FlipDigit value={millisecond[0]} label="ms" color={currentTheme.colors[2]} size="medium" />
                  <FlipDigit value={millisecond[1]} label="" color={currentTheme.colors[2]} size="medium" />
                  <FlipDigit value={millisecond[2]} label="" color={currentTheme.colors[2]} size="medium" />
                </>
              )}
              {!is24Hour && period && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ marginLeft: '16px', padding: '8px 14px', borderRadius: '10px', background: `linear-gradient(135deg, ${currentTheme.colors[0]} 0%, ${currentTheme.colors[1]} 100%)`, fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '24px', boxShadow: displayTheme === 'neon' ? `0 0 20px ${currentTheme.colors[0]}` : 'none' }}>
                  {period}
                </motion.div>
              )}
            </div>

            {showDate && (
              <div style={{ textAlign: 'center', paddingBottom: '24px' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ fontSize: '1.1rem', color: currentTheme.subTextColor, fontWeight: 500 }}>
                  {dateStr}
                </motion.div>
              </div>
            )}

            <div style={{ padding: '16px 24px', borderTop: displayTheme === 'light' ? '2px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', background: displayTheme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: currentTheme.subTextColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.6 }}>Theme</div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '12px' }}>
                {Object.keys(themes).map((theme, i) => (
                  <motion.button key={theme} onClick={() => setDisplayTheme(theme)}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '8px 16px', borderRadius: '10px', border: displayTheme === theme ? `2px solid ${themes[theme].colors[0]}` : displayTheme === 'light' ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', background: displayTheme === theme ? `${themes[theme].colors[0]}20` : themes[theme].bg, color: displayTheme === theme ? themes[theme].colors[0] : themes[theme].textColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                    {theme}
                  </motion.button>
                ))}
              </div>

              <div style={{ fontSize: '0.7rem', color: currentTheme.subTextColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', marginTop: '12px', opacity: 0.6 }}>Animation</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['flip', 'slide', 'fade'].map((anim) => (
                  <motion.button key={anim} onClick={() => setAnimationStyle(anim)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: animationStyle === anim ? `${currentTheme.colors[0]}40` : displayTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', color: animationStyle === anim ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                    {anim}
                  </motion.button>
                ))}
              </div>

              <div style={{ fontSize: '0.7rem', color: currentTheme.subTextColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.6 }}>Timezone</div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {timezones.map((tz, i) => (
                  <motion.button key={tz.tz} onClick={() => setTimezone(tz.tz)}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '10px 14px', borderRadius: '12px', border: timezone === tz.tz ? `2px solid ${currentTheme.colors[0]}` : displayTheme === 'light' ? '2px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', background: timezone === tz.tz ? `${currentTheme.colors[0]}20` : displayTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', color: timezone === tz.tz ? currentTheme.colors[0] : currentTheme.subTextColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                    <span>{tz.flag}</span> {tz.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {worldClocksVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: currentTheme.textColor, fontWeight: 700, marginBottom: '16px' }}>World Clocks</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {timezones.filter(tz => tz.tz !== timezone).slice(0, 6).map((tz) => (
                    <WorldClockCard key={tz.tz} tz={tz.tz} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
