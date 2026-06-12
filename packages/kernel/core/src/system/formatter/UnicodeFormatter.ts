import type { IFormatter } from '@unitra/types/core/formatter';
import type { ReferenceState } from '@unitra/types/node';
import { Formatter } from './Formatter';

export class UnicodeFormatter extends Formatter implements IFormatter {
  public format ( state: ReferenceState ) : string {
    return '';
  }
}
