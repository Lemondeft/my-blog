import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"

type DocBlock =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }
  | { type: "code"; content: string }
  | { type: "note"; content: string }

type Section = {
  title: string
  blocks: DocBlock[]
}

const sections: Section[] = [
  {
    title: "Introduction",
    blocks: [
      {
        type: "text",
        content:
          "When I first heard about Linux, I was skeptical. I had no idea what the use of it. When my friend first introduced me to it, I was intrigued.",
      },
    ],
  },
  {
    title: "Fedora Linux",
    blocks: [
      { type: "text", content: "" },
      { type: "list", items: [] },
    ],
  },
  {
    title: "Hyprland",
    blocks: [
      { type: "text", content: "" },
      { type: "list", items: [] },
    ],
  },
  {
    title: "System Configuration",
    blocks: [{ type: "list", items: [] }],
  },
  {
    title: "Workflow",
    blocks: [{ type: "text", content: "" }],
  },
]

export default function Linux() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <Starfield />

      <div
        className="max-w-7xl mx-auto py-16 px-4 relative page-enter"
        style={{ zIndex: 1 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]"
        >
          ← back
        </button>

        {/* Hero */}
        <h1 className="text-4xl font-bold mt-8">
          My Journey Through Linux<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Documentation-ish of my Linux experience.
        </p>

        {/* Hero Card */}
        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/40 backdrop-blur">
          <p className="text-white/50 font-mono">// environment</p>
          <h2 className="text-2xl font-bold mt-2">Fedora Linux · Hyprland</h2>
          <p className="text-white/70 mt-2">
            Vocational high school student · React & TypeScript · tinkering with Linux
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 mt-12">
          {sections.map((section, idx) => (
            <div key={idx} className="p-6 border-b border-white/10 last:border-none">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

              <div className="space-y-4">
                {section.blocks.map((block, i) => {
                  if (block.type === "text") {
                    return (
                      <p
                        key={i}
                        className="text-white/80 font-light text-lg leading-relaxed max-w-3xl"
                      >
                        {block.content || " "}
                      </p>
                    )
                  }

                  if (block.type === "list") {
                    return (
                      <ul
                        key={i}
                        className="list-disc list-inside text-white/70 space-y-2"
                      >
                        {block.items.length === 0 ? (
                          <li className="text-white/30"> </li>
                        ) : (
                          block.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))
                        )}
                      </ul>
                    )
                  }

                  if (block.type === "code") {
                    return (
                      <pre
                        key={i}
                        className="bg-black/60 border border-white/10 rounded-lg p-4 text-sm overflow-x-auto"
                      >
                        <code>{block.content}</code>
                      </pre>
                    )
                  }

                  return null
                })}
              </div>
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
