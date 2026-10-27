import assert from 'node:assert/strict'
import { parseQuestions } from '../src/lib/parser'
import { initialState, quizReducer } from '../src/lib/quiz'
import { SAMPLE } from '../src/lib/sample'
import { buildLibrary } from '../src/lib/library'

// --- Parser ---
const ok = parseQuestions(SAMPLE)
assert.equal(ok.errors.length, 0)
assert.equal(ok.questions.length, 4)
assert.deepEqual(ok.questions.map((q) => q.answer), ['B', 'B', 'C', 'D']) // answers never mixed
assert.equal(ok.questions[2].explanation?.startsWith('Inorder'), true)

const multi = parseQuestions(`Q: Line one
line two
A. Alpha
   continued
B. Beta
C. Gamma
E) Epsilon
ANSWER: e
EXPLANATION: A) is not an option here
more text

Q: No explanation
A) x
B) y
ANSWER: A`)
assert.equal(multi.errors.length, 0)
assert.equal(multi.questions[0].text, 'Line one\nline two')
assert.equal(multi.questions[0].options[0].text, 'Alpha continued')
assert.equal(multi.questions[0].answer, 'E')
assert.equal(multi.questions[0].explanation, 'A) is not an option here\nmore text')
assert.equal(multi.questions[1].explanation, undefined)

const bad = parseQuestions(`Q: ok
A) 1
B) 2
ANSWER: A

Q: missing answer
A) 1
B) 2

Q: bad answer
A) 1
B) 2
ANSWER: D

Q: one option
A) 1
ANSWER: A

stray`)
assert.equal(bad.questions.length, 1)
assert.deepEqual(bad.errors.map((e) => e.question), [2, 3, 4, 4])
assert.match(bad.errors[0].message, /Missing/)
assert.equal(parseQuestions('').errors.length, 0)
assert.equal(parseQuestions('hello').errors.length, 1)

// --- Quiz reducer / streak ---
let s = initialState(ok.questions) // answers: B B C D
const pick = (l: string) => { s = quizReducer(s, { type: 'select', label: l }) }
const next = () => { s = quizReducer(s, { type: 'next' }) }

next() // cannot advance before answering
assert.equal(s.index, 0)
pick('B'); assert.equal(s.streak, 1)
pick('A'); assert.equal(s.selected, 'B') // locked
next()
pick('B'); assert.equal(s.streak, 2)
next()
pick('A'); assert.equal(s.streak, 0); assert.equal(s.bestStreak, 2) // wrong resets, best kept
next()
pick('D'); assert.equal(s.streak, 1)
next()
assert.equal(s.finished, true)
assert.equal(s.correct, 3); assert.equal(s.incorrect, 1); assert.equal(s.bestStreak, 2)
s = quizReducer(s, { type: 'restart', questions: ok.questions })
assert.deepEqual([s.correct, s.streak, s.bestStreak, s.index, s.finished], [0, 0, 0, 0, false])

console.log('All tests passed')

// --- Library (folders of .txt files) ---

const lib = buildLibrary({
  '../questions/Course B/Week 10.txt': SAMPLE,
  '../questions/Course B/Week 2.txt': SAMPLE,
  '../questions/Course A/Week 1.txt': SAMPLE,
  '../questions/Loose.txt': 'Q: Broken\nA) x\nB) y',
  '../questions/Empty.txt': '',
})
assert.deepEqual(lib.map((f) => f.name), ['Course A', 'Course B', 'General'])
assert.deepEqual(lib[1].files.map((f) => f.name), ['Week 2', 'Week 10']) // natural sort
assert.equal(lib[1].files[0].questions.length, 4)
const general = lib[2].files.map((f) => f.name)
assert.deepEqual(general, ['Empty', 'Loose'])
assert.equal(lib[2].files.every((f) => f.errors.length > 0), true) // bad/empty files are flagged, not dropped
console.log('library tests passed')
