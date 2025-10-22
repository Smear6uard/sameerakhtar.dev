# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Sameer Akhtar, built with Next.js 15.5.6, React 19, and TypeScript. The site features a modern, animated single-page application showcasing professional experience, projects, skills, and contact information.

## Commands

### Development
```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production with Turbopack
npm start          # Start production server
npm run lint       # Run ESLint
```

The development server runs on http://localhost:3000 by default.

## Architecture

### Framework & Routing
- **Next.js 15** with App Router (`src/app/` directory)
- Single-page application with hash-based navigation (#about, #projects, etc.)
- Client-side routing handled via smooth scrolling to section IDs

### Layout Structure
- `src/app/layout.tsx`: Root layout with ThemeProvider, Navigation, and Footer
- `src/app/page.tsx`: Main page that orchestrates all sections with scroll indicators
- Persistent navigation and footer across all pages

### Component Organization
Components are organized in `src/components/`:

**Core Components:**
- `navigation.tsx`: Sticky header with theme toggle, responsive mobile menu, and smooth scroll navigation
- `footer.tsx`: Site footer
- `theme-provider.tsx`: Wrapper for next-themes

**Section Components** (`src/components/sections/`):
All major page sections are separate components:
- `hero-section.tsx`: Landing section with typewriter name animation, CTA buttons, social links, and animated profile image
- `about-section.tsx`: About/bio information
- `projects-section.tsx`: Portfolio projects showcase
- `skills-section.tsx`: Technical skills display
- `resume-section.tsx`: Resume/experience timeline
- `contact-section.tsx`: Contact form and information

### Styling & Theming
- **Tailwind CSS 4** with custom configuration
- **Theme System**: Light/dark mode via `next-themes`
  - Default theme: light
  - System preference disabled
  - Theme controlled via Navigation component
- **Custom CSS Variables**: Defined in `src/app/globals.css`
  - Extensive color palette with semantic naming (primary, secondary, accent, success, warning, etc.)
  - Custom gradient definitions (gradient-primary, gradient-aurora, gradient-neon, etc.)
  - Separate color schemes for light/dark modes using `@media (prefers-color-scheme: dark)`
- **Custom CSS Classes**: Various animation and effect classes (gradient-text-animated, hover-lift, glow-hover, etc.)

### Animations & Interactions
- **Framer Motion**: Used extensively for animations
  - Hero section typewriter effect
  - Scroll-based animations
  - Floating gradient orbs and particles
  - Hover effects and transitions
  - Staggered children animations
- **Icon Libraries**:
  - `@heroicons/react` for UI icons
  - `lucide-react` for social icons

### Forms & Validation
- **react-hook-form**: Form state management (likely used in ContactSection)
- **zod**: Schema validation
- **@hookform/resolvers**: Integration between react-hook-form and zod

### Image Handling
- Next.js Image component with optimization
- Configured domains in `next.config.ts`: `images.unsplash.com`, `via.placeholder.com`
- Supports WebP and AVIF formats
- Profile image: `/public/LinkedIn pic.jpg`
- Resume PDF: `/public/Sameer-Akhtar-Resume.pdf`

### Path Aliases
- `@/*` maps to `src/*` (configured in `tsconfig.json`)

### Performance Optimizations
- **Turbopack**: Enabled for both dev and build
- **Package Import Optimization**: `framer-motion`, `@heroicons/react`, `lucide-react` are optimized via `next.config.ts`
- Geist fonts (Sans and Mono) loaded via `next/font/google`

## Key Implementation Details

### Navigation Behavior
- Hash-based navigation (#about, #projects, #skills, #resume, #contact)
- Smooth scrolling implemented via `scrollIntoView({ behavior: "smooth" })`
- Mobile menu closes automatically on navigation
- Sticky header with glass morphism effect on scroll

### Hero Section
- Typewriter animation for name (150ms per character)
- Delays subtitle and description until name animation completes
- Animated floating elements (gradient orbs and particles)
- Profile image with hover effects and shimmer animation
- Social links with individual gradient backgrounds

### Scroll Behavior
- Scroll indicator at bottom of viewport fades out after 100px scroll
- Sections have distinct gradient background overlays for visual separation

### Theme Toggle
- Managed by Navigation component
- Persists user preference
- Icons change based on current theme (Sun for dark mode, Moon for light mode)

## Fonts
- Primary: Geist Sans (system font fallback)
- Monospace: Geist Mono
- CSS variables: `--font-geist-sans`, `--font-geist-mono`

## TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Module: ESNext with bundler resolution
