import { IFAConfig, SpecialTransition } from './fa-config';

export class FA {
  constructor(private config: IFAConfig) {}

  match(input: string) {
    let currentState = this.config.initialState;
    let remainingInput = input;
    let matchedInput = '';

    while (true) {
      // look for valid paths to proceed to and
      //  proceed to the first
      const adjacentTransitions = this.config.transitions.filter(
        (t) => t.from === currentState
      );
      let found = false;
      for (const tr of adjacentTransitions) {
        if (tr.isSpecial) {
          if (tr.via === SpecialTransition.anyOneUnicode) {
            const chr = remainingInput.slice(0, 1)[0];
            if (chr && !tr.except?.includes(chr)) {
              remainingInput = remainingInput.slice(1);
              currentState = tr.to;
              matchedInput += chr;
              found = true;
            }
          }
        } else if (remainingInput.slice(0, tr.via.length) === tr.via) {
          remainingInput = remainingInput.slice(tr.via.length);
          currentState = tr.to;
          matchedInput += tr.via;
          found = true;
        }
        if (found) break;
      }
      if (!found) {
        return this.config.finalStates.includes(currentState)
          ? matchedInput
          : null;
      }
    }
  }
}
