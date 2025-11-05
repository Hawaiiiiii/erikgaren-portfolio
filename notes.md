# 0) NOTES | TODO
## High-leverage fixes in order
***
- Materials audit + color space. The GLB is 98 MB, so textures are embedded. Blacks usually mean wrong colorSpace, missing maps on materials, or bad normals. Fix in code.
- Explicit colliders. Gotta stop relying on fragile node names. Add invisible hitboxes for WORK/ABOUT/CONTACT and PIANO_KEYS. Rebind raycaster to those only.
- Clamp hover/idle. Hard limits. No “percent” tuning.
- Media weight. 59 MB video and 79 MB MP3 cause late loads. Downscale later, but at least lazy-init now.
