import { useNavigate } from "react-router-dom";
import Starfield from "../components/Starfield";
import CodeBlock from "../components/codeblock";
import type { JSX } from "react/jsx-runtime";

type Section = {
  title: string;
  content: string | JSX.Element;
  image?: string;
  code?: {
    filename: string;
    language: string;
    snippet: string;
  };
};

const sections: Section[] = [
  {
    title: "Introduction",
    content: (
      <>
        The same friend that introduced me to Linux also introduced me to
        Baileys, a WhatsApp Web API library for Node.js. I was curious about how
        it works and decided to build a WhatsApp bot using Baileys. The full
        source code is available on my GitHub at{" "}
        <a
          href="https://github.com/lemondeft/wa-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 border-b border-blue-400 hover:border-b hover:border-white/80 hover:text-white/80 transition-all duration-300 "
        >
          github.com/lemondeft/wa-bot
        </a>
        .
      </>
    ),
  },
  {
    title: "What is Baileys?",
    content:
      "Baileys is a Socket-based TS/JavaScript API for WhatsApp. It allows you to interact with WhatsApp Web and build bots or automation tools. It provides a high-level API for sending messages, managing contacts, and handling events.",
  },
  {
    title: "Getting Started",
    content:
      "You'll need to install the required dependencies: @whiskeysockets/baileys for WhatsApp integration, qrcode-terminal for authentication, and @hapi/boom for error handling. For me the bot connects to an AI service through a proxy API instead of using a vendor-specific SDK. The complete code including ai.ts and history.ts modules can be found on github.com/lemondeft/wa-bot. Make sure to configure your API key in environment variables.",
    code: {
      filename: "terminal",
      language: "bash",
      snippet: `npm install @whiskeysockets/baileys
npm install qrcode-terminal
npm install @hapi/boom
npm install dotenv`,
    },
  },
  {
    title: "Project Setup",
    content:
      "The bot uses multi-file auth state to persist login sessions, so you don't need to scan QR code every time you restart.",
    code: {
      filename: "wa.ts",
      language: "typescript",
      snippet: `const { state, saveCreds } = await useMultiFileAuthState('auth_info')
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
  auth: state,
  version,
  printQRInTerminal: false,
  getMessage: async () => proto.Message.create({ conversation: '' })
})

sock.ev.on('creds.update', saveCreds)`,
    },
  },
  {
    title: "QR Code Authentication",
    content:
      "When you first run the bot, it generates a QR code in the terminal that you scan with your WhatsApp to authenticate. Once connected, it stays logged in using the saved credentials. If the connection drops, it automatically reconnects after 5 seconds.",
    code: {
      filename: "wa.ts",
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
})`,
    },
  },
  {
    title: "Message Processing",
    content:
      "The bot listens for incoming messages and processes them. It filters out messages that don't start with !ai or !clear commands. I added duplicate message detection to prevent processing the same message twice.",
    code: {
      filename: "wa.ts",
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
})`,
    },
  },
  {
    title: "Rate Limiting",
    content:
      "To prevent spam and API overuse, I implemented a 3-second cooldown per user. If someone tries to use the bot too quickly, it tells them how long to wait.",
    code: {
      filename: "wa.ts",
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
rateLimits.set(userId, now)`,
    },
  },
  {
    title: "AI Integration",
    content:
      "The bot sends user prompts to an AI model through a proxy API. Conversation history is maintained per chat so the AI can respond with contextual awareness across multiple messages. A system prompt is injected to simulate casual human texting behavior, including informal tone, contractions, and language adaptation based on the user's input language. The proxy approach allows the AI backend model to be changed without modifying the main bot logic.",
    code: {
      filename: "wa.ts",
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
appendHistory(jid, 'assistant', reply)`,
    },
  },
  {
    title: "Smart Message Chunking",
    content:
      "Long messages are split into chunks at sentence boundaries to maintain readability. This ensures messages don't get cut off mid-sentence.",
    code: {
      filename: "wa.ts",
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
}`,
    },
  },
  {
    title: "Human-like Typing Simulation",
    content:
      "To make the bot feel more natural, I implemented realistic typing behavior with variable delays, jitter for randomness, and pauses between chunks. The bot shows 'typing...' indicator before each message.",
    code: {
      filename: "wa.ts",
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
}`,
    },
  },
  {
    title: "Group Chat Support",
    content:
      "The bot works in both direct messages and group chats. In groups, it detects who sent the message and logs it accordingly. The rate limiting is per-user, not per-chat.",
    code: {
      filename: "wa.ts",
      language: "typescript",
      snippet: `const isGroup = jid?.endsWith('@g.us')
const sender = isGroup 
  ? msg.key.participant?.split('@')[0] 
  : jid.split('@')[0]
const chatType = isGroup ? 'GROUP' : 'DM'

console.log(\`[\${chatType}] \${sender} \${prompt}\`)
console.log(\`[\${chatType}] BOT \${reply.slice(0, 50)}...\`)`,
    },
  },
  {
    title: "Image Generation Support",
    content:
      "The bot supports image generation through the !img command. Users provide a description, and the bot fetches the image from the generation API. The implementation handles both base64-encoded data URLs and regular image URLs, with proper error handling for rate limits and network failures. A processing lock prevents concurrent image generation requests.",
    code: {
      filename: "wa.ts",
      language: "typescript",
      snippet: `if (text.startsWith('!img')) {
  const prompt = text.slice(5).trim()
  if (!prompt) {
    await sock.sendMessage(jid, { text: 'usage: !img <description>' }, { quoted: msg })
    continue
  }
  
  isProcessing = true
  console.log(\`[\${tag}] \${sender} !img \${prompt}\`)
  await sock.sendMessage(jid, { text: 'generating image...' }, { quoted: msg })
  
  const result = await generateImage(prompt)
  if (!result || result === 'RATE_LIMITED') {
    const msg_text = result === 'RATE_LIMITED' 
      ? 'rate limited, try again later' 
      : 'failed to generate image'
    await sock.sendMessage(jid, { text: msg_text }, { quoted: msg })
    isProcessing = false
    continue
  }
  
  try {
    let imgBuffer: Buffer
    if (result.url.startsWith('data:image')) {
      const base64Data = result.url.split(',')[1]
      if (!base64Data) throw new Error('Invalid base64 format')
      imgBuffer = Buffer.from(base64Data, 'base64')
    } else {
      const response = await fetch(result.url)
      if (!response.ok) throw new Error(\`Failed to fetch: \${response.status}\`)
      imgBuffer = Buffer.from(await response.arrayBuffer())
    }
    
    await sock.sendMessage(jid, { 
      image: imgBuffer, 
      caption: result.caption || prompt 
    }, { quoted: msg })
  } catch (err: any) {
    console.error(\`[\${tag}] Image send failed:\`, err?.message)
    await sock.sendMessage(jid, { 
      text: 'failed to send image: ' + err?.message 
    }, { quoted: msg })
  }
  isProcessing = false
  continue
}`,
    },
  },
  {
    title: "View-Once Message Reveal",
    content:
      "One of the most unique features is the !reveal command, which captures view-once images and videos before they disappear. The bot maintains a cache of view-once media it sees, and users can reply to a view-once message with !reveal to get the full media back. The implementation handles message ID aliases, tries multiple download strategies with fallback attempts, and uses MIME type detection for proper media formatting.",
    code: {
      filename: "wa.ts",
      language: "typescript",
      snippet: `if (text.startsWith('!reveal')) {
  const contextInfo = msg.message?.extendedTextMessage?.contextInfo
  const quotedId = contextInfo?.stanzaId

  if (!quotedId) {
    await sock.sendMessage(jid, { 
      text: 'Please reply to a view-once message with "!reveal"' 
    }, { quoted: msg })
    continue
  }

  const normalizedQuotedId = normalizeMsgId(quotedId)
  const resolvedQuotedId = resolveViewOnceId(normalizedQuotedId)
  const cached = viewOnceCache.get(normalizedQuotedId) 
    || viewOnceCache.get(resolvedQuotedId)

  if (cached) {
    await sendBufferedMedia(sock, jid, cached.buffer, cached.mimetype, msg)
    console.log(\`[\${tag}] \${sender} revealed (cached)\`)
    continue
  }

  // Fallback: try multiple download strategies
  const keyCandidates = [
    { remoteJid: quotedRemoteJid, id: quotedId, participant: quotedParticipant },
    { remoteJid: jid, id: quotedId, participant: quotedParticipant },
    { remoteJid: quotedRemoteJid, id: resolvedQuotedId, participant: quotedParticipant }
  ]

  for (const keyCandidate of keyCandidates) {
    try {
      const buffer = await downloadMediaMessage(
        { key: keyCandidate }, 'buffer', {},
        { logger: silentLogger, reuploadRequest: sock.updateMediaMessage }
      )
      if (buffer.byteLength > 0) {
        const mimeType = inferMimeTypeFromBuffer(buffer)
        cacheViewOnce(normalizedQuotedId, buffer, mimeType)
        await sendBufferedMedia(sock, jid, buffer, mimeType, msg)
        break
      }
    } catch { }
  }
}`,
    },
  },
  {
    title: "Features",
    content: (
      <>
        <strong>Commands:</strong> !ai &lt;message&gt; to chat with AI, !img
        &lt;description&gt; to generate images, !clear to reset conversation
        history
        <br />
        <br />
        • Supports text messages and captions from images/videos
        <br />
        • Quotes the original message when replying
        <br />
        • Duplicate message filtering prevents double processing
        <br />
        • Automatic reconnection if disconnected
        <br />
        • Realistic typing delays with random jitter
        <br />
        • Works in both DMs and group chats
        <br />
        • Per-user rate limiting (3 second cooldown)
        <br />• Image generation with dual format support (base64/URL)
      </>
    ),
  },
  {
    title: "Challenges",
    content:
      "Personally, making the bot reply to group chats was a bit tricky because of MAC errors that I had to debug for a while, but after I fixed it, the rest was smooth sailing. The Baileys library is well-designed and the documentation is good, so it was mostly just figuring out how to structure the conversation history and handle edge cases in message processing.",
  },
  {
    title: "Challenges",
    content:
      "Personaly making the bot reply to group chats was a bit tricky because of MAC erros that I had to debug for a while, but after I fixed it, the rest was smooth sailing. The Baileys library is well-designed and the documentation is good, so it was mostly just figuring out how to structure the conversation history and handle edge cases in message processing.",
  },
  {
    title: "What I Learned",
    content:
      "Working with websockets and event-driven architecture. Managing stateful conversations with history tracking. Implementing rate limiting and anti-spam measures. Making bots feel more natural with typing indicators, delays, and randomness. The importance of error handling for production bots. How to split text intelligently at sentence boundaries.",
  },
  {
    title: "Future Plans",
    content:
      "Add image analysis through the AI proxy. Implement commands such as !help, !stats, and !remind. Add admin-only commands for group chats. Store conversation history in a database instead of memory. Add support for voice messages. Make the bot respond to mentions in group chats automatically. Improve typing simulation with more realistic pause and burst patterns.",
  },
];

export default function Wabot() {
  const navigate = useNavigate();

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
          Documentation of my WhatsApp bot project using Baileys, a Socket-based
          TS/JavaScript API for WhatsApp.
        </p>

        <div className="border border-white/20 rounded-xl p-6 mt-8 bg-black/20">
          <p className="text-white/50 font-mono">// Baileys</p>
          <h2 className="text-2xl font-bold mt-2">
            TypeScript · Baileys · Node.js
          </h2>
          <p className="text-white/70 mt-2">Building a WhatsApp bot</p>
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

              {item.image && (
                <div className="flex justify-center mt-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-2/3 rounded border border-white/20"
                  />
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
  );
}
