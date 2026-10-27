import { Moon, Sun } from 'lucide-react'

interface Props {
  dark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={(e) => { onToggle(); e.currentTarget.blur() }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="fixed right-4 top-4 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
