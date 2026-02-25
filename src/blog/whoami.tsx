import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"

type QnA = {
  question: string
  answer: string
}

const qna: QnA[] = [
  {
    question: "who are you?",
    answer: "I'm Lemondeft (AR), a vocational high school CS student in Indonesia. I focus on Linux, frontend development, and experimenting with systems and code.",
  },
  {
    question: "what do you use?",
    answer: "Fedora Linux with Hyprland. Mostly React and TypeScript, currently learning Python and PHP.",
  },
  {
    question: "why this blog?",
    answer: "This blog is a technical notebook for my experiments and learning process. Writing helps me understand better and keeps a record of what I break and fix.",
  },
  {
    question: "what is Lemondeft?",
    answer: "A username I adopted in 2025 and use consistently for my projects and online presence.",
  },
  {
    question: "your coding journey?",
    answer: "Tinker with Python in 2023 by printing 'Hello, World!', moved to HTML and CSS in 2024, and now building projects with React and TypeScript while exploring backend and sometimes Language Model.",
  }
]

export default function Whoami() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />
      <div className="max-w-7xl mx-auto py-16 px-4 relative page-enter" style={{ zIndex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]">
          ← back
        </button>
        <h1 className="text-4xl font-bold mt-8">$ whoami<span className="caret">_</span></h1>
        <p className="text-white/70 mt-4 font-light">a brief introduction to me, myself.</p>
        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/40 backdrop-blur">
        <p className="text-white/50 font-mono">// identity</p>
        <h2 className="text-2xl font-bold mt-2">Lemondeft</h2>
        <p className="text-white/70 mt-2">
            CS student · Linux user · Sci-fi reader · tinkerer
        </p>
        </div>
        <div className="flex flex-col gap-8 mt-12">
          {qna.map((item) => (
            <div key={item.question} className="p-6 border-b border-white/10 last:border-none">
            <p className="text-white/40 text-lg font-bold mb-2">// {item.question}</p>
            <p className="text-white/80 font-light text-lg leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
        <footer className="border-t border-white/20 text-white/40 text-sm text-center py-6">
        © 2026 Lemondeft. Made with useless tinkering.
      </footer>
      </div>
    </div>
  )
}