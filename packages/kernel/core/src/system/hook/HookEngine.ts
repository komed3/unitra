import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';
import { HookCache } from './HookCache';
import { HookStorage } from './HookStorage';

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );
  private readonly hooks = new HookStorage();
  private readonly cache = new HookCache();

  constructor ( private readonly ctx: UnitraContext ) {}
}
