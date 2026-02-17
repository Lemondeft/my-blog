import { useNavigate } from "react-router-dom"
import Starfield from "./components/Starfield"
import { useState } from "react"
import { useMemo } from "react"

type SortOption = "date-desc" | "date-asc" | "title"

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
    date: "2025-12-25",
    excerpt: "Get to know Lemondeft a little better will ya?",
    tags: ["me"],
  },
  {
    slug: "linux",
    title: "My journey through Linux",
    date: "2025-12-28",
    excerpt: "A weird place I didn't expect that I will call home later.",
    tags: ["linux", "hyprland"],
  },
  {
    slug: "test1",
    title: "Some Testing",
    date:"2026-02-17",
    excerpt: "Some alien things that i do some time ago.",
    tags: ["reverse", "1999"]
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [sortOption, setSortOption] = useState<SortOption>("date-desc")
  const baseClass = "px-4 py-2 border border-white/20 rounded hover:border-white/60 transition-all transition-transform duration-300 hover:scale-[1.1] hover:shadow-[0_0_20px_rgba(100,200,255,0.1)]"
  const sortedPosts = useMemo(() => {
  return [...posts].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "title":
        return a.title.localeCompare(b.title)
    }
  })
}, [sortOption])

  
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
        <div className="flex gap-4 mt-6 mb-6">
        <button
          onClick={() => setSortOption("date-desc")}
          className={sortOption === "date-desc"? baseClass + " text-white": baseClass + " text-white/40"}>
          Newest
        </button>

        <button
          onClick={() => setSortOption("date-asc")}
          className={sortOption === "date-asc"? baseClass + " text-white": baseClass + " text-white/40"}>
          Oldest
        </button>

        <button
          onClick={() => setSortOption("title")}
          className={sortOption === "title"? baseClass + " text-white": baseClass + " text-white/40"}>
          Title
        </button>
      </div>
        <div className="p-9 flex flex-col gap-8">
          {sortedPosts.map((post: Post) => (
            <div key={post.slug} onClick={() => navigate(`/blog/${post.slug}`)} className="border border-white/20 rounded-lg p-6 hover:border-white/60 hover:shadow-[0_0_20px_rgba(100,200,255,0.1)] transition-all cursor-pointer hover:scale-[1.01] duration-300">
              <p className="text-white/40 text-sm">{post.date}</p>
              <h3 className="text-white text-xl font-bold mt-1">{post.title}</h3>
              <p className="text-white/70 mt-2 font-light">{post.excerpt}</p>
              <div className="flex gap-2 mt-4">
                {post.tags.map((tag: string) => (
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