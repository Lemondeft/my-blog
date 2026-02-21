import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import setupImg from "../assets/image.jpeg"

type Section = {
  title: string
  content: string
  image?: string
}

const sections: Section[] = [
  {
    title: "Introduction",
    content:
      "When I first heard about Linux, I was skeptical. I had no idea what the use of it. When my friend first introduced me to it with their flashdisk, I was intrigued.",
  },
  {
    title: "Fedora Linux",
    content: "Why I chose Fedora? Honestly I chose Fedora KDE because I went blind and just clicked the first option that looked good. I have no regrets. And also because I want to try vLLM",
  },
  {
    title: "Hyprland",
    content: "I didnt config my own dots, I used preconfigured Hyprland dots from Github, its called Fedora-Hyprland by Jakoolit and it has install.sh script that sets up everything for you. Hyprland is a tiling window manager that is very customizable and has a lot of features. I really enjoy using it and it has made my Linux experience much better.",
    image: setupImg,
  },
  {
    title: "System Configuration",
    content: "Barely did any configuration, I just installed some packages that I needed and that was it. I have no issues with my system, everything works out of the box. I just use it as it is and I am happy with it.",
  },
  {
    title: "Workflow",
    content: "Tiling window manager has changed my workflow a lot, I can easily switch between windows and workspaces, and I can also easily manage my windows with the tiling features. I also use some tools like waybar and wlogout to enhance my workflow and make it more efficient. I can now flex my Hyprland when I'm using VSCode.",
  },
  {
    title: "Notes",
    content: "Some people might struggle with nvidia drivers on Linux but personally I use nvidia and I have no issues with it. I just install the drivers akmod like everyone else and everything goes smoothly. But though, pipewire/pulse is a nightmare, I cant configure it to work with easyeffects, I want to have clear microphone input and also have the ability to use effects on it because my laptop internal mic sounded terrible, but I cant get it to work. I have tried everything, but nothing works. Ill just use alsamixer.",
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

        <h1 className="text-4xl font-bold mt-8">
          My Journey Through Linux<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Documentation-ish of my Linux experience.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/40 backdrop-blur">
          <p className="text-white/50 font-mono">// environment</p>
          <h2 className="text-2xl font-bold mt-2">Fedora Linux · Hyprland</h2>
          <p className="text-white/70 mt-2">Tinkering with Linux</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {sections.map((item) => (
            <div
              key={item.title}
              className="p-6 border-b border-white/10 last:border-none">
              <h2 className="text-white text-2xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white/80 font-light text-lg leading-relaxed">
                {item.content || " "}
              </p>
                {item.image && (
              <div className="flex justify-center mt-4">
              <img src={item.image} alt={item.title} className="w-2/3 rounded border border-white/20" />
              </div>
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
