# CUP2EAT Website

Single-page website for **CUP2EAT** (edible cups brand, tagline "Eat Your Drink.").
Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

> **Developer note:** Demo created by SYVORA Web Development Studio as a client presentation.
> SYVORA branding is intentionally kept out of the customer-facing site.

## File structure

```
cup2eat-website/
├── index.html
├── css/style.css
├── js/
│   ├── config.js      <- edit contact details and settings here
│   └── script.js
├── assets/
│   ├── images/        <- WebP photos
│   └── icons/         <- logo-light.svg, logo-dark.svg, favicon.svg
└── README.md
```

## Run locally (VS Code Live Server)

1. Open the `cup2eat-website` folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

## Update contact information

Open `js/config.js` and edit the `contact` block (phone, WhatsApp number, email, Instagram). **The phone and email currently set are fake demo values.**.
The page picks these up automatically. The WhatsApp number is digits only with country code (e.g. `919876543210`).

## Replace images

Images are in `assets/images/`. Replace a file with a new one **using the same file name**, or update the `src` in `index.html`.

| File | Used for |
|---|---|
| `hero-cups.webp` (1200x800) and `hero-cups-640.webp` (640x427) | Hero image (keep both sizes) |
| `cups-beans.webp` (900x600) | Brand introduction |
| `gallery-*.webp` (600 px wide) | Gallery, product cards, About |

Tips: export as WebP at about 75-80% quality, keep each file under ~120 KB, and update the `width`/`height` attributes if the new image has a different shape (this prevents layout shift). Update the `alt` text to describe the new photo.

**Photos in this demo:** the photos were supplied for this project and should be confirmed as CUP2EAT's own before launch. Two supplied images showing another brand's packaging ("CUPFFEE") were deliberately not used.

## Placeholders to replace with verified details

- Product cards (Classic / Flavoured / Custom Brand) are labelled **Demo placeholder**. Replace names, descriptions and details once confirmed.
- "Details / Flavours / Options" lines say *To be confirmed by CUP2EAT*.
- Sustainability copy makes no claims about biodegradability, compostability or certifications. Add these only with evidence.
- The About section only states the founder's name. Add the brand story when supplied.
- Logo: a text-based wordmark inspired by the brand name, **not the original logo**. Replace `assets/icons/logo-light.svg` / `logo-dark.svg` with the real logo assets.
- Reviews: add genuine ones to `testimonials` in `config.js` (`{ quote, name }`). Until then the "Have You Tried CUP2EAT?" section shows.
- Welcome popup: enabled in `config.js` with neutral text (no discount claimed). Edit `offer.title` / `offer.text`, or set `offer.enabled = false` to hide it.

## Integrations that still need configuration

1. **Enquiry form delivery.** Until a `formEndpoint` is set in `config.js`, submitting the form opens WhatsApp with the entered details and shows a message saying the form isn't connected. It never shows a fake "sent" message. To receive emails:
   1. Create a form at [formspree.io](https://formspree.io) (free tier available).
   2. Paste its URL into `formEndpoint` (e.g. `https://formspree.io/f/xxxxxxx`).
   3. Submit a test enquiry and confirm it arrives. The success message appears only when the server returns OK.
2. **Social preview image.** For Open Graph previews on WhatsApp/Facebook, change the `og:image` in `index.html` to a full URL (`https://your-domain/assets/images/hero-cups.webp`) after deployment.
3. **Structured data** was intentionally left out until a verified business address/legal details exist.

## Deploy

**GitHub:**
```bash
git init
git add .
git commit -m "CUP2EAT website"
git branch -M main
git remote add origin https://github.com/<your-username>/cup2eat-website.git
git push -u origin main
```

**Vercel:** go to vercel.com, **Add New > Project**, import the GitHub repo, keep the defaults (Framework: *Other*, no build command, output directory blank) and click **Deploy**. Every push to `main` redeploys automatically.

**GitHub Pages (alternative):** repo **Settings > Pages**, deploy from branch `main` / root.

## Notes

- Icons are inline Lucide-style SVGs (no extra network request). Fonts: Fraunces and Inter via Google Fonts (`font-display: swap`, limited weights).
- Animations respect `prefers-reduced-motion`.
- Lighthouse scores have not been measured. Run Lighthouse in Chrome DevTools after deployment.
