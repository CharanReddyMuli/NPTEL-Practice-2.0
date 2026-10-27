# NPTEL Practice

Static quiz site: no backend, no API keys. Questions live as `.txt` files in folders.

```bash
npm install
npm run dev       # open the printed http://localhost:5173
npm test          # parser, quiz logic, folder/file loading
npm run build     # outputs the static site to dist/
npm run preview   # serve dist/ locally
```

Upload the contents of `dist/` to any static host (GitHub Pages, Netlify, Vercel, a school server).
Open it over http, not by double-clicking `index.html`.

## Where the questions go

```text
src/questions/
  Data Structures/        <- shows up in the folder dropdown
    Week 1.txt            <- shows up in the file list on the right
    Week 2.txt
  Python Programming/
    Week 1.txt
```

- Each sub-folder of `src/questions/` is one entry in the dropdown.
- Each `.txt` file in it is one item in the list (file name = the label, e.g. "Week 1").
- "Week 2" sorts before "Week 10". Files placed directly in `src/questions/` appear under "General".
- No list to maintain: add or edit a file and it is picked up (restart `npm run dev` if it was running, then rebuild for deploy).
- A file with a format error is shown in red with the line and reason, and can't be started until fixed.

## File format

```text
Q: Question text
A) Option one
B) Option two
C) Option three
D) Option four
ANSWER: C
EXPLANATION: Optional reason.

Q: Next question...
```

Rules: each question starts with `Q:`; options use `A)` or `A.`; `ANSWER:` is one letter;
`EXPLANATION:` is optional; questions, options and explanations may span multiple lines.

Shortcuts in the quiz: option letters select, Enter = next, Esc = back (with confirmation).
