---
name: framer-motion
description: Framer Motion - Production-grade React animation library for declarative animations, gestures, layout transitions, and scroll effects
metadata:
  tags: framer-motion, react, animation, gestures, layout, scroll, spring, variants, drag, 3d, design-system
---

## Purpose

This skill provides Claude Code and AI coding agents with comprehensive context for building polished, production-ready animated frontends using Framer Motion. It includes design principles, animation patterns, and 101 working examples.

## When to Use

Use this skill when:
- Building React applications that need animations
- Creating interactive UI components with gestures (hover, tap, drag)
- Implementing shared element transitions (App Store-style hero animations)
- Building scroll-triggered animations or parallax effects
- Need physics-based spring animations
- Creating exit animations with AnimatePresence
- Animating layout changes automatically
- Building 3D card effects or perspective transforms
- Designing landing pages, hero sections, or marketing sites
- Adding micro-interactions to improve UX

---

## Design Principles

### 1. Motion Should Have Purpose
Every animation should serve a function:
- **Guide attention** - Direct users to important elements
- **Provide feedback** - Confirm actions (button press, form submit)
- **Show relationships** - Connect related elements (shared layouts)
- **Reduce cognitive load** - Smooth transitions help users track changes

### 2. Respect User Preferences
```jsx
// Always check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
/>
```

### 3. The 12 Principles of Animation (Applied to UI)

| Principle | UI Application |
|-----------|----------------|
| **Squash & Stretch** | Button press feedback, elastic effects |
| **Anticipation** | Hover states before click, pull-to-refresh |
| **Staging** | Hero sections, focal points, z-index layers |
| **Follow Through** | Overshoot on spring animations, momentum |
| **Slow In/Out (Easing)** | Natural acceleration/deceleration |
| **Arcs** | Circular menus, natural motion paths |
| **Secondary Action** | Ripples, particles, shadow changes |
| **Timing** | Duration based on distance/importance |
| **Exaggeration** | Micro-interactions, delight moments |
| **Appeal** | Consistent style, brand personality |

### 4. Duration Guidelines

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Micro-interaction (hover, tap) | 100-200ms | `easeOut` |
| Small elements | 200-300ms | `easeInOut` |
| Medium transitions | 300-400ms | `easeInOut` |
| Large/complex animations | 400-600ms | `easeInOut` |
| Page transitions | 300-500ms | `easeInOut` |
| Attention-grabbing | 600-1000ms | `spring` |

### 5. Easing Philosophy

```jsx
// WRONG: Linear feels robotic
transition={{ duration: 0.3, ease: "linear" }}

// RIGHT: Natural easing
transition={{ duration: 0.3, ease: "easeOut" }}

// BEST: Spring physics for organic feel
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

### 6. Stagger for Visual Hierarchy
```jsx
// Creates visual flow and reduces cognitive overload
staggerChildren: 0.05  // Fast, energetic
staggerChildren: 0.1   // Balanced, readable
staggerChildren: 0.15  // Slow, dramatic
```

### 7. The 60fps Rule
- Keep animations at 60fps (16.67ms per frame)
- Animate only `transform` and `opacity` when possible
- Avoid animating `width`, `height`, `top`, `left` (use `scale`, `x`, `y`)
- Use `will-change` sparingly for complex animations

---

## Installation

### NPM (React projects)
```bash
npm install framer-motion
```

```jsx
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
```

### CDN (for HTML demos)
```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://unpkg.com/framer-motion@11/dist/framer-motion.js"></script>
<script>
  const { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } = Motion;
</script>
```

---

## Core Concepts

### Basic Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### Gestures (Hover, Tap, Drag)
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileDrag={{ rotate: 5 }}
  drag
  dragConstraints={{ left: -100, right: 100 }}
/>
```

### Spring Physics
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 300,  // Higher = snappier
    damping: 20,     // Higher = less bounce
    mass: 1          // Higher = heavier feel
  }}
/>
```

### Exit Animations (AnimatePresence)
```jsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    />
  )}
