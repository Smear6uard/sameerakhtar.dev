# Night ride: home page redesign

Approved by Sameer on 2026-11-16 ("Yes, build it"). Items marked **(my call)** were
decided by Claude and are open to correction.

## Intent

The home page becomes one continuous black-car ride through Chicago at dusk, rendered
in three.js. It exists to make Sameer memorable to recruiters for 2027 new-grad roles:
he integrated dispatch at a limo company, then built Renaro for taxi and limo fleets.
The current site is a standard layout with effects on top and reads flat.

## Goals

- One idea carried through the whole page: scroll is the drive, sections are stops.
- Art direction of a fashion campaign film: slow low camera, huge upright display type,
  mostly black with coral and indigo as light sources.
- Every fact a recruiter needs stays as real, readable DOM text.

## Non-goals

- Photoreal car or city. Everything is built in code; night and lighting carry it.
- Redesigning case-study and blog pages. They keep their layout and take the new tokens.

## Anti-goals

- Italics, script or handwriting fonts, aphoristic copy.
- Anything that reads as a designer's portfolio rather than an engineer's.
- A page that is unusable on a phone, without WebGL, or with reduced motion.

## Approaches considered

1. **Night ride, fashion-campaign art direction (chosen).** Logical spine from his
   career, with the aesthetic he liked about fashion applied to the surface.
2. **Pure fashion runway or lookbook.** Rejected: centres one project of seven and
   signals "designer".
3. **Dispatch console only (2D live map).** Folded into option 1 as the HUD and as the
   top-down moment at the Renaro stop.

## Design

**Route.** A straight Chicago avenue on a real street grid. Sky moves from coral sunset
to midnight indigo with scroll. Stops, in recruiter-priority order **(my call)**:

| #   | Stop               | Set piece                                                          |
| --- | ------------------ | ------------------------------------------------------------------ |
| 0   | Pick-up (hero)     | Car at the kerb at sunset, name as cover type                      |
| 1   | Quantum Metric     | Tower whose LED facade cycles brand palettes                       |
| 2   | Renaro             | Camera cranes to top-down; the grid becomes a live dispatch map    |
| 3   | Styleum            | Lit boutique window with mannequins, sideways tracking shot        |
| 4   | More work          | Theatre marquee listing HazardLens, WindWalk, LLM Router, DeepCite |
| 5   | About              | Backlit billboards showing his four photographs; education, skills |
| 6   | Drop-off (contact) | End of the pier, the wheel and the skyline behind the car          |

**Scene.** Plain three.js, no React renderer **(my call)**. Wet road via planar
reflection, bloom, fog, light rain, the L overhead, instanced buildings with a
procedural window shader, cross traffic.

**Page structure.** Each stop is a normal `<section>` in document flow, followed by an
empty gap. The canvas is fixed behind. While a section crosses the middle of the viewport
the car rests at its stop; the gap is the drive to the next one. The page reports one
number on that hold/drive timeline and the engine eases toward it. Without the canvas the
same DOM is a normal readable page. (As built: the first draft of this spec had sticky
full-height panels, which would have clipped the longer stops on short screens.)

**HUD.** A transit strip fixed at the bottom: one station per stop, the car as a marker
between them, the current stop named beside it. Each station links to its section.

**Type.** Big Shoulders Display (commissioned for the City of Chicago) for display
**(my call)**, Satoshi for body, JetBrains Mono for readouts. Upright only.

**Palette.** Existing Chicago dusk tokens, with the home page pushed darker.

**Fallbacks.** Reduced motion or no WebGL: no canvas, static dusk backdrop. Phones:
lower pixel ratio, no planar reflection, fewer instances. Rendering pauses when hidden.

**Removed from the home page (my call).** The hand-tracking hero, bento grid and orbs.
The custom cursor stays. The hand-tracking code stays in the repo for a possible follow-up
where raising a hand hails the car.

## Left to the builder

Exact camera keyframes, instance counts, shader details, copy trims within the rule of
plain concrete statements.
