# Framer Motion Skill for AI Coding Agents

**A comprehensive context package for Claude Code and AI coding agents to build polished, production-ready animated frontends.**

## What is This?

This repo contains a **skill file** designed to give AI coding assistants (like Claude Code, Cursor, Windsurf, etc.) deep context about Framer Motion animation patterns. When loaded into an AI's context, it enables the AI to:

- Write production-quality Framer Motion code
- Apply proper animation design principles
- Use correct spring physics and easing
- Implement advanced patterns (3D, parallax, shared layouts)
- Follow performance best practices
- Create accessible animations (respects `prefers-reduced-motion`)

## Contents

| File | Description |
|------|-------------|
| `SKILL.md` | The skill context file - design principles, API reference, patterns, and best practices |
| `framer-motion-ultimate.html` | 101 working demo components - open in browser to preview |

## How to Use

### With Claude Code

1. Copy `SKILL.md` to your Claude Code skills directory:
   ```bash
   cp SKILL.md ~/.claude/skills/framer-motion/SKILL.md
   ```

2. The skill will be automatically loaded when you work on React animation tasks.

### With Other AI Assistants

Paste the contents of `SKILL.md` into your AI's context or system prompt when working on frontend animations.

### As a Reference

Open `framer-motion-ultimate.html` in your browser to see all 101 patterns in action. Each demo is self-contained and can be copied into your projects.

## What's in SKILL.md?

### Design Principles
- Motion should have purpose (guide attention, provide feedback, show relationships)
- The 12 Principles of Animation applied to UI
- Duration and easing guidelines
- 60fps performance rules
- Accessibility considerations

### API Coverage
- Basic animations (`animate`, `initial`, `exit`)
- Gestures (`whileHover`, `whileTap`, `drag`)
- Spring physics (stiffness, damping, mass)
- Layout animations (`layout`, `layoutId`)
- Scroll animations (`useScroll`, `useTransform`)
- Motion values (`useMotionValue`, `useSpring`, `useMotionTemplate`)
- Variants and orchestration

### 20+ Ready-to-Use Patterns
- Magnetic button
- 3D card tilt
- Spotlight effect
- Stagger grid
- Text blur reveal
- Spring-animated counter
- Parallax depth
- And more...

### Spring Physics Guide

| Effect | Stiffness | Damping | Mass | Use Case |
|--------|-----------|---------|------|----------|
| Snappy UI | 300-500 | 25-35 | 0.5-1 | Buttons, toggles |
| Smooth | 100-200 | 20-30 | 1 | Page transitions |
| Bouncy | 300-400 | 10-15 | 1 | Playful interactions |
| Heavy | 100 | 30-40 | 2-3 | Dragging large elements |
| Elastic | 200 | 5-10 | 1 | Notifications, alerts |

## Demo Categories (101 Total)

- **Basics** (10) - Hover, tap, spring, keyframes, gestures
- **Layout** (10) - App Store expand, reorder, accordion, tabs, shared layout
- **Scroll** (10) - Parallax, horizontal scroll, progress, reveal, velocity
- **Text** (10) - Scramble, blur reveal, typewriter, split, gradient
- **Interaction** (10) - Magnetic, cursor follow, drag, swipe cards
- **Effects** (10) - Aurora, particles, blob, morph, liquid
- **3D** (10) - Flip card, cube, book, carousel, tilt, parallax
- **UI** (10) - Notifications, skeleton, counter, bento, pricing
- **Pro** (11) - Border beam, spotlight, orbit, shimmer, pulse
- **Premium+** (10) - Meteors, holographic, confetti, typing cursor

## Why This Exists

AI coding assistants are powerful but need context to produce high-quality, idiomatic code. This skill provides:

1. **Design knowledge** - Not just API syntax, but when and why to use animations
2. **Best practices** - Performance, accessibility, and UX considerations
3. **Working examples** - 101 demos that prove the patterns work
4. **Quick reference** - Easy lookup tables for common needs

## License

MIT - Use freely in your projects and AI workflows.

## Contributing

PRs welcome! If you have animation patterns that should be included, open a PR with:
1. The pattern added to `SKILL.md`
2. A working demo added to `framer-motion-ultimate.html`

---

**Built for the AI-assisted development era.**
