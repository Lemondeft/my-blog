import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"

type Skill = {
  name: string
  color: string
  logo: string
}

const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: "Languages & Core",
    skills: [
      { name: "JavaScript", color: "323330", logo: "javascript" },
      { name: "TypeScript", color: "3178C6", logo: "typescript" },
      { name: "PHP", color: "777BB4", logo: "php" },
      { name: "Python", color: "3670A0", logo: "python" },
    ],
  },
  {
    label: "Frameworks & Databases",
    skills: [
      { name: "React", color: "61DAFB", logo: "react" },
      { name: "Next.js", color: "000000", logo: "nextdotjs" },
      { name: "PostgreSQL", color: "316192", logo: "postgresql" },
      { name: "TailwindCSS", color: "06B6D4", logo: "tailwindcss" },
    ],
  },
  {
    label: "Environment",
    skills: [
      { name: "Fedora", color: "51A2DA", logo: "fedora" },
      { name: "Hyprland", color: "58E1FF", logo: "linux" },
    ],
  },
]

type QnA = {
  question: string
  answer: string
}

const qna: QnA[] = [
  {
    question: "who are you?",
    answer:
      "I'm Lemondeft (AR) — Vocational High School student studying Computer Science, focused on Fullstack development with a growing interest in Machine Learning.",
  },
  {
    question: "what do you use?",
    answer:
      "Fedora Linux with Hyprland. React + TypeScript + Tailwind on frontend, Next.js + Prisma + PostgreSQL on backend. Currently expanding into Python (ML) and PHP (DB architecture).",
  },
  {
    question: "why this blog?",
    answer:
      "This blog is my technical notebook — documenting experiments, fixes, and learning in public. Writing forces me to understand what I break and how I fix it.",
  },
  {
    question: "what is Lemondeft?",
    answer:
      "A username I adopted in 2025 and use consistently for projects and online presence. See github.com/lemondeft.",
  },
  {
    question: "your coding journey?",
    answer:
      "Printed 'Hello, World!' in Python (2023), moved to HTML/CSS (2024), now building with React/TS and exploring backend + language models. wa-bot and my-blog are my main active projects.",
  },
]

const driverSpecs = [
  { key: "OS", value: "Fedora 44" },
  { key: "WM", value: "Hyprland — end4" },
  { key: "Bar", value: "Quickshell (ii)" },
  { key: "Terminal", value: "kitty" },
  { key: "Shell", value: "fish + starship" },
  { key: "Gaps", value: "4 / 5" },
  { key: "Blur", value: "on" },
  { key: "Rounding", value: "18" },
]

