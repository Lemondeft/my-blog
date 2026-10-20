import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import CodeBlock from "../components/codeblock"

type Section = {
  title: string
  content: string
  code?: {
    filename: string
    language: string
    snippet: string
  }
}

const sections: Section[] = [
  {
    title: "Introduction",
    content:
      "Seblak Mama Rizki is a real seblak stall in Bandung, the spicy noodle soup that every Sundanese city has its own version of. The original site is a PHP thing with a database, an uploads folder and a layout that does not look like it was designed this century. This project is a faithful rebuild of that site in Next.js 16, deployed as static assets, with the same photos, the same reviews and the same branches. I did not invent a fictional restaurant, I ported a real one.",
  },
  {
    title: "The original site",
    content:
      "The PHP original lives in my PJBL-Seblak repo. Content is spread across the database and a few hardcoded arrays in the layout and footer, plus an ulasan modal that pulls reviews from the database. The uploads folder has the real photos of every paket and topping and a carousel of recent shots. Rebuilding it meant reading all of that and deciding what belongs in a static front end and what belongs in a database that no longer exists.",
  },
  {
    title: "Porting the content honestly",
    content:
      "The prices are the interesting part. The live prices live in the owner's database and the original PHP code shows them at request time. A static export cannot query a database, so the honest move was to publish only the numbers I could confirm from the database, which is Seblak Original at Rp 10.000, and the header line that says paket mulai 10rb. The other seven paket have their photo and their name and no price, rather than a price I made up or one that silently went stale.",
    code: {
      filename: "app/page.tsx",
      language: "tsx",
      snippet: `/* Real paket photos from the original site's uploads.
   Exact prices live in the owner's database — only DB-confirmed
   numbers are shown. */
const PAKET = [
  { nama: "Seblak Original", foto: "/paket/original.webp", harga: "Rp 10.000" },
  { nama: "Seblak Ceker", foto: "/paket/ceker.webp" },
  { nama: "Seblak Bakso Jumbo", foto: "/paket/bakso_jumbo.webp" },
  { nama: "Seblak Cuanki", foto: "/paket/cuanki.webp" },
  { nama: "Seblak Kwetiau", foto: "/paket/kwetiau.webp" },
  { nama: "Seblak Seafood", foto: "/paket/seafood.webp" },
  { nama: "Seblak Jamur", foto: "/paket/seblak_jamur.webp" },
  { nama: "Seblak Sosis Bakso", foto: "/paket/sosis_bakso.webp" },
];`,
    },
  },
  {
    title: "Ordering through WhatsApp",
    content:
      "There is no cart and no checkout. The entire ordering flow is a WhatsApp deep link with a prefilled message, so tapping a paket opens the chat with the order already typed. That is how most small stalls actually take orders, and it also means the static site needs no backend at all. The message is URL encoded because it contains spaces and punctuation and the number is the stall's real WhatsApp number.",
    code: {
      filename: "app/page.tsx",
      language: "tsx",
      snippet: `const WA_BASE = "https://wa.me/6285876087735";
const waOrder = (item: string) =>
  \`\${WA_BASE}?text=\${encodeURIComponent(
    \`Halo Seblak Mama Rizki, saya mau pesan \${item}.\`
  )}\`;`,
    },
  },
  {
    title: "The spice level picker",
    content:
      "The hero is the thing people actually interact with. A heat scale from 1 to 10 where the colour ramp goes honey to sambal to chili to deep red, and tapping a level shows a note about that level, from masih ramah to LEVEL BIANG NANGIS, kamu yakin. Each level also drives a heat variable in CSS that glows behind the panel. The notes are written per level so the wording changes with the number, not just the colour, because level 3 and level 4 should not read identically.",
  },
  {
    title: "The photos",
    content:
      "Every paket, every topping and the hero carousel are the real photos from the original site's uploads folder, converted to webp. Nothing is stock, nothing is a placeholder, and the carousel auto rotates every 3 seconds like the original one did, with touch swipe support on mobile. Next Image handles the sizing with the fill pattern and explicit sizes per grid position, so a phone does not download the desktop sized image.",
  },
  {
    title: "Redesigning as an editorial magazine",
    content:
      "The first version was a generic dark landing page. The redesign treats the stall like a print magazine, warm newsprint paper, ink black text, one deep chili red, one mustard accent, and hairline rules doing the work that borders and shadows used to. The palette was warmed toward the original brand colours in a later pass, the deeper red and warmer mustard instead of the neon originals. The type is a serif display face for headlines and pull quotes with a grotesque for everything functional, and the numbered kickers do the section labelling.",
    code: {
      filename: "app/globals.css",
      language: "css",
      snippet: `@theme inline {
  --color-paper: #f7f1e6; /* warm newsprint */
  --color-ink: #1d1712;    /* ink black */
  --color-line: #d5c9b4;   /* hairline rules */
  --color-chili: #d32f22;  /* brand red, deepened from the original #ed4a4a */
  --color-sambal: #f07a2e; /* broth orange, from the original #f58231 */
  --color-honey: #e8a83c;  /* warmed mustard, from the original #ffc81f */
}`,
    },
  },
  {
    title: "Static export on Cloudflare Pages",
    content:
      "The site is fully prerendered, so it deploys as plain assets. No Node runtime, no server, no origin to keep alive, and the whole thing is a folder of HTML and webp files. The Next config is two lines, output export and unoptimized images, because the image optimizer does not exist without a server. The wrangler config points at the exported output directory and sets 404 handling to the static 404 page.",
    code: {
      filename: "next.config.ts",
      language: "tsx",
      snippet: `const nextConfig: NextConfig = {
  /* Static export — the site is fully prerendered, so it deploys
     as plain assets to Cloudflare Pages. */
  output: "export",
  images: {
    unoptimized: true,
  },
};`,
    },
  },
  {
    title: "Two branches and the socials",
    content:
      "Two outlets, SMR 1 in Puspogiwang and SMR 2 in Panjangan, each with its own Maps link, and the opening hours are honest per weekday, weekdays from ten until nine, weekends from eleven. A scrolling ticker strip carries the short claims, fresh broth daily, spice level 1 to 10, mix your own prasmanan, paket mulai 10rb. The Instagram and TikTok links are the same ones from the original footer.",
  },
  {
    title: "Next.js 16 gotchas",
    content:
      "This version of Next.js has breaking changes against what I knew, file structure and conventions included. The repo even ships an AGENTS.md that warns about it and points at the bundled docs. The parts that bit me were the static export path, which writes to out and not to the public folder, and image handling, where unoptimized is mandatory under export because there is no optimizer to serve optimised images.",
  },
  {
    title: "What I Learned",
    content:
      "How to port a real small business site without inventing anything, and that refusing to publish a price is a feature. That a WhatsApp deep link is a perfectly good checkout for a stall. That static export is the right call for a brochure site with a contact CTA, and that it removes the whole backend question. How to build an editorial layout with CSS theme tokens instead of a component library. That the real photos matter more than any layout choice, and that shipping to Cloudflare Pages is genuinely a wrangler config and a static folder.",
  },
  {
    title: "Source code",
    content:
      "The rebuild is on GitHub at github.com/Lemondeft/seblak-demo. The PHP original is at github.com/Lemondeft/PJBL-Seblak if you want to see what it started as. Next.js 16, React 19, Tailwind v4, static export, no backend, no database, just a menu that talks to WhatsApp.",
  },
]

export default function SeblakDemo() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />

      <div
        className="max-w-7xl mx-auto py-8 md:py-16 px-4 relative page-enter"
        style={{ zIndex: 1 }}
      >
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]"
        >
          ← back
        </button>

        <h1 className="text-2xl md:text-4xl font-bold mt-8">
          Seblak Mama Rizki<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Rebuilding a real street-food stall's site in Next.js 16.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// seblak-demo</p>
          <h2 className="text-2xl font-bold mt-2">
            Next.js · React 19 · Tailwind v4
          </h2>
          <p className="text-white/70 mt-2">
            Static export, WhatsApp ordering, no backend
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {sections.map((item) => (
            <div
              key={item.title}
              className="p-6 border-b border-white/10 last:border-none"
            >
              <h2 className="text-white text-2xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed">
                {item.content || " "}
              </p>

              {item.code && (
                <CodeBlock
                  filename={item.code.filename}
                  language={item.code.language}
                  snippet={item.code.snippet}
                />
              )}
            </div>
          ))}
        </div>

        <footer className="border-t border-white/20 text-white/40 text-sm text-center py-6 mt-16">
          © 2026 Lemondeft. Made with useless tinkering.
        </footer>
      </div>
    </div>
  )
}
