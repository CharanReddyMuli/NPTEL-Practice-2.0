import { parseQuestions } from './parser'
import type { ParseError, Question } from '../types'

export interface QuizFile {
  id: string // full path inside the questions folder
  folder: string
  name: string // file name without .txt, e.g. "Week 1"
  questions: Question[]
  errors: ParseError[]
}

export interface Folder {
  name: string
  files: QuizFile[]
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/**
 * Turns { "<...>/questions/<folder>/<file>.txt": "raw text" } into a sorted folder list.
 * Natural sort, so "Week 2" comes before "Week 10". Files placed directly in
 * questions/ (no folder) are grouped under "General".
 */
export function buildLibrary(raw: Record<string, string>): Folder[] {
  const byFolder = new Map<string, QuizFile[]>()

  for (const [path, text] of Object.entries(raw)) {
    const parts = path.replace(/\\/g, '/').replace(/^.*\/questions\//, '').split('/').filter(Boolean)
    const fileName = parts.pop()
    if (!fileName) continue
    const folder = parts.join(' / ') || 'General'
    const { questions, errors } = parseQuestions(text)
    if (questions.length === 0 && errors.length === 0) {
      errors.push({ question: null, line: 1, message: 'This file is empty.' })
    }
    const file: QuizFile = { id: path, folder, name: fileName.replace(/\.txt$/i, ''), questions, errors }
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), file])
  }

  return [...byFolder.entries()]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([name, files]) => ({ name, files: files.sort((a, b) => collator.compare(a.name, b.name)) }))
}
