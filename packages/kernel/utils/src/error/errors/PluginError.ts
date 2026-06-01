import { UnitraErrorCode } from '@unitra/dict/unitra';
import { UnitraError } from '../UnitraError';

export class PluginError extends UnitraError {
  public override readonly code = UnitraErrorCode.PLUGIN_ERROR;
}
