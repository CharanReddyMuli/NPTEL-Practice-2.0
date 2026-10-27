import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Home from './components/Home'
import QuizScreen from './components/QuizScreen'
import ThemeToggle from './components/ThemeToggle'
import { library } from './lib/questions'
import type { QuizFile } from './lib/library'

// localStorage helpers: fail quietly if storage is unavailable
const load = (k: string, fallback: string) => { try { return localStorage.getItem(k) ?? fallback } catch { return fallback } }
const save = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } }

export default function App() {
  const [folder, setFolder] = useState(() => load('nptel.folder', ''))
  const [shuffle, setShuffle] = useState(() => load('nptel.shuffle', 'false') === 'true')
  const [showExplanations, setShowExplanations] = useState(() => load('nptel.explain', 'true') === 'true')
  const [active, setActive] = useState<QuizFile | null>(null)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    save('nptel.theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => save('nptel.folder', folder), [folder])
  useEffect(() => save('nptel.shuffle', String(shuffle)), [shuffle])
  useEffect(() => save('nptel.explain', String(showExplanations)), [showExplanations])

  const toggle = <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />

  return (
    <>
      {toggle}
      {active ? (
        <QuizScreen
          key={active.id}
          file={active}
          shuffleOnStart={shuffle}
          showExplanations={showExplanations}
          onExit={() => setActive(null)}
        />
      ) : (
        <Home
          folders={library}
          folder={folder}
          onFolderChange={setFolder}
          shuffle={shuffle}
          onShuffleChange={setShuffle}
          showExplanations={showExplanations}
          onShowExplanationsChange={setShowExplanations}
          onStart={setActive}
        />
      )}
      <Analytics />
    </>
  )
}
