import { useNavigate } from "react-router-dom"
import Starfield from "../components/Starfield"
import CodeBlock from "../components/codeblock"
import type { JSX } from "react/jsx-runtime"

type Section = {
  title: string
  content: string | JSX.Element
  image?: string
  code?: {
    filename: string
    language: string
    snippet: string
  }
}

const sections: Section[] = [
  {
    title: "Introduction",
    content: (
      <>
        The same friend that introduced me to Linux also introduced me to Baileys, a WhatsApp Web API library for Node.js. I was curious about how it works and decided to build a WhatsApp bot using Baileys. The full source code is available on my GitHub at{" "}
        <a
          href="https://github.com/lemondeft/wa-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 border-b border-blue-400 hover:border-b hover:border-white/80 hover:text-white/80 transition-all duration-300 "
        >
          github.com/lemondeft/wa-bot
        </a>.
      </>
    ),
  },
  {
    title: "What is Baileys?",
    content: "Baileys is a Socket-based TS/JavaScript API for WhatsApp. It allows you to interact with WhatsApp Web and build bots or automation tools. It provides a high-level API for sending messages, managing contacts, and handling events.",
  },
  {
    title: "Getting Started",
    content: "You'll need to install the required dependencies: @whiskeysockets/baileys for WhatsApp integration, qrcode-terminal for authentication, and @hapi/boom for error handling. For me the bot connects to an AI service through the OpenRouter proxy API instead of using a vendor-specific SDK. The complete code including ai.ts and history.ts modules can be found on github.com/lemondeft/wa-bot. Make sure to configure your OpenRouter API key in environment variables.",
    code: {
      filename: "terminal",
      language: "bash",
      snippet: `npm install @whiskeysockets/baileys
npm install qrcode-terminal
npm install @hapi/boom
npm install dotenv`
    }
  },
  {
    title: "Project Setup",
    content: "The bot uses multi-file auth state to persist login sessions, so you don't need to scan QR code every time you restart.",
    code: {
      filename: "setup-connection.ts",
      language: "typescript",
      snippet: `const { state, saveCreds } = await useMultiFileAuthState('auth_info')
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
  auth: state,
  version,
  printQRInTerminal: false,
  getMessage: async () => proto.Message.create({ conversation: '' })
})

sock.ev.on('creds.update', saveCreds)`
    }
  },
  {
    title: "QR Code Authentication",
    content: "When you first run the bot, it generates a QR code in the terminal that you scan with your WhatsApp to authenticate. Once connected, it stays logged in using the saved credentials. If the connection drops, it automatically reconnects after 5 seconds.",
    code: {
      filename: "handle-auth.ts",
      language: "typescript",
      snippet: `sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
  if (qr) qrcode.generate(qr, { small: true })
  if (connection === 'close') {
    const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
    if (statusCode !== DisconnectReason.loggedOut) {
      setTimeout(() => startBot(), 5000)
    }
  } else if (connection === 'open') {
    console.log('Connected')
  }
})`
    }
  },
  {
    title: "Message Processing",
    content: "The bot listens for incoming messages and processes them. It filters out messages that don't start with !ai or !clear commands. I added duplicate message detection to prevent processing the same message twice.",
    code: {
      filename: "process-messages.ts",
      language: "typescript",
      snippet: `const seen = new Set<string>()
const rateLimits = new Map<string, number>()

sock.ev.process(async (events) => {
  if (events['messages.upsert']) {
    const { messages, type } = events['messages.upsert']
    
    if (type !== 'notify') return

    for (const msg of messages) {
      const msgId = msg.key?.id
      if (seen.has(msgId)) continue
      seen.add(msgId)
      setTimeout(() => seen.delete(msgId), 60000)
      
      // Process message...
    }
  }
})`
    }
  },
  {
    title: "Rate Limiting",
    content: "To prevent spam and API overuse, I implemented a 3-second cooldown per user. If someone tries to use the bot too quickly, it tells them how long to wait.",
    code: {
      filename: "apply-rate-limit.ts",
      language: "typescript",
      snippet: `const userId = msg.key.participant || jid
const lastCall = rateLimits.get(userId) || 0
const now = Date.now()
const cooldown = 3000

if (now - lastCall < cooldown) {
  const remaining = Math.ceil((cooldown - (now - lastCall)) / 1000)
  console.log(\`[RATE LIMIT] \${userId.split('@')[0]} \${remaining}s\`)
  
  await sock.sendMessage(jid, { 
    text: \`Wait \${remaining} seconds\` 
  }, { quoted: msg })
  continue
}
rateLimits.set(userId, now)`
    }
  },
  {
    title: "AI Integration",
    content: "The bot sends user prompts to an AI model through the OpenRouter proxy API. Conversation history is maintained per chat so the AI can respond with contextual awareness across multiple messages. A system prompt is injected to simulate casual human texting behavior, including informal tone, contractions, and language adaptation based on the user's input language. The proxy approach allows the AI backend model to be changed without modifying the main bot logic.",
    code: {
      filename: "handle-ai-response.ts",
      language: "typescript",
      snippet: `if (text === '!clear') {
  clearHistory(jid)
  console.log(\`[\${chatType}] \${sender} !clear\`)
  await sock.sendMessage(jid, { 
    text: 'Chat history cleared' 
  }, { quoted: msg })
  continue
}

const prompt = text.slice(4).trim()
const history = appendHistory(jid, 'user', prompt)
const reply = await chat(history)
appendHistory(jid, 'assistant', reply)`
    }
  },
  {
    title: "Smart Message Chunking",
    content: "Long messages are split into chunks at sentence boundaries to maintain readability. This ensures messages don't get cut off mid-sentence.",
    code: {
      filename: "split-messages.ts",
      language: "typescript",
      snippet: `function splitIntoChunks(text: string, maxSize = 150): string[] {
  const sentences = text.match(/[^.!?\\n]+[.!?\\n]*/g) ?? [text]
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + sentence).length > maxSize && current) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current += sentence
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks
}`
    }
  },
  {
    title: "Human-like Typing Simulation",
    content: "To make the bot feel more natural, I implemented realistic typing behavior with variable delays, jitter for randomness, and pauses between chunks. The bot shows 'typing...' indicator before each message.",
    code: {
      filename: "simulate-typing.ts",
      language: "typescript",
      snippet: `async function sendWithTypingAndQuote(
  sock: any,
  jid: string,
  text: string,
  quotedMsg?: proto.IWebMessageInfo
) {
  const chunks = splitIntoChunks(text, 150)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!

    await sock.sendPresenceUpdate('composing', jid)

    const baseDelay = 300
    const perChar = 18
    const jitter = Math.random() * 300
    const delay = Math.min(baseDelay + chunk.length * perChar + jitter, 2500)

    await new Promise(res => setTimeout(res, delay))

    if (i === 0 && quotedMsg) {
      await sock.sendMessage(jid, { text: chunk }, { quoted: quotedMsg })
    } else {
      await sock.sendMessage(jid, { text: chunk })
    }

    await sock.sendPresenceUpdate('paused', jid)
    await new Promise(res => setTimeout(res, 400 + Math.random() * 400))
  }

  await sock.sendPresenceUpdate('available', jid)
}`
    }
  },
  {
    title: "Group Chat Support",
    content: "The bot works in both direct messages and group chats. In groups, it detects who sent the message and logs it accordingly. The rate limiting is per-user, not per-chat.",
    code: {
      filename: "detect-chat-type.ts",
      language: "typescript",
      snippet: `const isGroup = jid?.endsWith('@g.us')
const sender = isGroup 
  ? msg.key.participant?.split('@')[0] 
  : jid.split('@')[0]
const chatType = isGroup ? 'GROUP' : 'DM'

console.log(\`[\${chatType}] \${sender} \${prompt}\`)
console.log(\`[\${chatType}] BOT \${reply.slice(0, 50)}...\`)`
    }
  },
  {
    title: "Features",
    content: "Commands: !ai <message> to chat with AI, !clear to reset conversation history\n• Supports text messages and captions from images/videos\n• Quotes the original message when replying\n• Duplicate message filtering prevents double processing\n• Automatic reconnection if disconnected\n• Realistic typing delays with random jitter\n• Works in both DMs and group chats\n• Per-user rate limiting (3 second cooldown)"
  },
  {
    title: "Challenges",
    content: "Personaly making the bot reply to group chats was a bit tricky because of MAC erros that I had to debug for a while, but after I fixed it, the rest was smooth sailing. The Baileys library is well-designed and the documentation is good, so it was mostly just figuring out how to structure the conversation history and handle edge cases in message processing.",
  },
  {
    title: "What I Learned",
    content: "Working with websockets and event-driven architecture. Managing stateful conversations with history tracking. Implementing rate limiting and anti-spam measures. Making bots feel more natural with typing indicators, delays, and randomness. The importance of error handling for production bots. How to split text intelligently at sentence boundaries."
  },
  {
    title: "Future Plans",
    content: "Add image analysis through the OpenRouter AI proxy. Implement commands such as !help, !stats, and !remind. Add admin-only commands for group chats. Store conversation history in a database instead of memory. Add support for voice messages. Make the bot respond to mentions in group chats automatically. Improve typing simulation with more realistic pause and burst patterns."
  }
]

export default function Wabot() {
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
          WhatsApp AI Bot<span className="caret">_</span>
        </h1>
        <p className="text-white/70 mt-4 font-light">
          Documentation of my WhatsApp bot project using Baileys, a Socket-based TS/JavaScript API for WhatsApp.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/40 backdrop-blur">
          <p className="text-white/50 font-mono">// Baileys</p>
          <h2 className="text-2xl font-bold mt-2">TypeScript · Baileys · Node.js</h2>
          <p className="text-white/70 mt-2">Building a WhatsApp bot</p>
        </div>
        {/* Sections */}
        <div className="flex flex-col gap-8 mt-12">
          {sections.map((item) => (
            <div
              key={item.title}
              className="p-6 border-b border-white/10 last:border-none"
            >
              <h2 className="text-white text-2xl font-bold mb-2">{item.title}</h2>
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