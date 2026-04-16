# PostCard.

A free browser-based vintage postcard maker. Write something worth sending.

## Features
- 5 postcard templates (4 illustrated + upload your own photo)
- Tap template to go straight to edit
- Card flips to back on arrival — write your message
- Double-click the card to flip front/back
- Custom stamp picker + upload your own stamp
- Ink colour selector
- Web Share API — share directly on mobile (iMessage, WhatsApp etc)
- Download front + back stacked as one PNG
- Fully responsive

## Deploy to Vercel (recommended)

1. Push this folder contents to a new GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. No build settings needed — Vercel auto-detects static
4. Click Deploy

## Local preview

Just open `index.html` in any browser. No build tools or server needed.

## File structure

```
├── index.html          Main app
├── style.css           All styles  
├── script.js           All JavaScript
├── vercel.json         Vercel config
├── .gitignore
├── README.md
└── templates/
    ├── tmpl1.jpg       Cowboy Pup
    ├── tmpl2.jpg       Dachshund Heart
    ├── tmpl3.jpg       Sweet Kiss
    ├── tmpl4.jpg       Lace Hearts
    └── tmpl5.svg       Your Photo (placeholder)
```
