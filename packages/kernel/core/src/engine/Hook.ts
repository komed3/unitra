import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../utils';

export class Hook {
  private static readonly log = Logging.createSource( 'hook' );
  private readonly hooks = new Map();
  private readonly cache = new Map();

  constructor ( private readonly ctx: UnitraContext ) {}
}
