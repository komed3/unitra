import { UnitraErrorCode } from '@unitra/dict/error';
import { UnitraError } from '../UnitraError';
import { UnitraErrorOptions } from '@unitra/types/error';

export class PluginResolutionError extends UnitraError {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;

  constructor ( message: string, options: UnitraErrorOptions = {} ) {
    super( message, options );
  }
}
