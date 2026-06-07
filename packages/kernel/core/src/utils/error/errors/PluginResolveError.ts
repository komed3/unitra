import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class PluginResolveError extends UnitraError< ErrorCode.PLUGIN_RESOLVE_ERROR > {
  private static out ( title: string, items?: readonly string[] ) : string | null {
    return items?.length ? `${ title }:\n${ `└─ ${ items.join( '\n└─ ' ) }` }` : null;
  }

  public override readonly code = ErrorCode.PLUGIN_RESOLVE_ERROR;

  public override get summary () : string {
    return ! this.context ? '' : [
      PluginResolveError.out( 'Missing dependencies', this.context.missing ),
      PluginResolveError.out( 'Version conflicts', this.context.conflicts ),
      PluginResolveError.out( 'Dependency cycles', this.context.cycles ),
      PluginResolveError.out( 'Override conflicts', this.context.overrides )
    ].filter( Boolean ).join( '\n\n' );
  }
}
