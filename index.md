# index.html — Build Instructions

Source: TRUE LEGENDS _ VIDEO SLATE — file key `mg1M0VogwuwEn4rzIwEXSw`
Base frame size: **1920 x 1080** (px -> vw divides by 1920; vertical % divides by 1080)
Base template: `basic-template.html` — content goes in `.main-container > .stage`

**STATUS: built — fonts missing, hi/gu copy missing (see §5)**

Read from the Figma MCP (`get_design_context`, `get_screenshot`) — frames `124:922`, `124:994`, `124:1024`.
`get_motion_context` returned no keyframe data, so transition timing is chosen, not read.

---

## Navigation

← from: none (landing page)
→ to: none. `.back-btn` (home icon, top-left) links to `./index.html`.

**Four frames = ONE page in four states** (rest → hover intro → video).

| Frame | State | What it is |
|---|---|---|
| `124:907` | rest (new) | mascot small, nothing else: header, title, Click and language pill are `opacity:0`; home sits at left 13px; glow small |
| `124:922` | intro | big "UDAYAN MANTRI" title image, "Click" pill, mascot large and cropped, video box parked tiny and invisible |
| `124:994` | in-between | header at y127, video at y355, caption hidden — the transition's mid keyframe, **not built as its own state** |
| `124:1024` | video | mascot full figure, header y102, video box + big play button, small caption at the bottom |

Toggle classes on `.stage`: `.is-intro` (hover the mascot) and `.is-video` (click). 907 → 922 and 922 → 1024 are CSS transitions (0.9s).

- **Rest (907)** → hover the mascot (ONCE, it never reverts) → **`.is-intro` (922)**:
  mascot zooms 562→937px wide, header slides 57→161px and fades in, big title scales up from a 3px dot, Click rises from y1005 to y908, language pill fades in, home moves 13→44px, glow grows.
  Moving the mouse away does nothing; the intro stays.
- **Click sequence (1.8s `--move-time`, 1.1s `--title-time`):**
  1. 0–1.1s the `.intro-group` (big title + Click pill in ONE container, origin on the title centre) tilts back (rotateX 35deg, perspective 80vw) and scales to 3.4x (fills the screen) while falling toward the bottom (about 520px of drop per +1.0 of scale, measured from the Figma prototype preview), fading out over 0.6–1.1s
  2. the mascot shrinks back and the glows change at the SAME time as step 1; after 1.1s the header and video box animate in
  3. when the video has settled (+1.8s) the `stext` caption slides down from behind it; the play button fades in
- **Click** on `.intro-click` or the big title → **`.is-video` (1024)**, sticky. The big title **scales up to 1.6x and fades out**; Click fades.
- `thumbnail.png` (1672x941) is the video `poster`.

---

## 0. Assets

### 0.1 — Images (`assets/images/`)

| File | Layer / use | Natural px |
|---|---|---|
| `bg.png` | `red` backdrop (inside stage) | 1920x1080 |
| `background.png` | `.page-bg`, black, outside wrapper | 1920x1080 |
| `stage-spacer.png` | transparent, full frame | 1920x1080 |
| `thumbnail.png` | video poster | 1672x941 |
| `video-spacer.png` | transparent, gives `.video-frame` its 904:516 ratio | 904x516 |
| `mascot.png` | `mascot` | 563x925 |
| `title.png` | `gaming-ancient-plate 1` (plate only — "TRUE LEGENDS" is live text) | 615x168 |
| `text.png` / `texthi.png` / `textgj.png` | `TITTLE` big name, en / hi / gu | 689x546 / 746x610 / 720x641 |
| `stext.png` / `stexthi.png` / `stextgj.png` | small name under the video, en / hi / gu (text only) | 568x104 / 556x203 / 523x188 |
| `decol.png` / `decor.png` | left / right ornaments beside the caption (supplied as SVG) | 54x83 |
| `home.png` | `home button` | 60x54 |
| `play.png` / `pause.png` / `replay.png` | big centre button states | 104x105 |

Videos: `video.webm` (assumed English), `videohi.webm` (assumed Hindi).

Missing: a Gujarati video, a Gujarati video (poster is now `thumbnail.png`).
Glows are CSS (blurred shapes, normal blend), not images — the Figma ones were SVG.

### 0.2 — Fonts

| Family | Used for | File in /fonts/ |
|---|---|---|
| Unna Regular | "TRUE LEGENDS" 72px | `Unna-Regular.woff2` — **NOT PROVIDED** |
| Lao Sans Pro Regular | "Click" 40px | `LaoSansPro-Regular.woff2` — **NOT PROVIDED** |
| Roboto Medium | player time 14px | `Roboto-Medium.woff2` — **NOT PROVIDED** |

