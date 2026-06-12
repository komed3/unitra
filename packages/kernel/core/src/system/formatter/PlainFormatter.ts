import type { Lang, System } from '@unitra/dict/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import type { ReferenceState } from '@unitra/types/node';
import { Formatter } from './Formatter';

export type PlainFormatterOptions = {
  system?: System;
  lang?: Lang;
};

export class PlainFormatter extends Formatter implements IFormatter {
  public format ( state: ReferenceState, options?: PlainFormatterOptions ) : string {
    return this.ctx.hook().run( 'core.formatter.format', { state, options }, '' );
  }
}
