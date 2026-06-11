import type { GrammarToken, ParserCompoundToken, ParserToken, ResolvedToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import type { Grammar } from './Grammar';

export class Resolve {
  private static readonly log = Logging.createSource( 'parser::resolve' );

  constructor (
    private readonly ctx: UnitraContext,
    private readonly grammar: Grammar
  ) {}

  private compound ( ...tokens: GrammarToken[] ) : ParserCompoundToken {
    return { type: 'compound', value: [ ...tokens ] };
  }

  private resolvePrefixedUnit ( value: string ) : ParserCompoundToken | null {
    for ( let prefixLen = value.length - 1; prefixLen >= 1; prefixLen-- ) {
      const prefixPart = value.slice( 0, prefixLen );
      const unitPart = value.slice( prefixLen );

      const prefix = this.grammar.find( 'prefix', prefixPart );
      if ( ! prefix ) continue;

      const unit = this.grammar.find( 'unit', unitPart );
      if ( ! unit ) continue;

      if ( ! unit.prefixable ) throw new ParserError(
        `unit "${ unit.ref }" cannot be prefixed with "${ prefix.ref }"`,
        { context: {} }
      );

      return this.compound( prefix, unit );
    }

    const match = value.match( /^([a-z]+)(?:[-_\.])([a-z]+)$/i );
    if ( match ) {
      const [ , prefixPart, unitPart ] = match;

      const prefix = this.grammar.find( 'prefix', prefixPart );
      if ( prefix ) {
        const unit = this.grammar.find( 'unit', unitPart );
        if ( unit ) {
          Resolve.log.debug(
            `  found as prefix+unit (with separator): ${ prefixPart } + ${ unitPart }`
          );
          return [ prefix, unit ] as GrammarToken[];
        }
      }
    }

    return null;
  }

  private resolveIdentifier ( value: string, tokens: ParserToken[], index: number ) : ParserCompoundToken {
    Resolve.log.debug( `resolving identifier "${ value }" ...` );

    const u = this.grammar.find( 'unit', value );
    if ( u ) return { type: 'compound', value: [ u ] };

    const c = this.grammar.find( 'constant', value );
    if ( c ) return { type: 'compound', value: [ c ] };
  }

  public run ( tokens: ParserToken[] ) : ResolvedToken[] {}
}