</AnimatePresence>
```

### Layout Animations
```jsx
// Automatic FLIP animations - just add 'layout' prop
<motion.div layout>
  {isExpanded ? "Large content" : "Small"}
</motion.div>

// Shared element transitions
<motion.div layoutId="hero-image" />
```

### Variants (Orchestration)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i} variants={item}>{i}</motion.li>
  ))}
</motion.ul>
```

---

## Scroll Animations

### Scroll Progress
```jsx
const { scrollYProgress } = useScroll();

<motion.div style={{ scaleX: scrollYProgress }} />
```

### Scroll-Linked Transforms
```jsx
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});

const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

<motion.div style={{ opacity, y }} />
```

### Scroll Velocity
```jsx
const { scrollY } = useScroll();
const scrollVelocity = useVelocity(scrollY);
const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
```

---

## Motion Values & Hooks

### useMotionValue
```jsx
const x = useMotionValue(0);
const background = useTransform(x, [-100, 100], ["#ff0000", "#0000ff"]);

<motion.div drag="x" style={{ x, background }} />
```

### useSpring
```jsx
const x = useMotionValue(0);
const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
```

### useMotionTemplate
```jsx
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const background = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent)`;
```

---

## Common Patterns

### Magnetic Button
```jsx
function MagneticButton({ children }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - left - width / 2) * 0.3,
      y: (e.clientY - top - height / 2) * 0.3
    });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
```

### 3D Card Tilt
```jsx
function TiltCard({ children }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    rotateX.set((e.clientY - rect.top - rect.height / 2) / -10);
    rotateY.set((e.clientX - rect.left - rect.width / 2) / 10);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
```

### Spotlight Card
```jsx
function SpotlightCard({ children }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.1), transparent 80%)`;

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove}>
      <motion.div style={{ position: "absolute", inset: 0, background }} />
      {children}
    </motion.div>
  );
}
```

### Stagger Grid
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.div key={i} variants={item} />)}
</motion.div>
```

### Reorder List
```jsx
import { Reorder } from "framer-motion";

<Reorder.Group values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item.id} value={item}>
      {item.label}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

### Text Blur Reveal
```jsx
const words = text.split(" ");

{words.map((word, i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ delay: i * 0.1, duration: 0.4 }}
  >
    {word}{" "}
  </motion.span>
))}
```

### Spring-Animated Counter
```jsx
function Counter({ value }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });

  useEffect(() => {
    motionValue.set(value);
  }, [value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}
```

### Parallax Depth Effect
```jsx
function ParallaxCard({ children, depth = 1 }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const x = useTransform(smoothX, [-0.5, 0.5], [-30 * depth, 30 * depth]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-30 * depth, 30 * depth]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </motion.div>
  );
}
```

---

## Spring Physics Guide

| Effect | Stiffness | Damping | Mass | Use Case |
|--------|-----------|---------|------|----------|
| Snappy UI | 300-500 | 25-35 | 0.5-1 | Buttons, toggles |
| Smooth | 100-200 | 20-30 | 1 | Page transitions |
| Bouncy | 300-400 | 10-15 | 1 | Playful interactions |
| Heavy | 100 | 30-40 | 2-3 | Dragging large elements |
| Elastic | 200 | 5-10 | 1 | Notifications, alerts |
| Gentle | 50-100 | 15-25 | 1 | Background elements |

---

## Color & Visual Design Tips

### Glassmorphism
```jsx
style={{
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 16
}}
```

### Gradient Backgrounds
```jsx
// Animated gradient mesh
const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
style={{
  background: `radial-gradient(circle at 20% 80%, ${colors[0]}40, transparent 50%),
               radial-gradient(circle at 80% 20%, ${colors[1]}40, transparent 50%),
               radial-gradient(circle at 40% 40%, ${colors[2]}30, transparent 40%)`
}}
```

### Glow Effects
```jsx
style={{
  boxShadow: '0 0 20px rgba(102, 126, 234, 0.5), 0 0 40px rgba(102, 126, 234, 0.3)'
}}

// Animated glow on hover
whileHover={{
  boxShadow: '0 0 30px rgba(102, 126, 234, 0.8), 0 0 60px rgba(102, 126, 234, 0.4)'
}}
```

