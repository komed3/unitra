import { UnitraErrorCode } from '@unitra/dict/error';
import { PluginResolutionError as ErrorType } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export class PluginResolutionError extends UnitraError< ErrorType > {
  public override readonly code = UnitraErrorCode.PLUGIN_RESOLUTION_ERROR;
}
