import type { Question, QuizAction, QuizState } from '../types'

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function initialState(questions: Question[]): QuizState {
  return { questions, index: 0, selected: null, correct: 0, incorrect: 0, streak: 0, bestStreak: 0, finished: false }
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'select': {
      if (state.selected !== null || state.finished) return state // answers are locked
      const isCorrect = action.label === state.questions[state.index].answer
      const streak = isCorrect ? state.streak + 1 : 0
      return {
        ...state,
        selected: action.label,
        correct: state.correct + (isCorrect ? 1 : 0),
        incorrect: state.incorrect + (isCorrect ? 0 : 1),
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
      }
    }
    case 'next': {
      if (state.selected === null || state.finished) return state
      if (state.index === state.questions.length - 1) return { ...state, finished: true }
      return { ...state, index: state.index + 1, selected: null }
    }
    case 'restart':
      return initialState(action.questions)
  }
}
