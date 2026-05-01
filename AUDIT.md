# Site Audit — May 1, 2026

## Summary
- Total issues found: 10
- Critical (blocks shipping): 2
- High (visible quality issue): 3
- Medium (polish): 3
- Low (nice-to-have): 2

## Critical Issues

### Lens remains active over Selected Work and intercepts clicks
- **Section:** hero / work / global
- **Mode:** both
- **What's wrong:** Clicking the top-bar WORK anchor lands with the hero still barely intersecting the viewport, so the lens and detection overlay remain mounted above the Selected Work section. At the audited 1440px desktop viewport, the work section starts at the top of the viewport while the lens hit target still covers the middle of the work card area. `elementsFromPoint(720, 500)` reports `DIV.lens-hit` above the work card content, and `.lens-hit` has `pointer-events: auto`, so work-card clicks can be stolen by the lens instead of reaching project links or rail controls.
- **Where in code:** `app/components/hero/Hero.tsx:172-190`, `app/components/hero/Hero.tsx:274-335`, `app/components/hero/Lens.tsx:11-31`, `app/styles/global.css:223-248`, `app/styles/global.css:469-490`, `app/styles/global.css:754-758`
- **Reproduction steps:**
  1. Open `http://127.0.0.1:3000/` at 1440px width.
  2. Click the top-bar `WORK` nav item.
  3. Move the cursor over the centered work-card area and click project controls or links.
  4. Observe that the lens is still visible and the top hit-tested element is `.lens-hit`, not the work card.
- **Severity rationale:** This blocks a primary navigation path and can prevent core portfolio interactions from firing. It affects the first major section after the hero, so it is a shipping blocker rather than a visual-only problem.

### Mobile lens and detection layer make the page unusable
- **Section:** hero / work / global
- **Mode:** both
- **What's wrong:** On a 375px viewport, the lens renders as a 750px fixed circle because `--lens-r` remains 150px and the visual lens scales to `calc(var(--lens-r) * 5)`. The lens extends from `left: -187.5px` to `right: 562.5px` and covers essentially the entire mobile viewport. Annotation labels and the detection counter stack over the hero copy and continue into the work anchor state, making text hard to read and causing a large `pointer-events: auto` hit target to sit above content.
- **Where in code:** `app/components/hero/Hero.tsx:274-335`, `app/components/hero/Lens.tsx:11-31`, `app/styles/global.css:205-210`, `app/styles/global.css:223-248`, `app/styles/global.css:526-543`, `app/styles/global.css:625-636`, `app/styles/global.css:711-715`
- **Reproduction steps:**
  1. Resize the browser to 375px width.
  2. Load the top of the page in light mode, then dark mode.
  3. Scroll to `#work`.
  4. Observe the oversized lens ring, labels, detection counter, and hit target covering hero/work content.
- **Severity rationale:** The mobile experience cannot be shown in its current state because the primary content is obscured and hit-testing is dominated by the lens layer.

## High Issues

### About portrait and photography assets are missing
- **Section:** about
- **Mode:** both
- **What's wrong:** The about portrait and all referenced photography rail images request files under `/images/...`, but the repo has no `public/images/` directory. The browser records six 404s and the UI renders fallback slabs with uppercase labels instead of the intended portrait and photography. This makes the About section feel incomplete, especially because the portrait and photo rail are major visual components.
- **Where in code:** `app/components/about/PortraitCard.tsx:3`, `app/components/about/PortraitCard.tsx:29-44`, `app/components/about/Photography.tsx:3-9`, `app/components/about/Photography.tsx:66-117`
- **Reproduction steps:**
  1. Open the page and scroll to the About section.
  2. Watch the Network panel or console during initial load.
  3. Observe 404s for `/images/portrait.jpg`, `/images/wrigley.jpg`, `/images/chicago-skyline.jpg`, `/images/colorado.jpg`, `/images/utah.jpg`, and `/images/portrait-2.jpg`.
  4. Observe fallback blocks where real imagery should appear.
- **Severity rationale:** The site remains navigable, but a visual portfolio with missing primary imagery reads as visibly unfinished.

### Dark-mode contrast is too low across cards and technical text
- **Section:** work / timeline / about / footer
- **Mode:** dark
- **What's wrong:** Several dark-mode surfaces and labels have very weak separation from the page background. Work cards, pipeline diagrams, timeline metadata, about microcopy, and footer/chrome text use dim foreground and border tokens on near-black surfaces, so body copy and technical labels become hard to scan. The section designs feel much more intentional in light mode than in dark mode.
- **Where in code:** `app/styles/global.css:70-101`, `app/styles/global.css:737-750`, `app/styles/global.css:869-940`, `app/styles/global.css:1601-1719`, `app/styles/global.css:1903-1909`, `app/styles/global.css:2234-2240`
- **Reproduction steps:**
  1. Load the site in dark mode.
  2. Scroll through Selected Work, Timeline, About, and Footer.
  3. Compare card boundaries, metadata, pipeline node labels, and small body text against the background.
  4. Toggle back to light mode and observe that the same hierarchy is clearer.
