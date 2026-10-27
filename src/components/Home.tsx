import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  Play,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Folder, QuizFile } from '../lib/library'

interface Props {
  folders: Folder[]
  folder: string
  onFolderChange: (name: string) => void
  shuffle: boolean
  onShuffleChange: (v: boolean) => void
  showExplanations: boolean
  onShowExplanationsChange: (v: boolean) => void
  onStart: (file: QuizFile) => void
}

const delay = (i: number): CSSProperties => ({ animationDelay: `${i * 60}ms` })

function SocialLinks() {
  return (
    <nav
      aria-label="Social profiles"
      className="flex items-center gap-2"
    >
      <a
        href="https://github.com/charanreddymuli"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Github size={19} />
      </a>

      <a
        href="https://www.linkedin.com/in/charanreddymuli/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Linkedin size={19} />
      </a>

      <a
        href="https://leetcode.com/u/Charanreddy0007/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LeetCode"
        title="LeetCode"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span className="text-xs font-bold">LC</span>
      </a>

      <a
        href="https://charanreddy.qzz.io/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Portfolio"
        title="Portfolio"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Globe size={19} />
      </a>
    </nav>
  )
}

export default function Home(p: Props) {
  const current = p.folders.find((f) => f.name === p.folder) ?? p.folders[0]
  const totalFiles = p.folders.reduce((n, f) => n + f.files.length, 0)
  const totalQuestions = p.folders.reduce((n, f) => n + f.files.reduce((m, x) => m + x.questions.length, 0), 0)

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="fade-up flex flex-wrap items-start justify-between gap-4 pr-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            NPTEL Practice
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Pick a folder and a week on the right, then practice one question at a time.
          </p>
        </div>

        <SocialLinks />
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* LEFT: options + how to add questions */}
        <section className="order-2 space-y-6 lg:order-1">
          <div className="fade-up grid grid-cols-3 gap-3" style={delay(1)}>
            {[
              ['Folders', p.folders.length],
              ['Files', totalFiles],
              ['Questions', totalQuestions],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{v}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{k}</div>
              </div>
            ))}
          </div>

          <div className="fade-up rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900" style={delay(2)}>
            <h2 className="font-medium">Quiz options</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={p.shuffle} onChange={(e) => p.onShuffleChange(e.target.checked)} className="accent-indigo-600" />
                Shuffle questions
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={p.showExplanations} onChange={(e) => p.onShowExplanationsChange(e.target.checked)} className="accent-indigo-600" />
                Show explanations
              </label>
            </div>
          </div>

          <div className="fade-up rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400" style={delay(3)}>
            <h2 className="font-medium text-gray-900 dark:text-gray-100">Adding your own questions</h2>
            <p className="mt-2">Put .txt files in folders inside <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">src/questions/</code>, then rebuild. One file = one week.</p>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-950">{`src/questions/
  Data Structures/
    Week 1.txt
    Week 2.txt
  Python Programming/
    Week 1.txt`}</pre>
            <p className="mt-3">Inside each file, use this format:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-950">{`Q: Question text (can span several lines)
A) First option
B) Second option
C) Third option
ANSWER: B
EXPLANATION: Optional, can span several lines

Q: Next question...`}</pre>
          </div>
        </section>

        {/* RIGHT: folder dropdown + files */}
        <aside className="order-1 self-start lg:order-2 lg:sticky lg:top-6">
          <div className="fade-up rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900" style={delay(1)}>
            {!current ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No question files found. Add .txt files to <code>src/questions/&lt;folder&gt;/</code> and rebuild.
              </p>
            ) : (
              <>
                <label htmlFor="folder" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FolderOpen size={16} /> Practice from
                </label>
                <div className="relative">
                  <select
                    id="folder"
                    value={current.name}
                    onChange={(e) => p.onFolderChange(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-9 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:focus:ring-indigo-900"
                  >
                    {p.folders.map((f) => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                <h2 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Files ({current.files.length})
                </h2>

                {/* key = folder name, so the list re-animates whenever the dropdown changes */}
                <ul key={current.name} className="space-y-2">
                  {current.files.map((f, i) => {
                    const broken = f.errors.length > 0
                    return (
                      <li key={f.id} className="opt-enter" style={delay(i)}>
                        <button
                          disabled={broken}
                          onClick={() => p.onStart(f)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3.5 py-3 text-left transition hover:translate-x-1 hover:border-indigo-400 hover:bg-indigo-50/50 disabled:cursor-not-allowed disabled:border-red-200 disabled:bg-red-50 disabled:hover:translate-x-0 dark:border-gray-800 dark:hover:bg-indigo-950/40 dark:disabled:border-red-900 dark:disabled:bg-red-950/40"
                        >
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${broken ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'}`}>
                            {broken ? <AlertCircle size={18} /> : <FileText size={18} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{f.name}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {broken ? `${f.errors.length} format problem${f.errors.length === 1 ? '' : 's'}` : `${f.questions.length} question${f.questions.length === 1 ? '' : 's'}`}
                            </span>
                          </span>
                          {!broken && (
                            <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-300">
                              <Play size={12} /> Start <ChevronRight size={14} />
                            </span>
                          )}
                        </button>
                        {broken && (
                          <ul className="mt-1 space-y-0.5 px-2 text-xs text-red-700 dark:text-red-300">
                            {f.errors.slice(0, 3).map((e, j) => (
                              <li key={j}>{e.question ? `Question ${e.question}` : 'File'} (line {e.line}): {e.message}</li>
                            ))}
                            {f.errors.length > 3 && <li>+{f.errors.length - 3} more</li>}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
