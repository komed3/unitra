import { Format } from '@unitra/dict/common';
import type { IFormatter } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ReferenceState } from '@unitra/types/node';
import { Logging } from '../../utils/logging';

export abstract class Formatter implements IFormatter {
  protected static readonly log = Logging.createSource( 'formatter' );
  protected readonly format: Format = Format.PLAIN;

  constructor ( protected readonly ctx: UnitraContext ) {}

  public abstract out ( state: ReferenceState ) : string;
}
