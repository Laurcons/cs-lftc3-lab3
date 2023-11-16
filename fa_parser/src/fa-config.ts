export interface IFAConfig {
  states: string[];
  initialState: string;
  finalStates: string[];
  transitions: ITransition[];
}

export type ITransition =
  | { from: string; to: string; via: string; isSpecial?: false }
  | ({ from: string; to: string; isSpecial: true } & {
      via: SpecialTransition.anyOneUnicode;
      except?: string;
    });

export enum SpecialTransition {
  anyOneUnicode = 'anyOneUnicode',
}