export default function Whoami() {
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
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA2F7] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          ← back
        </button>

        <h1 className="text-2xl md:text-4xl font-bold mt-8">
          $ whoami<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Fullstack Developer · CS Student · tinkerer
        </p>

        {/* Banner */}
        <div className="mt-8 rounded-xl overflow-hidden border border-white/20 bg-black/20">
          <img
            src="https://capsule-render.vercel.app/api?type=waving&color=0:1A1B26,100:7AA2F7&height=200&section=header&text=Lemondeft&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Fullstack%20Developer%20%7C%20CS%20Student&descAlignY=55&descSize=18"
            alt="Lemondeft banner"
            className="w-full h-auto"
          />
        </div>

        {/* About Me */}
        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// about me</p>
          <h2 className="text-2xl font-bold mt-2">Hi, I'm Lemondeft 👋</h2>
          <p className="text-white/70 mt-2 leading-relaxed">
            Vocational High School student studying Computer Science with a
            strong focus on Fullstack development and an evolving interest in
            Machine Learning. I build in public and learn by shipping.
          </p>
        </div>

        {/* What I'm Working On */}
        <div className="flex flex-col gap-4 mt-12">
          <h2 className="text-white text-2xl font-bold p-6 pb-0">
            What I'm Working On
          </h2>
          <div className="grid md:grid-cols-2 gap-4 p-6 pt-2">
            <a
              href="https://github.com/lemondeft/wa-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-white/20 rounded-xl bg-black/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(100,200,255,0.1)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA2F7] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <p className="text-white font-bold">🤖 lemondeft/wa-bot</p>
              <p className="text-white/60 text-sm mt-2">
                WhatsApp automation bot built with TypeScript — AI chat, media
                downloads, view-once reveal, stickers.
              </p>
              <p className="text-white/40 text-xs mt-3 font-mono">
                TypeScript · Baileys · OpenRouter
              </p>
            </a>
            <a
              href="https://github.com/lemondeft/my-blog"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-white/20 rounded-xl bg-black/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(100,200,255,0.1)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA2F7] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <p className="text-white font-bold">✍️ lemondeft/my-blog</p>
              <p className="text-white/60 text-sm mt-2">
                Personal developer blog — intergalactic tinkering, React + Vite
                + Tailwind.
              </p>
              <p className="text-white/40 text-xs mt-3 font-mono">
                React 19 · Vite · Tailwind 4
              </p>
            </a>
          </div>
        </div>

        {/* Currently Learning */}
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-white text-2xl font-bold p-6 pb-0">
            Currently Learning
          </h2>
          <div className="grid md:grid-cols-2 gap-4 p-6 pt-2">
            {[
              {
                title: "Python",
                desc: "Expanding beyond web toward Machine Learning",
              },
              {
                title: "PHP",
                desc: "Database design, architecture & relational data",
              },
              {
                title: "Front-end",
                desc: "Modern UI with React + TypeScript",
              },
              {
                title: "Back-end",
                desc: "Full-stack with Next.js, Prisma & PostgreSQL",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 border border-white/10 rounded-lg bg-white/[0.02]"
              >
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-white/60 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Driver */}
        <div className="mt-12">
          <p className="text-white/50 font-mono">// daily driver</p>
          <h2 className="text-2xl font-bold mt-2">Daily Driver</h2>
          <p className="text-white/60 mt-2 max-w-xl">
            Tiling WM with gaps, blur, and workspace switching. Here's what the
            desktop looks like.
          </p>

          <div className="grid md:grid-cols-[3fr_2fr] gap-6 mt-6">
            {/* Wireframe — tiling workspace visualization */}
            <div className="border border-white/15 rounded-lg p-2 bg-black/50">
              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-1.5 min-h-[160px] md:min-h-[200px]">
                {/* Left column: browser + editor */}
                <div className="grid grid-rows-[1fr_1fr] gap-1.5">
                  {/* Browser tile */}
                  <div className="border border-white/10 rounded bg-white/[0.02] p-2.5 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7AA2F7]/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#58E1FF]/30" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="text-[10px] font-mono text-white/30 ml-1">
                        firefox
                      </span>
                    </div>
                    <div className="flex-1 border border-white/5 rounded bg-white/[0.01]" />
                  </div>
                  {/* Editor tile */}
                  <div className="border border-white/10 rounded bg-white/[0.02] p-2.5 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7AA2F7]/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#58E1FF]/30" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="text-[10px] font-mono text-white/30 ml-1">
                        neovim
                      </span>
                    </div>
                    <div className="flex-1 border border-white/5 rounded bg-white/[0.01]" />
                  </div>
                </div>
                {/* Right column: terminal (full height) */}
                <div className="border border-[#58E1FF]/15 rounded bg-white/[0.02] p-2.5 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7AA2F7]/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#58E1FF]/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="text-[10px] font-mono text-white/30 ml-1">
                      kitty
                    </span>
                  </div>
                  <div className="flex-1 border border-white/15 rounded bg-black/50 p-2 font-mono text-[10px] text-white/85 leading-loose">
                    <p>
                      ~{" "}
                      <span className="text-[#58E1FF]">$</span>{" "}
                      hyprctl dispatch workspace 1
                    </p>
                    <p>
                      ~{" "}
                      <span className="text-[#58E1FF]">$</span>{" "}
                      nvim main.py
                    </p>
                    <p className="mt-0.5">
                      ~{" "}
                      <span className="text-[#58E1FF]">$</span>{" "}
                      <span className="caret text-[#58E1FF]">_</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs — key:value list */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-col gap-2.5">
                {driverSpecs.map((spec) => (
                  <div
                    key={spec.key}
                    className="flex items-baseline gap-3 font-mono text-sm"
                  >
                    <span className="text-[#7AA2F7]/70 w-20 shrink-0">
                      {spec.key}
                    </span>
                    <span className="text-white/60">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <a
                  href="https://github.com/end-4/dots-hyprland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-[#58E1FF]/70 hover:text-[#58E1FF] transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  dotfiles → end-4/dots-hyprland (ii)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div className="flex flex-col mt-12">
          <h2 className="text-white text-2xl font-bold mb-6">Stack</h2>
          {skillGroups.map((group, i) => (
            <div
              key={group.label}
              className={
                i > 0
                  ? "py-6 border-t border-white/10"
                  : "pb-6"
              }
            >
              <p className="text-white/50 text-sm font-mono mb-3">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <img
                    key={skill.name}
                    src={`https://img.shields.io/badge/${skill.name}-${skill.color}?style=for-the-badge&logo=${skill.logo}&logoColor=white`}
                    alt={skill.name}
                    className="h-7 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-white text-2xl font-bold p-6 pb-0">Contact</h2>
          <div className="flex flex-wrap gap-3 p-6 pt-2">
            <a
              href="https://discord.com/users/699924273040719955"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA2F7] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            >
              <img
                src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"
                alt="Discord"
                className="h-8 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200"
              />
            </a>
            <a
              href="https://github.com/lemondeft"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA2F7] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            >
              <img
                src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"
                alt="GitHub"
                className="h-8 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200"
              />
            </a>
          </div>
        </div>

        {/* Q&A */}
        <dl className="flex flex-col gap-8 mt-12">
          {qna.map((item) => (
            <div
              key={item.question}
              className="p-6 border-b border-white/10 last:border-none"
            >
              <dt className="text-[#7AA2F7] font-mono text-lg mb-2">
                $ {item.question}
              </dt>
              <dd className="text-white/80 font-light text-base leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <footer className="border-t border-white/20 text-white/40 text-sm text-center py-6 mt-16">
          © 2026 Lemondeft. Made with useless tinkering.
        </footer>
      </div>
    </div>
  )
}
