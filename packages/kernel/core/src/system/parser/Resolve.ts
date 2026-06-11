import type { GrammarToken, ParserCompoundToken, ParserToken, ResolvedToken } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import type { Grammar } from './Grammar';

type UnitTokenLike = GrammarToken< 'unit' > | string;
type PrefixTokenLike = GrammarToken< 'prefix' > | string;

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

  private resolveCompound ( unitLike: UnitTokenLike, prefixLike?: PrefixTokenLike ) : ParserCompoundToken | null {
    const unit = typeof unitLike === 'string' ? this.grammar.find( 'unit', unitLike ) : unitLike;
    if ( ! unit ) return null;

    if ( ! prefixLike ) return this.compound( unit );

    const prefix = typeof prefixLike === 'string' ? this.grammar.find( 'prefix', prefixLike ) : prefixLike;
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

  private resolveSplitTokens ( value: string, tokens: ParserToken[], index: number ) : ParserCompoundToken | null {
    const prefix = this.grammar.find( 'prefix', value );
    if ( ! prefix ) return null;

    let next: ParserToken;
    if (
      ! ( next = tokens[ index + 1 ] ) || next.type !== 'operator' || next.value !== '*' ||
      ! ( next = tokens[ index + 2 ] ) || next.type !== 'identifier'
    ) throw new ParserError(
      `prefix "${ prefix.ref }" cannot stand alone - must be followed by a unit`,
      { context: {} }
    );

    return this.resolveCompound( next.value, prefix );
  }

  private resolveIdentifier ( value: string, tokens: ParserToken[], index: number ) : [ ParserCompoundToken, number ] {
    Resolve.log.debug( `resolving identifier "${ value }" ...` );

    const unit = this.grammar.find( 'unit', value );
    if ( unit ) return [ this.compound( unit ), index + 1 ];

    const constant = this.grammar.find( 'constant', value );
    if ( constant ) return [ this.compound( constant ), index + 1 ];

    const prefixResolve = this.resolvePrefixedUnit( value );
    if ( prefixResolve ) return [ prefixResolve, index + 1 ];

    const splitResolve = this.resolveSplitTokens( value, tokens, index );
    if ( splitResolve ) return [ splitResolve, index + 3 ];

    throw new ParserError( `cannot resolve identifier "${ value }"`, { context: {} } );
  }

  public run ( tokens: ParserToken[] ) : ResolvedToken[] {
    const resolved: ResolvedToken[] = [];
    let pos = 0;

    while ( pos < tokens.length ) {
      const token = tokens[ pos ];

      if ( token.type !== 'identifier' ) {
        resolved.push( token );

        pos++;
        continue;
      }

      const [ res, next ] = this.resolveIdentifier( token.value, tokens, pos );
      resolved.push( res );
      pos = next;
    }

    return resolved;
  }
}
