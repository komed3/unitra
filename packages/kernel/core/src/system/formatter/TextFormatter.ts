import type { IFormatter } from '@unitra/types/core/formatter';
import type { ReferenceState } from '@unitra/types/node';
import { Formatter } from './Formatter';

export class TextFormatter extends Formatter implements IFormatter {
  public out ( state: ReferenceState ) : string {
    return '';
  }
}
