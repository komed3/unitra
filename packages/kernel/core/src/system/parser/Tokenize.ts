import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Tokenize {
  private static readonly log = Logging.createSource( 'parser::tokenize' );

  private static readonly SUPER_MAP = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
    '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+'
  } as const;

  private static readonly OPERATOR_MAP = {
    '*': '*', '×': '*', '·': '*', '/': '/', '^': '^'
  } as const;

  private static readonly NATURAL_MAP = {
    'per': '/', 'over': '/', 'square': '^2', 'squared': '^2',
    'cube': '^3', 'cubed': '^3', 'reciprocal': '^-1'
  } as const;

  private static readonly NUMBER_MOD = [
    '.', 'e', '+', '-'
  ] as const;

  constructor ( private readonly ctx: UnitraContext ) {}
}
