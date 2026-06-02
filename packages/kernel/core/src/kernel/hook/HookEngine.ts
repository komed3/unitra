import Logging from '@unitra/utils/logging';

type Pipeline< C extends {} > = ( ctx: C, input?: unknown ) => unknown;

export class HookEngine {
  private static readonly log = Logging.createSource( 'hook' );
}
