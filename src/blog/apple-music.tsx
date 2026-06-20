import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import CodeBlock from "../components/codeblock"
import type { JSX } from "react/jsx-runtime"

type Section = {
  title: string
  content: string | JSX.Element
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
      "I wanted lossless music on my phone. Not compressed, not lossy — real ALAC from Apple Music. After a lot of trial and error, I got a Docker-based setup that downloads ALAC tracks directly from Apple Music and transfers them to my phone via MTP.",
  },
  {
    title: "What is it?",
    content:
      "The setup has two Docker containers working together. A 'wrapper' handles FairPlay DRM decryption (the copy protection Apple uses), and the 'apple-music-downloader' does the actual downloading. The wrapper stays running in the background, the downloader runs on-demand per album.",
  },
  {
    title: "Setup Overview",
    content:
      "First you clone and build the wrapper, initialize it with your Apple ID credentials, then run it in the background. Then you clone the downloader, configure your storefront (us, id, jp, etc.), set your save paths, and run downloads with a single Docker command. The whole thing is surprisingly straightforward once it works.",
    code: {
      filename: "terminal",
      language: "bash",
      snippet: `# Quick one-liner to download an album
docker run --rm --network host \\
  -v ~/apple-music/apple-music-downloader/config.yaml:/app/config.yaml:z \\
  -v ~/apple-music/downloads:/downloads:z \\
  ghcr.io/zhaarey/apple-music-downloader \\
  "https://music.apple.com/us/album/..."`,
    },
  },
  {
    title: "Full Guide",
    content: (
      <>
        I wrote a full setup guide with all commands, config options, and troubleshooting tips. It's available at{" "}
        <a
          href="https://github.com/Lemondeft/my-apple-music-downloader"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 border-b border-blue-400 hover:border-b hover:border-white/80 hover:text-white/80 transition-all duration-300"
        >
          github.com/Lemondeft/my-apple-music-downloader
        </a>
        .
      </>
    ),
  },
  {
    title: "Gotchas",
    content: (
      <>
        • SELinux on Fedora requires the <code className="bg-white/10 px-1 rounded">:z</code> flag on every Docker volume mount, or you get permission denied errors everywhere.
        <br />
        • The <code className="bg-white/10 px-1 rounded">--network host</code> flag is required so the downloader can reach the wrapper on localhost.
        <br />
        • The wrapper occasionally dies and needs <code className="bg-white/10 px-1 rounded">docker start apple-wrapper</code> to bring it back.
        <br />
        • Transferring to phone via MTP with <code className="bg-white/10 px-1 rounded">cp</code> works but files can end up root-owned. Use a Docker Alpine container to delete old files if needed.
        <br />
        • The <code className="bg-white/10 px-1 rounded">media-user-token</code> for lyrics comes from your Apple Music web cookies, not the wrapper.
      </>
    ),
  },
  {
    title: "What I Downloaded",
    content: "Started with Yorushika albums, then Кино, OFFICIAL HIGE DANDISM, Kaneko Ayano, .Feast, and a bunch of Indonesian indie artists. All in ALAC, ranging from 16-bit/44.1kHz (CD quality) to 24-bit/48kHz (hi-res). Some albums only have hi-res in specific storefronts — Japan storefront usually has the best quality for Japanese artists.",
  },
  {
    title: "What I Learned",
    content: "How FairPlay DRM works at a high level. Docker networking between containers. Apple Music API storefronts and how catalog varies by region. MTP quirks on Linux. The wrapper's auth token from port 30020 vs the media-user-token from browser cookies — they're different things. And that ALAC at 16-bit/44.1kHz is honestly enough for most use cases.",
  },
]

export default function AppleMusic() {
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
          Downloading ALAC Lossless from Apple Music<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Docker-based setup to download lossless ALAC from Apple Music and transfer to phone.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// apple-music</p>
          <h2 className="text-2xl font-bold mt-2">
            Docker · Shell · ALAC
          </h2>
          <p className="text-white/70 mt-2">Lossless music, the tinkering way</p>
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