- **Severity rationale:** This does not block navigation, but it makes multiple below-fold sections look under-designed and harder to read.

### Mobile contact actions collide with the fixed bottom bar
- **Section:** contact / bottom bar
- **Mode:** both
- **What's wrong:** At 375px width near the Contact anchor, the fixed bottom bar sits over the lower contact action area. The social link row begins under or behind the bottom chrome, and the email action sits very close to the fixed bar. The section is still present, but the final conversion controls feel crowded and partially obscured.
- **Where in code:** `app/components/layout/AppShell.tsx:20-24`, `app/components/layout/BottomBar.tsx:1-18`, `app/components/contact/Contact.tsx:75-114`, `app/styles/global.css:2346-2377`, `app/styles/global.css:2379-2410`
- **Reproduction steps:**
  1. Resize the browser to 375px width.
  2. Navigate to `#contact` or scroll to the Contact section.
  3. Observe the bottom fixed chrome overlapping the lower portion of the contact actions.
  4. Toggle dark mode and confirm the same layout relationship.
- **Severity rationale:** Contact is the terminal conversion section. The page technically works, but the main action area is visibly compromised on mobile.

## Medium Issues

### Persistent left rail is only an empty structural border
- **Section:** global
- **Mode:** both
- **What's wrong:** A fixed left rail exists, but it is empty, `aria-hidden`, and contains no persistent nav icons or social links. The phase-1 note specified an empty structural rail, while the old site reportedly had nav icons and social links at the bottom. Git history shows the current empty `SideRail` was introduced in `eb07760 Rebuild phase 1 foundation with TanStack Start`; there is no later loss in this TanStack Start codepath.
- **Where in code:** `app/components/layout/AppShell.tsx:10-15`, `app/components/layout/SideRail.tsx:5-13`
- **Reproduction steps:**
  1. Open the site at desktop width.
  2. Inspect the left edge of the viewport.
  3. Observe only an empty rail/border, with no icons or social link cluster.
- **Severity rationale:** The structural rail exists, so this is not a hard failure against the phase-1 implementation note, but it is incomplete relative to the previous persistent rail behavior described in the audit brief.

### Top-bar navigation is absent on mobile
- **Section:** top bar
- **Mode:** both
- **What's wrong:** At 375px width, the logo and theme toggle remain visible, but the top-bar nav items `INDEX`, `WORK`, and `WRITING` are hidden and no replacement mobile navigation is present. The nav links exist in the DOM, but they are not available visually or interactively at the audited mobile viewport.
- **Where in code:** `app/components/layout/TopBar.tsx:3-6`, `app/components/layout/TopBar.tsx:21-32`
- **Reproduction steps:**
  1. Resize the browser to 375px width.
  2. Look at the top bar in light and dark modes.
  3. Observe that only the logo and theme toggle are visible.
- **Severity rationale:** This does not break desktop navigation, but it removes section navigation from the mobile top bar.

### HEAT mode leaves visible backdrop-filter smear artifacts
- **Section:** hero / global
- **Mode:** both
- **What's wrong:** Moving the lens in HEAT mode leaves soft blurred/brownish trails and ghosted outlines behind the cursor path. The effect is especially visible after several quick cursor moves across the hero. Scrolling did not show a persistent global stutter, but the lens rendering itself has visible artifacts in this mode.
- **Where in code:** `app/styles/global.css:417-429`, `app/styles/global.css:461-467`, `app/styles/global.css:600-607`
- **Reproduction steps:**
  1. Load the hero section.
  2. Press `H` to switch to HEAT mode.
  3. Move the cursor across the hero several times.
  4. Observe the temporary smearing/ghosting inside and around the lens.
- **Severity rationale:** The interaction still works, but the rendering artifact is noticeable during a featured hero effect.

## Low Issues

### Right-edge vertical text disappears on mobile
- **Section:** right-edge vertical text
- **Mode:** both
- **What's wrong:** The vertical right-edge text is visible on desktop but hidden at the audited 375px viewport. This appears intentional from the responsive class usage, but the audit brief listed it as persistent chrome, so its mobile absence is worth recording.
- **Where in code:** `app/components/layout/AppShell.tsx:10-15`
- **Reproduction steps:**
  1. Open the site at desktop width and observe the right-edge vertical label.
  2. Resize to 375px width.
  3. Observe that the right-edge text is no longer rendered visibly.
- **Severity rationale:** It does not affect content or interaction, and the hidden state may be intentional responsive behavior.

