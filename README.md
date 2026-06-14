# abram.style

Personal site of Abram — a single-page card with an animated **aurora** WebGL hero
(spine-curtain technique, additive curtains + exposure tone-mapping), a live Sydney
telemetry readout, and a ⌘K command palette.

Built with **React + TypeScript + Vite**.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the built bundle
```

## Notes

- The aurora lives in a single fragment shader (`src/lib/shaders.ts`), rendered by
  `src/components/Aurora.tsx`.
- Respects `prefers-reduced-motion` (renders a single static frame). Append `?still`
  to the URL to force a static frame.
