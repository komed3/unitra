import type { ParserAccessor } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createAccessor } from '../../utils/context';
import { Parser } from './Parser';

export const createParserAccessor = ( ctx: UnitraContext ) : ParserAccessor =>
  createAccessor( () => new Parser( ctx ) );
