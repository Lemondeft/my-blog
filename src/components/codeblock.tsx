import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  filename: string
  language: string
  snippet: string
}

export default function CodeBlock({ filename, language, snippet }: CodeBlockProps) {
  const copyToClipboard = () => navigator.clipboard.writeText(snippet)

  return (
    <div className="mt-4 rounded-xl overflow-hidden bg-white/5 backdrop-blur-xm border border-white/30 ">
      
      {/* Header with filename and copy button */}
      <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-white/5">
        <span className="text-white/70 font-mono text-sm">{filename}</span>
        <button
          onClick={copyToClipboard}
          className="text-white/50 hover:text-white/90 transition-colors"
          title="Copy code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Syntax highlighter */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent', // allow blur to show through
          fontSize: '0.875rem',
        }}
        showLineNumbers
      >
        {snippet}
      </SyntaxHighlighter>
    </div>
  )
}