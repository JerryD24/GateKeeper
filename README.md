# MyGate Clone — Static Screens

Pixel-accurate static recreations of the MyGate app screens, built with plain HTML + CSS + JS.
Each screen is rendered inside a reusable phone mockup frame.

## Structure

```
myGate-clone/
├── index.html            # Launcher — shows every screen as a tappable phone
├── assets/
│   ├── css/
│   │   ├── reset.css     # CSS reset + base
│   │   └── phone.css     # Phone frame + shared design tokens
│   ├── js/
│   │   └── nav.js        # Screen-to-screen navigation helpers
│   └── img/              # Icons, logos, image assets
└── screens/              # One HTML file per app screen
```

## How to run

Just open `index.html` in a browser (or use a static server):

```bash
npx serve .
```

## Adding a new screen

1. Copy an existing file in `screens/` (e.g. `01_splash.html`).
2. Rename it in sequence (`NN_name.html`).
3. Register it in the `SCREENS` list in `index.html`.

## Deploy

Static site — deploy the whole folder to GitHub Pages, Netlify, or Vercel.
