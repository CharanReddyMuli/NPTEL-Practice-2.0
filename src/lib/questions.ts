import { buildLibrary } from './library'

// Every .txt file inside src/questions/** is bundled at build time. No manifest to maintain:
// drop a file in a folder, rebuild (or just save while `npm run dev` is running).
const raw = import.meta.glob('../questions/**/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const library = buildLibrary(raw)
