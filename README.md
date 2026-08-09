# Eagle Store — MLBB Account Marketplace

A self-contained storefront: `index.html` + `style.css` + `script.js`, with every
product pulled from `products.json` so you can update the catalog without
touching any code.

## Files

```
eagle-store/
├── index.html       # page structure
├── style.css         # claymorphism styling
├── script.js         # loads products.json, carousel, filters, modal, FAQ
├── products.json     # <-- edit this to add/remove/update listings
└── README.md
```

Keep all four files in the same folder — the page loads `style.css`,
`script.js`, and `products.json` by relative path.

## Editing products

Open `products.json`. There are two top-level keys:

- **`config`** — store name, tagline, and your WhatsApp number in two formats:
  `whatsappNumber` (digits only, country code first, no `+`/spaces — e.g.
  `"601165266140"` for +60 11-6526 6140) and `whatsappDisplay` (however you
  want it to *look* in the footer).
- **`products`** — an array of listings. Copy an existing entry and edit the
  fields:

```json
{
  "id": "eg-007",
  "name": "Mythical Glory Loaded Account",
  "rank": "Mythical Glory",
  "price": "RM 480",
  "server": "Malaysia / Asia",
  "skinCount": 42,
  "heroCount": 92,
  "badge": "Hot Deal",
  "sold": false,
  "description": "One or two sentences describing the account.",
  "images": [
    "https://cdn.discordapp.com/attachments/.../screenshot1.png",
    "https://cdn.discordapp.com/attachments/.../screenshot2.png"
  ]
}
```

- `id` — any unique string.
- `badge` — short label shown on the image, e.g. `"Hot Deal"`, `"New"`,
  `"Bestseller"`. Leave it `""` to hide it.
- `sold` — set to `true` to grey out the card and disable its WhatsApp
  button (badge auto-switches to grey).
- `images` — one or more URLs. The carousel works with any number of images;
  one image just hides the arrows/dots automatically.
- The rank dropdown filter above the grid is built automatically from
  whatever ranks appear in your products — no need to edit `index.html`.

## Using Discord image links

Discord CDN links work as direct `<img>` sources, so you can host product
screenshots by uploading them to any Discord channel and copying the link.

1. Upload the screenshot to a Discord channel (a private server/channel you
   control works fine).
2. Right-click the image → **Copy Link** (desktop) or long-press → **Copy
   Link** (mobile).
3. Paste that URL straight into the `images` array in `products.json`. Valid
   links look like:
   - `https://cdn.discordapp.com/attachments/.../file.png`
   - `https://media.discordapp.net/attachments/.../file.png`

**Two things to know:**

- **Don't** paste a *message* link (`https://discord.com/channels/...`) —
  that opens the Discord app, not an image. Use the direct attachment URL
  only.
- Discord attachment links can include a signed expiry (`?ex=...&is=...&hm=...`).
  Most last a long time, but if a channel gets pruned or the link ever stops
  loading, the site shows a "Image unavailable" placeholder instead of a
  broken image — just re-upload and swap the URL in `products.json` when
  that happens.

## Running it locally

Opening `index.html` by double-clicking it works in some browsers but not
others — Chrome, in particular, blocks a page from `fetch()`-ing a local
JSON file over `file://`. If the product grid doesn't load, run a tiny local
server from inside the `eagle-store` folder:

```bash
# Python (built-in on macOS/Linux)
python3 -m http.server 8000
# then open http://localhost:8000

# or Node, no install needed
npx serve
```

## Publishing it for real

Since it's plain HTML/CSS/JS, any static host works — drag-and-drop the
whole `eagle-store` folder onto **Netlify** or **Vercel**, or push it to a
repo and enable **GitHub Pages**. No build step required.

## What's already wired up

- Site copy is in Bahasa Malaysia (product rank names like Mythic / Legend /
  Mythical Glory are kept as-is — that's how MLBB players refer to them
  regardless of language).
- WhatsApp button on every card opens `wa.me` with your number and a
  pre-filled Malay message naming that exact listing and price.
- Search box + rank filter above the grid.
- A "Apa kata pelanggan kami" (reviews) section with sample testimonials —
  these are placeholder text, not real customer quotes. Swap them for
  genuine feedback once you have real orders, so visitors aren't shown
  reviews that didn't actually happen.
- Sticky floating WhatsApp button in the bottom-right on every page.
- Mobile-responsive nav, cards, and typography.
- Respects `prefers-reduced-motion` for anyone with motion sensitivity.

## Recent changes

- Removed the click-to-enlarge popup/modal — tapping a product image no
  longer opens anything, the card itself is the full view.
- Hero now reads "Trusted. Pantas. Est. 2019." — update the year in
  `index.html` (search for "Est. 2019") and the matching stat card
  ("Beroperasi Sejak") if your actual start year is different.