---

## Performance Best Practices

1. **Use `transform` and `opacity`** - Hardware accelerated
2. **Avoid layout thrashing** - Don't animate `width`, `height`, `top`, `left`
3. **Use `layoutId` for shared transitions** - More performant than manual FLIP
4. **Debounce mouse events** - Use `useSpring` to smooth rapid updates
5. **Lazy load heavy animations** - Use `useInView` to animate only visible elements
6. **Reduce motion for accessibility** - Check `prefers-reduced-motion`

---

## Component Architecture

### Composable Animation Wrapper
```jsx
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    {children}
  </motion.div>
);

// Usage
<FadeIn delay={0.2}>
  <Card />
</FadeIn>
```

### Animation Variants Library
```jsx
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};
```

---

## Examples

**101 Working Demos:**
- `framer-motion-ultimate.html` - Complete showcase with all patterns

**Categories (101 total):**
- **Basics** (10) - Hover, tap, spring, keyframes, path, gesture, inView, whileInView, dragToReorder, layoutGroup
- **Layout** (10) - App Store expand, reorder list, accordion, tabs, shared layout, masonry, grid toggle, sidebar, modal, drawer
- **Scroll** (10) - Parallax, horizontal scroll, progress bar, reveal, sticky, velocity, snap, infinite, zoom, timeline
- **Text** (10) - Scramble, blur reveal, typewriter, split, gradient, highlight, counter, marquee, flip, glitch
- **Interaction** (10) - Magnetic button, cursor follow, drag rotate, gesture unlock, swipe cards, pinch zoom, press hold, double tap, pan, fling
- **Effects** (10) - Aurora, particles, blob, morph, liquid, noise, grain, scanlines, CRT, glitch
- **3D** (10) - Flip card, cube, book, carousel, tilt, parallax layers, sphere, ring, stack, perspective grid
- **UI** (10) - Notifications, skeleton, counter, bento grid, pricing toggle, testimonials, FAQ, newsletter, footer, logo cloud
- **Pro** (11) - Border beam, spotlight, gradient follow, orbit, shimmer, pulse ring, floating, breathe, wave, ripple, magnetic field
- **Premium+** (10) - Meteors, holographic card, confetti, typing cursor, liquid blob, infinite scroll, particle trail, morph text, ripple button, glow button

---

## Quick Reference

| Feature | Code |
|---------|------|
| Basic animate | `<motion.div animate={{ x: 100 }} />` |
| Spring | `transition={{ type: "spring", stiffness: 300 }}` |
| Gesture | `whileHover={{ scale: 1.1 }}` |
| Exit | `<AnimatePresence><motion.div exit={{ opacity: 0 }} /></AnimatePresence>` |
| Layout | `<motion.div layout />` |
| Shared | `<motion.div layoutId="hero" />` |
| Scroll | `const { scrollYProgress } = useScroll()` |
| Transform | `useTransform(scrollY, [0, 100], [0, 1])` |
| Spring value | `useSpring(value, { stiffness: 300 })` |
| Template | `useMotionTemplate\`translate(${x}px, ${y}px)\`` |
| Variants | `variants={{ hidden: {}, show: {} }}` |
| Stagger | `staggerChildren: 0.1` |
| Reorder | `<Reorder.Group values={items}>` |
| In View | `whileInView={{ opacity: 1 }}` |
| Drag | `drag dragConstraints={{ left: 0, right: 100 }}` |

---

## API Documentation

Full docs: https://www.framer.com/motion/

Key pages:
- Animation: https://www.framer.com/motion/animation/
- Gestures: https://www.framer.com/motion/gestures/
- Layout: https://www.framer.com/motion/layout-animations/
- Scroll: https://www.framer.com/motion/scroll-animations/
- useMotionValue: https://www.framer.com/motion/use-motion-value/
- useSpring: https://www.framer.com/motion/use-spring/
- useTransform: https://www.framer.com/motion/use-transform/