`@font-face` is wired with `local()` first and a serif/sans fallback until the files land.

---

## 1. Palette

```
--page-bg-color:  #000000                 body colour behind .page-bg
--frame-border:   #b85a5a                 10px frame border
--video-border:   #ffaaa9                 5px video box border
--header-text:    #ffe9c7                 TRUE LEGENDS base
--gold-1..4:      #ffcf81 #eaba6d #cb9b4e #ab7c30   header radial gradient
--glow-red:       #ff3700 (rest, intro and video; Figma video frame had #ff0000, user asked for #ff3700)      normal blend (Figma soft-light is isolated inside its SVG img, so renders as normal) blur 159.7px
--glow-magenta:   #ff0099                 normal blend blur 159.7px
--white:          #ffffff
```

---

## 2. Structure

```
.main-container
└── .stage
    ├── img.stage-spacer        transparent 1920x1080
    ├── img.stage-bg            bg.png
    ├── .glow x4                2 intro, 2 video — crossfade
    ├── img.mascot
    ├── .video-frame            spacer + <video> + .video-controls
    ├── button.video-play
    ├── .header                 plate + gold title
    ├── .intro-title            text.png / texthi.png / textgj.png
    ├── button.intro-click
    ├── img.video-caption       stext.png
    ├── a.back-btn
    └── .stage-frame            10px border overlay
```

Content extent: the red backdrop fills the frame, so y 0..1080 -> spacer 1920x1080 (unchanged).
Vertical % are measured from y=0 over 1080.

---

## 3a. Frame 124:907 Guidelines — rest state (default)

    3a.1- mascot: left `15.796%` (303.29px), top `12.126%` (130.96px), width `29.293%` (562.426px)
    3a.2- glow-intro-red: circle 232.175px `#ff3700`: left `21.337%`, top `38.289%`, width `12.092%`
    3a.3- home button: fixed at left `2.307%`, top `3.69%` in every state (user: never move it; Figma rest frame had `0.677%` / `3.72%`)
    3a.4- header: top `5.309%` (57.34px), opacity 0
    3a.5- intro title: centred at (1317.4, 623) scaled to 0.005, opacity 0
    3a.6- Click: top `93.093%` (1005.4px), opacity 0
    3a.7- language pill: left `90.313%` (1734px), opacity 0
    3a.8- on hover of mascot → `.is-intro`

## 3. Frame 124:922 Guidelines — intro state (`.is-intro`)

  3- read frame 124:922 from figma mcp local server — images from `@assets/images/`

    3.1- red — `stage-bg`
      3.1.1- left `-0.78%`, top `-1.157%`, width `100.475%`, height auto, `bg.png`

    3.2- Ellipse 1 — `glow-intro-red`: circle 482.393px, `#ff3700`, soft-light, blur 8.317vw
      3.2.1- left `13.956%`, top `30.556%`, width `25.125%`

    3.3- Ellipse 2 — `glow-intro-magenta`: half-ellipse 662 x 524.9px, `#ff0099`, opacity .4, soft-light
      3.3.1- left `51.426%`, top `35.926%`, width `34.479%`

    3.4- mascot — `mascot`
      3.4.1- left `6.042%` (116.01px), top `9.2%` (99.36px), width `48.801%` (936.987px), `mascot.png`
      3.4.2- bottom is cropped by the frame — `.stage` has `overflow: hidden`

    3.5- home button — `back-btn`: left `2.307%`, top `3.69%`, width `3.125%`, `home.png`

    3.6- E H G — global `#langSelect`, untouched (see §5.2)

    3.7- HADER — `header`
      3.7.1- plate `title.png`: left `53.177%` (1021px), top `14.956%` (161.52px), width `32.018%` (614.749px)
      3.7.2- text "TRUE LEGENDS": Unna `3.1vw` (reduced from Figma 72px = 3.75vw so the text clears the plate frame), line-height `5.052vw` (97px), centred in the plate,
             top `25.808%` of plate; base `#ffe9c7`, shadow `0 0.208vw 0.073vw #000`;
             second copy on top, clipped gradient `#ffcf81 → #eaba6d 25% → #cb9b4e 62.5% → #ab7c30`

    3.8- TITTLE — `intro-title`
      3.8.1- English `text.png`: left `53.776%`, top `32.233%`, width `29.858%` (jagdu only; udayan stays 50.776% / 35.858%)
      3.8.2- Hindi `texthi.png`, Gujarati `textgj.png`: same centre, natural size scaled by the same ratio (assumed)

    3.9- Click — `intro-click`
      3.9.1- left `65.702%` (1261.47px), top `84.101%` (908.29px), width `5.928%` (113.811px)
      3.9.2- pill `rgba(255,255,255,.1)`, inset 9.26% top/bottom, radius `1.061vw`, shadow `0 0.208vw 0.208vw rgba(0,0,0,.25)`
      3.9.3- text Lao Sans Pro `2.083vw` (40px), white, shadow `0 0.208vw 0.208vw rgba(0,0,0,.25)`

    3.10- hidden in this state: `_video-16:9` (tiny, opacity 0, centred at 1341,619), caption, play button.
          The huge `Udayan Mantri` Italiana text is `opacity:0` in Figma — **not built**.

    3.11- on click of `.intro-click` or the title → `.stage.is-video`; title scales to 1.6x and fades, Click fades, video grows from its tiny
          parked box to full size, header/mascot/glows slide to the video-state positions.

