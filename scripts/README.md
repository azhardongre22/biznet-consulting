# Asset optimization

Offline scripts that shrink the raster images and PDF brochures the site ships.
They **never touch the originals** — every source file stays in place as the
editable master, and an optimized copy is written to a sibling `optimized/`
folder. The app imports only from `optimized/`, so Vite bundles the small files.

## Commands

```bash
npm run optimize:images     # PNG/JPG/WEBP -> optimized/*.webp
npm run optimize:brochures  # PDFs         -> optimized/*.pdf
npm run optimize:assets     # both of the above
```

## What gets processed

| Script                  | Source roots                                            | Output                          |
| ----------------------- | ------------------------------------------------------- | ------------------------------- |
| `optimize-images.mjs`   | `src/assets/images/`, `src/assets/icons/`               | `<root>/optimized/<name>.webp`  |
| `optimize-brochures.mjs`| `src/assets/company-profile/`                           | `<root>/optimized/<name>.pdf`   |

SVGs are skipped (already tiny/lossless). Add a new source root to the `ROOTS`
array in `optimize-images.mjs` if raster assets ever live somewhere else.

## When to re-run

Run `npm run optimize:assets` **whenever you add or replace a source image or
PDF**, then commit the regenerated files under `optimized/`. If you add a brand
new image, also point its import at `../assets/images/optimized/<name>.webp`.

## Why it is not part of `vite build`

Encoding dozens of large images at WebP effort 6 (and recompressing
print-resolution PDFs) is far too slow to run on every build. It is a manual,
commit-the-output step instead.

## Ghostscript (optional)

`optimize-brochures.mjs` prefers Ghostscript (`gs` / `gswin64c`) for higher
PDF fidelity, and falls back to a built-in Sharp + pdf-lib pass when it is not
on PATH. Install it for better compression:

```bash
winget install ArtifexSoftware.GhostScript   # Windows
```
