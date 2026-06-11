import type { GrammarToken, ParserCompoundToken, ParserToken, ResolvedToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import type { Grammar } from './Grammar';

export class Resolve {
  private static readonly log = Logging.createSource( 'parser::resolve' );
  private static readonly SEP = /^([a-z]+)(?:[-_\.])([a-z]+)$/i;

  constructor (
    private readonly ctx: UnitraContext,
    private readonly grammar: Grammar
  ) {}

  private compound ( ...tokens: GrammarToken[] ) : ParserCompoundToken {
    Resolve.log.debug( `resolved as [ ${ tokens.map( t => `"${ t.ref }"` ).join( ', ' ) } ]` );
    return { type: 'compound', value: [ ...tokens ] };
  }

  private resolveCompound ( unitLike: string, prefixLike?: string ) : ParserCompoundToken | null {
    const unit = this.grammar.find( 'unit', unitLike );
    if ( ! unit ) return null;

    if ( ! prefixLike ) return this.compound( unit );

    const prefix = this.grammar.find( 'prefix', prefixLike );
    if ( ! prefix ) return null;

    if ( ! unit.prefixable ) throw new ParserError(
      `unit "${ unit.ref }" cannot be prefixed with "${ prefix.ref }"`,
      { context: {} }
    );

    return this.compound( prefix, unit );
  }

  private resolvePrefixedUnit ( value: string ) : ParserCompoundToken | null {
    for ( let len = value.length - 1; len >= 1; len-- ) {
      const result = this.resolveCompound( value.slice( len ), value.slice( 0, len ) );
      if ( result ) return result;
    }

    const match = value.match( Resolve.SEP );
    return match ? this.resolveCompound( match[ 2 ], match[ 1 ] ) : null;
  }

  private resolveIdentifier ( value: string, tokens: ParserToken[], index: number ) : ParserCompoundToken {
    Resolve.log.debug( `resolving identifier "${ value }" ...` );

    const unit = this.grammar.find( 'unit', value );
    if ( unit ) return this.compound( unit );

    const constant = this.grammar.find( 'constant', value );
    if ( constant ) return this.compound( constant );

    const prefixResolve = this.resolvePrefixedUnit( value );
    if ( prefixResolve ) return prefixResolve;

    throw new ParserError( '', { context: {} } );
  }

  public run ( tokens: ParserToken[] ) : ResolvedToken[] {}
}