---

## 4. Frame 124:1024 Guidelines — video state

  4- read frame 124:1024 (124:994 is the mid keyframe)

    4.1- mascot — left `9.991%` (191.83px), top `6.463%` (69.8px), width `31.476%` (604.331px)
    4.2- header — top `9.507%` (102.68px); same left/width as 3.7
    4.3- glows — red ellipse 367.879 x 581px at left `13.484%` top `17.148%` width `19.16%` (`#ff3700`);
         magenta half-ellipse 612.538 x 162.257px at left `52.714%` top `81.843%` width `31.903%` (`#ff0099`)
    4.4- video box — `video-frame`
      4.4.1- left `45.015%` (864.29px), top `28.098%` (303.46px), width `47.604%` (914px)
      4.4.2- border `0.26vw #ffaaa9`, radius `0.833vw`, shadow `0 1.198vw 0.781vw rgba(0,0,0,.5)`, overflow hidden
      4.4.3- inner 904 x 516 → height from `video-spacer.png`; `<video>` is absolute, `object-fit: cover`
    4.5- controls bar (Shaka) — bottom of the video: gradient `0 → .1 @20% → .6 @60% → .9`,
         padding `0.208vw 0.729vw 0.833vw`; row: play/pause, time (Roboto `0.729vw`), spacer, volume icon,
         volume slider `5.625vw`, fullscreen, more; below: playback slider `0.625vw` tall.
         Bar is 65px tall with 11px cropped off the bottom.
    4.6- play button — `video-play`: left `66.212%` (1271.28px), top `47.589%` (513.96px), width `5.417%` (104px)
      4.6.1- `play.png` paused · hidden while playing · `replay.png` at the end
      4.6.2- `pause.png` shows on hover while playing
    4.7- caption — `video-caption` (overlay container, slides in from behind the video, translateY -22% -> 0)
      4.7.1- `decol.png` left `50.744%` (974.29px), top `82.769%` (893.91px), width `2.794%` (53.65px)
      4.7.2- `decor.png` left `85.138%` (1634.64px), same top/width
      4.7.3- English `stext.png`: left `54.65%` (1049.4px), top `82.111%` (886.8px), width `29.583%` (568px)
      4.7.4- Hindi `stexthi.png` / Gujarati `stextgj.png`: natural size, centred on the English text's centre (x 1333px, y 939px)
    4.8- on click of `.video-play` or the video → play / pause; control-bar buttons mirror it; fullscreen
         requests fullscreen on `.video-frame`

---

## 5. Open questions

1. **Fonts** — Unna, Lao Sans Pro, Roboto files are not in `/fonts/`. Fallbacks in use, so glyph widths differ.
2. **Global `#langSelect`** — the Figma pill is a white-outlined "E H G" capsule; the template's global bar is a
   blue `#4e9ebf` capsule. `project.md` says never touch it, so it is unchanged. Say if it should be restyled.
3. **Hindi / Gujarati copy** — "TRUE LEGENDS" and "Click" only exist in English; hi/gu spans carry the English text
   until supplied. 
4. **Videos** — `video.webm` = English and `videohi.webm` = Hindi is assumed. No Gujarati video: English is reused.
   Both files are 365–407 MB, so `preload="metadata"` only.
5. **Hover behaviour** — Figma has no prototype data for 907; hover → intro, click → video is built from the request.
   On touch, a tap on the mascot opens the intro.
6. **Frame 124:994** — read as the transition's mid keyframe, not a page state. Confirm.
6. **Hindi/Gujarati title image size** — Figma only gives the English box; the others are centred on it at the same scale.
7. **Home link** — Figma has no target; points to `./index.html`.
8. **Frame border** — the 10px `#b85a5a` rounded border belongs to the Figma frame itself; it is reproduced as an overlay.
