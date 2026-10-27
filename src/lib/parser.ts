import type { Option, ParseError, ParseResult, Question } from '../types'

const Q_RE = /^Q\s*:\s*(.*)$/i
const OPTION_RE = /^\(?([A-Za-z])[).]\s*(.*)$/
const ANSWER_RE = /^ANSWER\s*:\s*\(?([A-Za-z])\)?\s*[.)]?\s*$/i
const ANSWER_ANY_RE = /^ANSWER\s*:\s*(.*)$/i
const EXPL_RE = /^EXPLANATION\s*:\s*(.*)$/i

type Section = 'question' | 'option' | 'explanation' | 'answer'

interface Draft {
  number: number
  line: number
  text: string
  options: Option[]
  answer: string | null
  explanation: string
  section: Section
}

export function parseQuestions(input: string): ParseResult {
  const questions: Question[] = []
  const errors: ParseError[] = []
  let draft: Draft | null = null
  let count = 0

  const fail = (d: Draft, line: number, message: string) =>
    errors.push({ question: d.number, line, message })

  const finish = (d: Draft) => {
    const text = d.text.trim()
    const labels = d.options.map((o) => o.label)
    const before = errors.length
    if (!text) fail(d, d.line, 'The question text is empty.')
    if (d.options.length < 2) fail(d, d.line, 'At least two options (A, B, ...) are required.')
    if (new Set(labels).size !== labels.length) fail(d, d.line, 'Option labels must be unique.')
    if (!d.answer) fail(d, d.line, 'Missing "ANSWER:" line.')
    else if (d.answer !== '?' && !labels.includes(d.answer))
      fail(d, d.line, `ANSWER "${d.answer}" does not match any option (${labels.join(', ') || 'none'}).`)
    if (errors.length > before) return
    questions.push({
      id: d.number,
      text,
      options: d.options.map((o) => ({ ...o, text: o.text.trim() })),
      answer: d.answer!,
      explanation: d.explanation.trim() || undefined,
    })
  }

  const lines = input.replace(/\r\n?/g, '\n').split('\n')
  lines.forEach((raw, i) => {
    const lineNo = i + 1
    const line = raw.trim()
    if (!line) return

    const q = line.match(Q_RE)
    if (q) {
      if (draft) finish(draft)
      count += 1
      draft = { number: count, line: lineNo, text: q[1], options: [], answer: null, explanation: '', section: 'question' }
      return
    }

    if (!draft) {
      errors.push({ question: null, line: lineNo, message: 'Text found before the first "Q:" line.' })
      return
    }
    const d: Draft = draft

    const ans = line.match(ANSWER_RE)
    if (ans) {
      if (d.answer) fail(d, lineNo, 'More than one "ANSWER:" line.')
      d.answer = ans[1].toUpperCase()
      d.section = 'answer'
      return
    }
    if (ANSWER_ANY_RE.test(line)) {
      fail(d, lineNo, 'ANSWER must be a single option letter, e.g. "ANSWER: B".')
      d.answer = d.answer ?? '?'
      d.section = 'answer'
      return
    }

    const ex = line.match(EXPL_RE)
    if (ex) {
      d.explanation = ex[1]
      d.section = 'explanation'
      return
    }

    // Options are only recognised before ANSWER/EXPLANATION, so explanation text
    // like "A) is wrong because..." is never mistaken for an option.
    const opt = line.match(OPTION_RE)
    if (opt && (d.section === 'question' || d.section === 'option')) {
      d.options.push({ label: opt[1].toUpperCase(), text: opt[2] })
      d.section = 'option'
      return
    }

    // Continuation line of the current part
    if (d.section === 'question') d.text += '\n' + line
    else if (d.section === 'option') d.options[d.options.length - 1].text += ' ' + line
    else if (d.section === 'explanation') d.explanation += '\n' + line
    else fail(d, lineNo, `Unexpected text after ANSWER: "${line.slice(0, 40)}".`)
  })

  if (draft) finish(draft)
  if (count === 0 && errors.length === 0 && input.trim() !== '')
    errors.push({ question: null, line: 1, message: 'No "Q:" lines found.' })
  return { questions, errors }
}
