'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function AudioControlsDemo() {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = React.useState(false);
  const [inputVolume, setInputVolume] = React.useState(75);
  const [outputVolume, setOutputVolume] = React.useState(80);
  const [inputDevice, setInputDevice] = React.useState('default');
  const [outputDevice, setOutputDevice] = React.useState('default');
  const [noiseCancel, setNoiseCancel] = React.useState(true);
  const [echoCancellation, setEchoCancellation] = React.useState(true);
  const [autoGain, setAutoGain] = React.useState(true);
  const [inputLevel, setInputLevel] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('input');
  const [preset, setPreset] = React.useState('balanced');

  const inputDevices = [
    { id: 'default', name: 'MacBook Pro Microphone', icon: '💻', quality: 'Good' },
    { id: 'airpods', name: 'AirPods Pro', icon: '🎧', quality: 'Excellent' },
    { id: 'external', name: 'Blue Yeti', icon: '🎙️', quality: 'Studio' },
  ];

  const outputDevices = [
    { id: 'default', name: 'MacBook Pro Speakers', icon: '🔊' },
    { id: 'airpods', name: 'AirPods Pro', icon: '🎧' },
    { id: 'monitor', name: 'External Monitor', icon: '🖥️' },
  ];

  const presets = [
    { id: 'voice', label: 'Voice Call', icon: '📞', settings: { noise: true, echo: true, gain: true } },
    { id: 'balanced', label: 'Balanced', icon: '⚖️', settings: { noise: true, echo: true, gain: false } },
    { id: 'music', label: 'Music', icon: '🎵', settings: { noise: false, echo: false, gain: false } },
    { id: 'studio', label: 'Studio', icon: '🎚️', settings: { noise: true, echo: true, gain: true } },
  ];

  // Simulate input level
  React.useEffect(() => {
    if (isMuted) { setInputLevel(0); return; }
    const interval = setInterval(() => {
      setInputLevel(Math.random() * 0.6 + 0.2);
    }, 100);
    return () => clearInterval(interval);
  }, [isMuted]);

  // Apply preset
  const applyPreset = (p) => {
    setPreset(p.id);
    setNoiseCancel(p.settings.noise);
    setEchoCancellation(p.settings.echo);
    setAutoGain(p.settings.gain);
  };

  const Toggle = ({ enabled, onChange }) => (
    <motion.div onClick={onChange} style={{ width: 48, height: 26, borderRadius: 13, padding: 3, background: enabled ? '#6366f1' : 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
      <motion.div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} animate={{ x: enabled ? 22 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </motion.div>
  );

  return (
    <>
      <div className="demo-header">
        <h2 className="demo-title">Audio Controls</h2>
        <p className="demo-subtitle">Professional audio panel with input/output controls, level monitoring, and presets</p>
      </div>
      <div className="demo-area">
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(12, 12, 20, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>

            {/* Main mute buttons */}
            <div style={{ padding: '24px', display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Microphone button */}
              <motion.div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: isMuted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsMuted(!isMuted)}>
                <div style={{ position: 'relative' }}>
                  <motion.div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    animate={{ background: isMuted ? '#ef4444' : '#6366f1' }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      {isMuted ? <><path d="M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></> : <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>}
                    </svg>
                  </motion.div>
                  {!isMuted && <motion.div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid #6366f1' }} animate={{ scale: [1, 1.3], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{isMuted ? 'Muted' : 'Mic On'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Click to {isMuted ? 'unmute' : 'mute'}</div>
                </div>
              </motion.div>

              {/* Speaker button */}
              <motion.div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: isSpeakerMuted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}>
                <motion.div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  animate={{ background: isSpeakerMuted ? '#ef4444' : '#10b981' }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    {isSpeakerMuted ? <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></> : <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></>}
                  </svg>
                </motion.div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{isSpeakerMuted ? 'Speaker Off' : 'Speaker On'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Click to {isSpeakerMuted ? 'unmute' : 'mute'}</div>
                </div>
              </motion.div>
            </div>

            {/* Input level meter */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Input Level</span>
                <span style={{ fontSize: '0.75rem', color: inputLevel > 0.8 ? '#ef4444' : '#10b981' }}>{Math.round(inputLevel * 100)}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                <motion.div style={{ height: '100%', borderRadius: 4, background: inputLevel > 0.8 ? 'linear-gradient(90deg, #10b981, #ef4444)' : 'linear-gradient(90deg, #10b981, #22d3ee)' }}
                  animate={{ width: `${inputLevel * 100}%` }} transition={{ duration: 0.05 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.6rem', color: '#555' }}>
                <span>-60 dB</span><span>-20 dB</span><span>0 dB</span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['input', 'output', 'enhance'].map(tab => (
                <motion.button key={tab} onClick={() => setActiveTab(tab)} whileHover={{ color: '#fff' }}
                  style={{ flex: 1, padding: '14px', background: 'none', border: 'none', color: activeTab === tab ? '#fff' : '#666', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', position: 'relative', textTransform: 'capitalize' }}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#6366f1' }} />}
                </motion.button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: '20px 24px' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'input' && (
                  <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Input Volume</span>
                      <span style={{ fontSize: '0.8rem', color: '#6366f1', fontFamily: 'monospace' }}>{inputVolume}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={inputVolume} onChange={(e) => setInputVolume(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#6366f1', marginBottom: '20px' }}
                    />

                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px' }}>Input Device</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {inputDevices.map(device => (
                        <motion.button key={device.id} onClick={() => setInputDevice(device.id)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${inputDevice === device.id ? '#6366f1' : 'rgba(255,255,255,0.08)'}`, background: inputDevice === device.id ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.2)', cursor: 'pointer', textAlign: 'left' }}>
                          <span style={{ fontSize: '1.2rem' }}>{device.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontSize: '0.85rem' }}>{device.name}</div>
                            <div style={{ color: '#666', fontSize: '0.65rem' }}>{device.quality}</div>
                          </div>
                          {inputDevice === device.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></motion.div>}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'output' && (
                  <motion.div key="output" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Output Volume</span>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontFamily: 'monospace' }}>{outputVolume}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={outputVolume} onChange={(e) => setOutputVolume(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981', marginBottom: '20px' }}
                    />

                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px' }}>Output Device</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {outputDevices.map(device => (
                        <motion.button key={device.id} onClick={() => setOutputDevice(device.id)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${outputDevice === device.id ? '#10b981' : 'rgba(255,255,255,0.08)'}`, background: outputDevice === device.id ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.2)', cursor: 'pointer', textAlign: 'left' }}>
                          <span style={{ fontSize: '1.2rem' }}>{device.icon}</span>
                          <span style={{ color: '#fff', fontSize: '0.85rem', flex: 1 }}>{device.name}</span>
                          {outputDevice === device.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></motion.div>}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'enhance' && (
                  <motion.div key="enhance" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    {/* Presets */}
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px' }}>Quick Presets</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                      {presets.map(p => (
                        <motion.button key={p.id} onClick={() => applyPreset(p)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: preset === p.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)', background: preset === p.id ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.2)', cursor: 'pointer', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{p.icon}</div>
                          <div style={{ fontSize: '0.65rem', color: preset === p.id ? '#fff' : '#888' }}>{p.label}</div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Enhancement toggles */}
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px' }}>Audio Enhancements</div>
                    {[
                      { id: 'noise', label: 'Noise Cancellation', desc: 'Remove background noise', icon: '🔇', enabled: noiseCancel, toggle: () => setNoiseCancel(!noiseCancel) },
                      { id: 'echo', label: 'Echo Cancellation', desc: 'Reduce audio feedback', icon: '🔊', enabled: echoCancellation, toggle: () => setEchoCancellation(!echoCancellation) },
                      { id: 'gain', label: 'Auto Gain Control', desc: 'Normalize volume levels', icon: '📊', enabled: autoGain, toggle: () => setAutoGain(!autoGain) },
                    ].map(item => (
                      <motion.div key={item.id} whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', marginBottom: '6px', cursor: 'pointer' }} onClick={item.toggle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                          <div>
                            <div style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '2px' }}>{item.label}</div>
                            <div style={{ color: '#666', fontSize: '0.65rem' }}>{item.desc}</div>
                          </div>
                        </div>
                        <Toggle enabled={item.enabled} onChange={item.toggle} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
