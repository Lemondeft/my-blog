import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"

type QnA = {
  question: string
  answer: string
}

const qna: QnA[] = [
  {
    question: "who are you?",
    answer: "i'm Lemondeft or AR, a student at a vocational highschool in Indonesia taking CS or RPL some people might say. i tinker with linux, code stuff for fun, and occasionally touch grass.",
  },
  {
    question: "what do you use?",
    answer: "Fedora Linux with Hyprland. i mostly write React and TypeScript, learning Python on the side.",
  },
  {
    question: "what do you do for fun?",
    answer: "read sci-fi novels, watch anime, play War Thunder and Reverse 1999.",
  },
  {
    question: "why this blog?",
    answer: "mostly to document my own tinkering. if it helps someone else, great. if not, at least i have notes. Or in the near future when i forget everything, i can just read this blog again. also, i want to practice writing and sharing my thoughts in a more public way.",
  },
  {
    question: "your name is weird, why?",
    answer: "in early 2025 i decided to play Among Us again, and i wanted a new name. im nor in love in lemon or deft. Among Us decide to generate a random name for me which is Lemon-something. and i modified it to Lemondeft because it sounds cooler and it sounds like developer. and i just stick with it since then.",
  },
  {
    question: "what about your journey in coding?",
    answer: "in mid or early 2023, i code my first code with Python printing 'hello world'. then i learn HTML and CSS, and i made my first portfolio ish in mid 2024. i think i suited for frontend development because i think i like it so when i graduated from middle school in mid 2024, i decided to enroll into vocational highschool to pursue that. and now here i am, learning React and TypeScript, and i want to learn more about backend and mobile development in the future.",
  }
]

export default function Whoami() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />
      <div className="max-w-7xl mx-auto py-16 px-4 relative" style={{ zIndex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]">
          ← back
        </button>
        <h1 className="text-4xl font-bold mt-8">$whoami?<span className="caret">_</span></h1>
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