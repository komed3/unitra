import type { UnitraErrorOptions } from '@unitra/types/error';
import { UnitraErrorCode } from '@unitra/dict/unitra';
import { UnitraError } from '../UnitraError';

export class PluginError extends UnitraError {
  public constructor ( message: string, options: UnitraErrorOptions = {} ) {
    super( message, { ...options, code: UnitraErrorCode.PLUGIN_ERROR } );
  }
}
