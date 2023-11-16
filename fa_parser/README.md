# Lab 4: FA parser

[Finite Automaton Parser implementation repo](https://github.com/Laurcons/cs-lftc3-lab3/tree/lab4/fa_parser)

This lab is NOT integrated into the previous lab's Scanner implementation. That one still uses RegEx.

Deterministic Finite Automaton implementation.

Input files are written in JSON (which is directly transposable in JavaScript). Tests are made in `src/fa.test.ts` and all of them pass.
```
bun test v1.0.11 (f7f6233e)

src/fa.test.ts:
✓ parse /a*b+/ [0.34ms]
✓ parse /[ab]*a/ [0.12ms]
✓ parse /^„([^”]*)”/u [0.09ms]
✓ parse /([0-9]+)/ [0.22ms]

 4 pass
 0 fail
 17 expect() calls
Ran 4 tests across 1 files. [9.00ms]
```