# Framer Motion Showcase

Complete interactive showcase with 213 Framer Motion examples across 24 categories.

## Features

- **213 Interactive Components** - All with live demos and copy-to-clipboard code
- **30 Workflow Automation Components** - Schedulers, debuggers, node canvas, data mappers
- **Premium Effects** - Meteors, aurora, particles, morphing shapes, DNA helix
- **Practical UI Patterns** - Accordions, tabs, carousels, modals, forms, charts
- **24 Categories** - Layout, Scroll, Text, 3D, Heroes, Analytics, Stock Market, and more
- **Next.js 14 App Router** - Modern React with static export

## Live Demo

View live at: [aliabassi.com/framer-motion-showcase](https://www.aliabassi.com/framer-motion-showcase/)

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Build

```bash
# Build static site
npm run build

# Output in ./out directory
```

## Structure

```
framer-motion-showcase/
├── app/
│   ├── page.jsx              # Main showcase app
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── demos/                # All 213 demo components
│       ├── WorkflowBuilderDemo.jsx
│       ├── NodeCanvasDemo.jsx
│       └── ... 211 more
├── lib/
│   ├── categories.js         # Category definitions
│   ├── demoNames.js          # Component display names
│   └── demoRegistry.js       # Component registry
└── next.config.js            # Next.js config with basePath
```

## Categories

- **Layout** - App Store transitions, reorderable lists, accordions
- **Scroll** - Parallax, hero effects, horizontal scroll
- **Text** - Scramble, reveal, flip, typewriter effects
- **3D** - Cards, cubes, books, carousels, tilt galleries
- **Premium** - Meteors, holographic cards, aurora effects
- **Workflow Automation** - Builders, schedulers, node systems
- **Stock Market** - Tickers, candlestick charts, order books
- **Voice Chat** - Waveforms, spectrograms, voice orbs
- **Analytics** - Line, bar, area, radar, scatter charts
- And 15+ more categories...

## Deployment

The showcase is configured to work in a subdirectory with `basePath: '/framer-motion-showcase'`.

To deploy elsewhere, update the basePath in `next.config.js`:

```js
const nextConfig = {
  basePath: '/your-path', // or remove for root deployment
  // ...
};
```

## Tech Stack

- **Next.js 14** - App Router with static export
- **Framer Motion 11** - Animation library
- **React 18** - UI library
- **TypeScript** - Type safety

## License

MIT
