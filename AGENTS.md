# AGENTS.md

## 🤖 Welcome, Agents!

This file is your primary guide to navigating, understanding, and contributing to the **Framer Motion Showcase** project.

### 🎯 Project Overview
This repository is a comprehensive showcase of **Framer Motion** animations and interactive components, built with **Next.js 16** (App Router). It features over 200 examples across various categories like 3D, Text, Scroll, and Workflow Automation.

### 🛠 Tech Stack
- **CMS**: Sanity 5.18
- **AI**: OpenAI
- **Framework**: Next.js 16 (App Router)
- **Animation**: Framer Motion 11
- **Language**: TypeScript / JavaScript (Note: Project uses `.jsx` for components but supports TS via `tsconfig.json`)
- **Styling**: Custom CSS (via `app/globals.css`). No Tailwind CSS.

### 📂 Project Structure
- `app/`: Next.js App Router pages and global styles (`globals.css`).
- `components/demos/`: The core of the project. Contains all interactive demo components.
- `lib/`:
  - `demoRegistry.js`: Maps string IDs to component imports. **You must update this when adding a new demo.**
  - `categories.js`: Defines categories and lists demos within them. **You must update this to make a demo visible.**
- `public/`: Static assets.

### ⚡ Quick Start & Workflow

1.  **Install Dependencies**: `npm install`
2.  **Run Development Server**: `npm run dev`
    - Open `http://localhost:3000` to view the app.
3.  **Build**: `npm run build`

### 🧩 Creating a New Demo Component

To add a new showcase component, follow these steps:

1.  **Create the File**: Add a new `.jsx` file in `components/demos/` (e.g., `MyNewDemo.jsx`).
2.  **Use the Template**:
    ```jsx
    'use client';

    import React from 'react';
    import { motion } from 'framer-motion';

    export default function MyNewDemo() {
      return (
        <>
          <h2 className="demo-title">My New Demo</h2>
          <p className="demo-subtitle">A brief description of what this animation demonstrates.</p>
          <div className="demo-area">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 100,
                height: 100,
                background: '#4299e1',
                borderRadius: 20
              }}
            >
              Animated Content
            </motion.div>
          </div>
        </>
      );
    }
    ```
3.  **Register the Component**:
    - Open `lib/demoRegistry.js`.
    - Import your component: `import MyNewDemo from '../components/demos/MyNewDemo';`
    - Add it to the `demoComponents` object: `'mynewdemo': MyNewDemo,`
4.  **Categorize the Component**:
    - Open `lib/categories.js`.
    - Add the ID (`'mynewdemo'`) to the appropriate category array (e.g., `'UI'`, `'Effects'`).

### 🎨 Styling Guidelines
- Use the global classes defined in `app/globals.css`:
  - `.demo-title`: For the main heading of your demo.
  - `.demo-subtitle`: For the description.
  - `.demo-area`: Wrapper for the main interactive content.
- For component-specific styles, use inline styles or `style` prop on motion components. Avoid adding too much global CSS unless necessary.

### ⚠️ Known Issues
- **Live Demo Link**: The link in `README.md` (`https://www.aliabassi.com/framer-motion-showcase/`) may be offline. Rely on running the project locally (`npm run dev`) to preview changes.

### 🧪 Verification
- Always verify your changes by running the dev server and navigating to your new component.
- Ensure animations are smooth and performant.

Happy Coding! 🚀
