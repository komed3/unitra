import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Tokenize {
  private static readonly log = Logging.createSource( 'parser::tokenize' );

  constructor ( private readonly ctx: UnitraContext ) {}
}
