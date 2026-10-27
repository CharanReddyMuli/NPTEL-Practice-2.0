import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Flame, RotateCcw, ArrowLeft } from 'lucide-react'
import type { QuizState } from '../types'
import Confetti from './Confetti'

interface Props {
  title: string
  state: QuizState
  onRestart: () => void
  onBack: () => void
}

function useCountUp(target: number, ms = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

const R = 54
const CIRC = 2 * Math.PI * R

export default function ResultScreen({ title, state, onRestart, onBack }: Props) {
  const total = state.questions.length
  const accuracy = total ? Math.round((state.correct / total) * 100) : 0
  const shown = useCountUp(accuracy)
  const message = accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great work!' : accuracy >= 40 ? 'Good effort. Review and go again.' : 'Keep practicing, you will get there.'
  const rows: [string, string | number][] = [
    ['Total questions', total],
    ['Correct', state.correct],
    ['Incorrect', state.incorrect],
  ]

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      {accuracy >= 70 && <Confetti />}
      <div className="q-enter w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md dark:border-gray-800 dark:bg-gray-900">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{title}</p>
        <h2 className="mt-1 text-2xl font-semibold">Quiz complete</h2>

        <div className="relative mx-auto mt-6 h-40 w-40">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" strokeWidth="10" className="stroke-gray-100 dark:stroke-gray-800" />
            <circle
              cx="64" cy="64" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
              className="ring-fill stroke-indigo-600 dark:stroke-indigo-400"
              strokeDasharray={CIRC} strokeDashoffset={CIRC}
              style={{ '--offset': CIRC * (1 - accuracy / 100) } as CSSProperties}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tabular-nums">{shown}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">accuracy</span>
          </div>
        </div>
        <p className="fade-up mt-4 text-center text-sm text-gray-600 dark:text-gray-300" style={{ animationDelay: '600ms' }}>{message}</p>

        <dl className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map(([k, v], i) => (
            <div key={k} className="fade-up flex justify-between py-3" style={{ animationDelay: `${300 + i * 90}ms` }}>
              <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
          <div className="fade-up flex justify-between py-3" style={{ animationDelay: '570ms' }}>
            <dt className="text-gray-500 dark:text-gray-400">Highest streak</dt>
            <dd className="flex items-center gap-1 font-medium text-orange-500"><Flame size={18} /> {state.bestStreak}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button onClick={onRestart} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
            <RotateCcw size={16} /> Practice Again
          </button>
          <button onClick={onBack} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
            <ArrowLeft size={16} /> Back to Files
          </button>
        </div>
      </div>
    </main>
  )
}
