import { useNavigate } from "react-router-dom"
import Starfield from "./components/Starfield"

type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

const posts: Post[] = [
  {
    slug: "whoami",
    title: "Whoami",
    date: "2026-02-15",
    excerpt: "Get to know Lemondeft a little better will ya?",
    tags: ["me"],
  },
  {
    slug: "linux",
    title: "My journey through Linux",
    date: "2026-02-15",
    excerpt: "A weird place I didn't expect that I will call home later.",
    tags: ["linux", "hyprland"],
  },
  {
    slug: "test1",
    title: "Some Testing",
    date:"2026-02-15",
    excerpt: "Some alien things that i do some time ago.",
    tags: ["reverse", "1999"]
  },
  {
    slug: "test2",
    title: "Some Testing",
    date:"2026-02-15",
    excerpt: "Some alien things that i do some time ago.",
    tags: ["reverse", "1999"]
  },
  {
    slug: "test3",
    title: "Some Testing",
    date:"2026-02-15",
    excerpt: "Some alien things that i do some time ago.",
    tags: ["reverse", "1999"]
  },
  {
    slug: "test4",
    title: "Some Testing",
    date:"2026-02-15",
    excerpt: "Some alien things that i do some time ago.",
    tags: ["reverse", "1999"]
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen">
      <Starfield />
      <div className="max-w-7xl mx-auto py-16 px-4 relative" style={{ zIndex: 1 }}>
        <h1 className="text-4xl font-bold text-white">My Blog</h1>
        <h2 className="text-7xl font-bold text-white p-9 tracking-widest uppercase">
          WELCOME TO MY INTERGALACTIC BLOG<span className="caret">_</span>
        </h2>
        <p className="text-white text-lg font-light">
          Hi, im Lemondeft and welcome to my intergalactic blog, I wish to share my useless tinkering.
        </p>
        <div className="p-9 flex flex-col gap-8">
          {posts.map(post => (
            <div key={post.slug} onClick={() => navigate(`/blog/${post.slug}`)}className="border border-white/20 rounded-lg p-6 hover:border-white/60 hover:shadow-[0_0_20px_rgba(100,200,255,0.1)] transition-all cursor-pointer">
              <p className="text-white/40 text-sm">{post.date}</p>
              <h3 className="text-white text-xl font-bold mt-1">{post.title}</h3>
              <p className="text-white/70 mt-2 font-light">{post.excerpt}</p>
              <div className="flex gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-white/50 border border-white/50 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
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