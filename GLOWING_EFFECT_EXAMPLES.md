# Glowing Effect - Integration Examples for Your Portfolio

## Example 1: Projects Section with Glowing Effect

Add this to your projects cards for an interactive border effect:

```tsx
// src/components/sections/projects-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

// In your project card mapping:
{projects.map((project) => (
  <motion.div
    key={project.id}
    variants={itemVariants}
    className="group relative modern-card overflow-hidden interactive-hover"
  >
    {/* Add Glowing Effect */}
    <GlowingEffect
      disabled={false}
      glow={true}
      proximity={80}
      spread={40}
      inactiveZone={0.01}
      borderWidth={2}
    />
    
    {/* Gradient Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
    
    {/* Rest of your project card content */}
    <div className="relative h-full flex flex-col p-4 sm:p-6 lg:p-8">
      {/* ... */}
    </div>
  </motion.div>
))}
```

## Example 2: Skills Section Category Cards

Add subtle interactive glow to your skill category cards:

```tsx
// src/components/sections/skills-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

{skillCategories.map((category, categoryIndex) => (
  <motion.div
    key={categoryIndex}
    variants={itemVariants}
    className="relative modern-card p-4 sm:p-6 lg:p-8 interactive-hover"
  >
    {/* Add Glowing Effect */}
    <GlowingEffect
      disabled={false}
      glow={true}
      proximity={64}
      spread={35}
      inactiveZone={0.05}
      borderWidth={2}
    />
    
    {/* Category Header */}
    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* ... */}
    </div>
    
    {/* Skills list */}
    <div className="space-y-2 sm:space-y-3">
      {/* ... */}
    </div>
  </motion.div>
))}
```

## Example 3: Resume Experience Cards

Add to experience cards with custom colors matching your theme:

```tsx
// src/components/sections/resume-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

{experience.map((job, index) => (
  <motion.div
    key={index}
    variants={itemVariants}
    className="relative group cursor-pointer"
  >
    {/* Background Gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ...`} />
    
    {/* Add Glowing Effect */}
    <GlowingEffect
      disabled={false}
      glow={true}
      proximity={60}
      spread={30}
      inactiveZone={0.1}
      borderWidth={1.5}
    />
    
    {/* Card Content */}
    <div className="relative modern-card p-5 sm:p-6 border border-gray-200/80">
      {/* ... */}
    </div>
  </motion.div>
))}
```

## Example 4: Hero Section CTA Buttons

Add glowing effect to your main call-to-action buttons:

```tsx
// src/components/sections/hero-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

<motion.a
  href="/Sameer-Akhtar-Resume.pdf"
  download
  className="relative inline-flex items-center justify-center group overflow-hidden rounded-xl px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
>
  <GlowingEffect
    disabled={false}
    glow={true}
    proximity={50}
    spread={45}
    inactiveZone={0.2}
    borderWidth={2}
    className="opacity-50"
  />
  
  {/* Button content */}
  <ArrowDownTrayIcon className="relative w-5 h-5 mr-3" />
  <span className="relative">Download Resume</span>
</motion.a>
```

## Example 5: Contact Form with Glowing Border

Add interactive borders to your contact form:

```tsx
// src/components/sections/contact-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

<motion.form
  variants={itemVariants}
  onSubmit={handleSubmit}
  className="relative modern-card p-6 sm:p-8 space-y-6"
>
  <GlowingEffect
    disabled={false}
    glow={true}
    proximity={100}
    spread={40}
    inactiveZone={0.05}
    borderWidth={2}
  />
  
  {/* Form fields */}
  <div className="relative">
    {/* ... */}
  </div>
</motion.form>
```

## Example 6: About Section Stats Cards

Add subtle glow to your stats/metrics cards:

```tsx
// src/components/sections/about-section.tsx
import { GlowingEffect } from "@/components/ui/glowing-effect";

<motion.div 
  className="relative text-center p-4 sm:p-6 modern-card group interactive-hover"
>
  <GlowingEffect
    disabled={false}
    glow={true}
    proximity={50}
    spread={25}
    inactiveZone={0.1}
    borderWidth={1.5}
  />
  
  <div className="relative text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">
    3.8
  </div>
  <div className="relative text-xs sm:text-sm text-muted-foreground">
    GPA
  </div>
</motion.div>
```

## Performance Tips

### Mobile Optimization
Disable the effect on mobile devices for better performance:

```tsx
'use client';
import { useState, useEffect } from 'react';

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);

<GlowingEffect
  disabled={isMobile} // Disable on mobile
  glow={true}
  proximity={64}
  spread={40}
/>
```

### Conditional Rendering
Only add to featured/important cards:

```tsx
{projects.slice(0, 2).map((project) => (
  <div className="relative">
    <GlowingEffect disabled={false} glow={true} {...config} />
    {/* Card content */}
  </div>
))}

{projects.slice(2).map((project) => (
  <div className="relative">
    {/* No glowing effect for other cards */}
    {/* Card content */}
  </div>
))}
```

## Color Customization

To match your portfolio's purple theme, you can customize the gradient:

```tsx
// Create a custom variant in glowing-effect.tsx
// Or override with inline styles:

<div
  ref={containerRef}
  style={{
    ...otherStyles,
    '--gradient': `radial-gradient(circle, #9333ea 10%, #9333ea00 20%),
                   radial-gradient(circle at 40% 40%, #7c3aed 5%, #7c3aed00 15%),
                   radial-gradient(circle at 60% 60%, #6d28d9 10%, #6d28d900 20%),
                   repeating-conic-gradient(
                     from 236.84deg at 50% 50%,
                     #9333ea 0%,
                     #7c3aed calc(50% / var(--repeating-conic-gradient-times)),
                     #9333ea calc(100% / var(--repeating-conic-gradient-times))
                   )`
  } as React.CSSProperties}
/>
```

## Recommended Settings by Section

| Section | disabled | proximity | spread | inactiveZone | borderWidth |
|---------|----------|-----------|--------|--------------|-------------|
| Projects | false | 80 | 40 | 0.01 | 2 |
| Skills | false | 64 | 35 | 0.05 | 2 |
| Resume | false | 60 | 30 | 0.1 | 1.5 |
| Stats Cards | false | 50 | 25 | 0.1 | 1.5 |
| Buttons | false | 50 | 45 | 0.2 | 2 |
| Contact Form | false | 100 | 40 | 0.05 | 2 |

## Testing

After integration, test:
1. ✅ Effect activates on hover
2. ✅ Effect follows mouse cursor smoothly
3. ✅ No performance issues during scrolling
4. ✅ Works across different screen sizes
5. ✅ Doesn't interfere with existing interactions
6. ✅ Looks good in both light and dark mode

