import { UnitraErrorCode } from '@unitra/dict/error';
import type { PluginResolutionError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class PluginResolutionError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;

  public override get summary () : string {
    const parts: string[] = [];

    if ( this.data ) {
      const { missing, conflicts, cycles } = this.data;

      if ( missing?.length ) parts.push( `Missing dependencies:\n└─ ${ missing.join( '\n└─ ' ) }` );
      if ( conflicts?.length ) parts.push( `Version conflicts:\n└─ ${ conflicts.join( '\n└─ ' ) }` );
      if ( cycles?.length ) parts.push( `Dependency cycles:\n└─ ${ cycles.join( '\n└─ ' ) }` );
    }

    return parts.join( '\n\n' );
  }
}
