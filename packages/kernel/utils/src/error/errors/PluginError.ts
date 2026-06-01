import { UnitraErrorCode } from '@unitra/dict/unitra';
import { UnitraError } from '../UnitraError';

export class PluginError extends UnitraError {
  public constructor ( message: string, data?: unknown, cause?: unknown ) {
    super( message, { code: UnitraErrorCode.PLUGIN_ERROR, data, cause } );
  }
}
