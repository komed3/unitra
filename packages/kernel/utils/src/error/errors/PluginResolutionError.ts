import { UnitraErrorCode } from '@unitra/dict/error';
import { PluginResolutionError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class PluginResolutionError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;

  public override get summary () : string {
    let out = '';

    if ( this.data ) {
      const { missing, conflicts, cycles } = this.data;

      if ( missing ) out += `\n\nMissing dependencies:\n└─ ${ missing.join( '\n└─ ' ) }`;
      if ( conflicts ) out += `\n\nVersion conflicts:\n└─ ${ conflicts.join( '\n└─ ' ) }`;
      if ( cycles ) out += `\n\nDependency cycles:\n└─ ${ cycles.join( '\n└─ ' ) }`;
    }

    return out;
  }
}
