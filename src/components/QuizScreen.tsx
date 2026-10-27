import { useEffect, useReducer } from 'react'
import type { CSSProperties } from 'react'
import { Check, Flame, X } from 'lucide-react'
import { initialState, quizReducer, shuffle } from '../lib/quiz'
import type { QuizFile } from '../lib/library'
import type { Question } from '../types'
import ResultScreen from './ResultScreen'

interface Props {
  file: QuizFile
  shuffleOnStart: boolean
  showExplanations: boolean
  onExit: () => void
}

const prepare = (qs: Question[], doShuffle: boolean) => (doShuffle ? shuffle(qs) : qs)

export default function QuizScreen({ file, shuffleOnStart, showExplanations, onExit }: Props) {
  const [state, dispatch] = useReducer(quizReducer, undefined, () => initialState(prepare(file.questions, shuffleOnStart)))
  const { index, selected, finished } = state
  const q = state.questions[index]
  const total = state.questions.length
  const answered = selected !== null

  // Warn before closing the tab mid-quiz
  useEffect(() => {
    if (finished) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [finished])

  const leave = () => {
    if (finished || window.confirm('Leave the quiz? Your progress will be lost.')) onExit()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Escape') { leave(); return }
      if (finished) return
      if (e.key === 'Enter') { e.preventDefault(); dispatch({ type: 'next' }); return }
      const letter = e.key.toUpperCase()
      if (letter.length === 1 && q.options.some((o) => o.label === letter)) {
        dispatch({ type: 'select', label: letter })
        ;(document.activeElement as HTMLElement | null)?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (finished) {
    return (
      <ResultScreen
        title={`${file.folder} · ${file.name}`}
        state={state}
        onRestart={() => dispatch({ type: 'restart', questions: prepare(file.questions, shuffleOnStart) })}
        onBack={onExit}
      />
    )
  }

  const progress = Math.round(((index + (answered ? 1 : 0)) / total) * 100)
  const style = (label: string) => {
    if (!answered) return 'opt-enter border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 hover:-translate-y-0.5'
    if (label === q.answer) return 'opt-correct border-green-500 bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100'
    if (label === selected) return 'opt-wrong border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-100'
    return 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 opacity-60'
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <p className="mb-1 truncate text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          {file.folder} · {file.name}
        </p>
        <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {index + 1} of {total}</span>
          <span key={state.streak} className={`flex items-center gap-1 font-medium text-orange-500 ${state.streak > 0 ? 'streak-pop' : ''}`} title="Current streak">
            <Flame size={18} className={state.streak >= 3 ? 'flame-hot' : ''} /> {state.streak}
          </span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="progress-fill h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        {/* key = question index, so each new question slides in */}
        <div key={index} className="q-enter">
          <h2 className="whitespace-pre-wrap text-lg font-medium leading-relaxed sm:text-xl">{q.text}</h2>

          <div className="mt-6 space-y-2.5">
            {q.options.map((o, i) => (
              <button
                key={o.label}
                disabled={answered}
                onClick={() => dispatch({ type: 'select', label: o.label })}
                style={(answered ? undefined : { animationDelay: `${120 + i * 70}ms` }) as CSSProperties | undefined}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition duration-200 ${style(o.label)}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current text-xs font-semibold">{o.label}</span>
                <span className="flex-1 leading-relaxed">{o.text}</span>
                {answered && o.label === q.answer && <Check size={20} className="icon-in mt-0.5 shrink-0 text-green-600 dark:text-green-400" />}
                {answered && o.label === selected && o.label !== q.answer && <X size={20} className="icon-in mt-0.5 shrink-0 text-red-600 dark:text-red-400" />}
              </button>
            ))}
          </div>

          {answered && showExplanations && q.explanation && (
            <p className="expl-enter mt-5 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">{q.explanation}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="hidden text-xs text-gray-400 dark:text-gray-500 sm:block">Keys: option letter · Enter next · Esc exit</span>
          <button
            onClick={() => dispatch({ type: 'next' })}
            disabled={!answered}
            className={`ml-auto rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 ${answered ? 'btn-ready' : ''}`}
          >
            {index === total - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </main>
  )
}
