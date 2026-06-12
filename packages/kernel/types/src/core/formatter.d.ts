import type { ReferenceState } from '../node';

export interface IFormatter {
  format ( state: ReferenceState ) : string;
}
