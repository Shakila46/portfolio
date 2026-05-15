# Shakila Praween — Portfolio (Next.js)

## Setup

```bash
npx create-next-app@latest my-portfolio --typescript --app
cd my-portfolio
```

Then copy these files into your project:
- `app/page.tsx` → `app/page.tsx`
- `app/layout.tsx` → `app/layout.tsx`
- `components/` → `components/`
- `styles/globals.css` → `styles/globals.css`

## Run

```bash
npm run dev
```

Open http://localhost:3000

## Customization
- Edit project details in `components/Projects.tsx`
- Update stats in the stats section in `app/page.tsx`
- Add your real photo: replace the `avatar-frame` div with `<Image src="/photo.jpg" ...>`
- Connect the contact form to an API route or EmailJS

## Deploy on Vercel
```bash
npm install -g vercel
vercel
```
