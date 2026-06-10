import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Factorize {
  private static readonly log = Logging.createSource( 'parser::factorize' );

  constructor ( private readonly ctx: UnitraContext ) {}
}
