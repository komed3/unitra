import type { HookDef, HookId, HookPipeline } from '@unitra/types/hook';
import Logging from '@unitra/utils/logging';

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );

  private readonly hooks = new Map< HookId, ReadonlyArray< HookDef< any > > >();
  private readonly cache = new Map< HookId, HookPipeline< any > >();
}
