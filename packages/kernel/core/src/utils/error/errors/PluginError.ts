import { ErrorCode } from '@unitra/dict/utils';
import { UnitraError } from '../UnitraError';

export class PluginError extends UnitraError< ErrorCode.PLUGIN_ERROR > {
  public override readonly code = ErrorCode.PLUGIN_ERROR;
}
