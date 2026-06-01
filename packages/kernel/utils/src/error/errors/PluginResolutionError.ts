import { UnitraErrorCode } from '@unitra/dict/error';
import { PluginResolutionError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class PluginResolutionError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;

  protected override onInit () : void {
    if ( this.data ) {
      const { missing, conflicts, cycles, errCount } = this.data;
      this.message += ` (${ errCount })`;

      if ( missing ) this.message += `\n\nMissing dependencies:\n└─ ${ missing.join( '\n└─ ' ) }`;
      if ( conflicts ) this.message += `\n\nVersion conflicts:\n└─ ${ conflicts.join( '\n└─ ' ) }`;
      if ( cycles ) this.message += `\n\nDependency cycles:\n└─ ${ cycles.join( '\n└─ ' ) }`;
    }
  }
}
