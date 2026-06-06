import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class PluginResolveError extends UnitraError< ErrorCode.PLUGIN_RESOLVE_ERROR > {
  public override readonly code = ErrorCode.PLUGIN_RESOLVE_ERROR;

  public override get summary () : string {
    const parts: string[] = [];

    if ( this.context ) {
      const { missing, conflicts, cycles } = this.context;

      if ( missing.length ) parts.push( `Missing dependencies:\n└─ ${ missing.join( '\n└─ ' ) }` );
      if ( conflicts.length ) parts.push( `Version conflicts:\n└─ ${ conflicts.join( '\n└─ ' ) }` );
      if ( cycles.length ) parts.push( `Dependency cycles:\n└─ ${ cycles.join( '\n└─ ' ) }` );
    }

    return parts.join( '\n\n' );
  }
}
