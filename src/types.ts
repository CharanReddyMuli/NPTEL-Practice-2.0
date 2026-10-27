export interface Option {
  label: string // "A", "B", ...
  text: string
}

export interface Question {
  id: number
  text: string
  options: Option[]
  answer: string // option label, e.g. "B"
  explanation?: string
}

export interface ParseError {
  question: number | null // 1-based question number, null if before the first Q:
  line: number // 1-based line number in the pasted text
  message: string
}

export interface ParseResult {
  questions: Question[]
  errors: ParseError[]
}

export interface QuizState {
  questions: Question[]
  index: number
  selected: string | null
  correct: number
  incorrect: number
  streak: number
  bestStreak: number
  finished: boolean
}

export type QuizAction =
  | { type: 'select'; label: string }
  | { type: 'next' }
  | { type: 'restart'; questions: Question[] }
