import { UnitraErrorCode } from '@unitra/dict/error';
import { PluginResolutionError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class PluginResolutionError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;

  protected override afterInit () : void {
    if ( this.data ) {
      const { missing, conflicts, cycles, errCount } = this.data;
      this.header = `resolution failed due to errors (${ errCount })`;

      if ( missing ) this.header += `\n\nMissing dependencies:\n└─ ${ missing.join( '\n└─ ' ) }`;
      if ( conflicts ) this.header += `\n\nVersion conflicts:\n└─ ${ conflicts.join( '\n└─ ' ) }`;
      if ( cycles ) this.header += `\n\nDependency cycles:\n└─ ${ cycles.join( '\n└─ ' ) }`;
    }
  }
}