### Dark-mode chrome and side-rail borders are barely visible
- **Section:** top bar / bottom bar / footer / side rails
- **Mode:** dark
- **What's wrong:** The fixed chrome and side rails use very faint dark-mode borders, so the page frame nearly disappears against dark section backgrounds. The top and bottom bars still function, but their boundaries are much clearer in light mode than in dark mode.
- **Where in code:** `app/styles/global.css:70-101`, `app/components/layout/TopBar.tsx:11`, `app/components/layout/BottomBar.tsx:3`, `app/components/layout/SideRail.tsx:12`
- **Reproduction steps:**
  1. Load the page in dark mode.
  2. Compare top bar, bottom bar, side rails, and footer separators against the page background.
  3. Toggle to light mode and compare the same boundaries.
- **Severity rationale:** This is a design refinement issue, not a functional or readability blocker.

## Cross-Cutting Findings

### Lens scope
The lens is scoped by hero intersection, but the current threshold allows it to remain visible and interactive when the page lands at `#work`. At `/#work` on a 1440px viewport, the hero bottom was still around 80px from the top of the viewport and the lens still existed. At a slightly deeper scroll position where the hero bottom was around `-250px`, the lens unmounted correctly. On mobile, the same lens remains oversized and interactive at the work anchor. Click-to-cycle is bound to `.lens-hit`, so clicks inside that hit area cycle modes and can also intercept intended clicks on content beneath it.

### Sidebar / left rail
A fixed left-side rail exists as empty structure, but it has no icons, social links, or interactive affordances. The current empty rail was introduced in `eb07760 Rebuild phase 1 foundation with TanStack Start`; it was not lost in a later commit inside this TanStack Start implementation.

### Asset inventory
- /public/images/portrait.jpg: missing
- /public/images/wrigley.jpg: missing
- /public/images/chicago-skyline.jpg: missing
- /public/images/colorado.jpg: missing
- /public/images/utah.jpg: missing
- /public/images/portrait-2.jpg: missing

`public/images/` does not exist. The app renders portrait and photography fallbacks instead of the intended images. Existing image assets are under other paths such as `public/profile.jpg` and `public/photography/...`.

### Console errors
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/portrait.jpg`
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/wrigley.jpg`
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/chicago-skyline.jpg`
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/colorado.jpg`
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/utah.jpg`
- `Failed to load resource: the server responded with a status of 404 ()` for `http://127.0.0.1:3000/images/portrait-2.jpg`

No blocking JavaScript exceptions were observed. Dev-only console entries also appeared: `[vite] connecting...`, `[vite] connected.`, and `%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold`.

### Network failures
- 404 `http://127.0.0.1:3000/images/portrait.jpg`
- 404 `http://127.0.0.1:3000/images/wrigley.jpg`
- 404 `http://127.0.0.1:3000/images/chicago-skyline.jpg`
- 404 `http://127.0.0.1:3000/images/colorado.jpg`
- 404 `http://127.0.0.1:3000/images/utah.jpg`
- 404 `http://127.0.0.1:3000/images/portrait-2.jpg`

### Content and typography checks
Hero copy is correct and says `From research labs to production`; no `App Store` copy appears in the hero. The timeline source does not contain `Kubernetes`. The about bio does not contain an em dash. A source search for U+2014 em dash in `app`, `public`, and `README.md` returned no matches. The intended font families are present: Fraunces for display, Bricolage Grotesque for body, and JetBrains Mono for technical text; display/body/mono utility classes and font-variation settings are defined in `app/styles/global.css`.

### Anchor navigation
Desktop `INDEX`, `WORK`, and `WRITING` links are present. `WORK` navigates to `/#work` and scrolls smoothly enough to land the work section near the top of the viewport, but that landing position leaves the lens mounted and interactive. `WRITING` points to `/writing`; this audit focused on the portfolio page requested in the prompt.

### Theme toggle
The theme toggle responds in the top bar, updates `aria-pressed`, and switches between light and dark. No blocking flicker or broken intermediate theme state was observed during the audited toggles, though the dark-mode contrast issues above remain after the transition.

## Files Most Likely Implicated
- `app/components/hero/Hero.tsx`
- `app/components/hero/Lens.tsx`
- `app/components/hero/DetectionLayer.tsx`
- `app/hooks/useLensPosition.ts`
- `app/styles/global.css`
- `app/components/about/PortraitCard.tsx`
- `app/components/about/Photography.tsx`
- `app/components/layout/AppShell.tsx`
- `app/components/layout/SideRail.tsx`
- `app/components/layout/TopBar.tsx`
- `app/components/layout/BottomBar.tsx`
- `app/components/contact/Contact.tsx`
- `public/images/portrait.jpg`
- `public/images/wrigley.jpg`
- `public/images/chicago-skyline.jpg`
- `public/images/colorado.jpg`
- `public/images/utah.jpg`
- `public/images/portrait-2.jpg`
