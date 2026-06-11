import type { IParser, ParsedFactor, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import type { ConstantRef } from '@unitra/types/def/constant';
import type { PrefixRef } from '@unitra/types/def/prefix';
import type { UnitRef } from '@unitra/types/def/unit';
import type { Node } from '@unitra/types/node';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { Factorize } from './Factorize';
import { Grammar } from './Grammar';
import { Resolve } from './Resolve';
import { Tokenize } from './Tokenize';

export class Parser implements IParser {
  private static readonly log = Logging.createSource( 'parser' );

  private readonly grammar: Grammar;

  private readonly tokenize: Tokenize;
  private readonly resolve: Resolve;
  private readonly factorize: Factorize;

  constructor ( private readonly ctx: UnitraContext ) {
    this.grammar = new Grammar( ctx );

    this.tokenize = new Tokenize( ctx );
    this.resolve = new Resolve( ctx, this.grammar );
    this.factorize = new Factorize( ctx );
  }

  private getNode ( term: ParsedFactor ) : Node {
    if ( term.token.type === 'number' ) return {
      type: 'factor', value: term.token.value, exp: term.exp
    };

    else if ( term.token.type === 'compound' ) {
      const [ ref, prefix ] = term.token.value.reverse();

      if ( ref.key === 'constant' ) return {
        type: 'constant', constant: ref.ref as ConstantRef, exp: term.exp
      };

      else return {
        type: 'unit', unit: ref.ref as UnitRef, exp: term.exp,
        prefix: prefix ? prefix.ref as PrefixRef : undefined
      };
    }

    throw new ParserError(
      `unresolved identifier "${ term.token.value }"`,
      { context: {} }
    );
  }

  private getNodes ( factors: ParsedFactor[] ) : Node[] {
    const nodes: Node[] = [];
    for ( const term of factors ) nodes.push( this.getNode( term ) );
    return nodes;
  }

  private parseInput ( result: ParserResult, input: string ) : void {
    try {
      Parser.log.debug( `parsing "${ input }" ...` );

      const rawTokens = this.tokenize.run( input );
      const resolvedTokens = this.resolve.run( rawTokens );
      const factors = this.factorize.run( resolvedTokens );

      result.state = { nodes: this.getNodes( factors ) };
    }

    catch ( err ) {
      Parser.log.error( `failed to parse input "${ input }"` );

      if ( err instanceof ParserError ) result.error = err;
      else result.error = new ParserError(
        'failed to parse input', { context: { input }, cause: err }
      );
    }
  }

  public parse ( input: unknown ) : ParserResult {
    input = this.ctx.hook().run( 'core.parser.input', {}, input );
    const result: ParserResult = { input, state: { nodes: [] } };

    if ( this.ctx.service.assert().isState( input ) ) result.state = input;

    else if ( this.ctx.service.assert().isSerializedState( input ) ) {
      try { result.state = this.ctx.service.serialize().toReferenceState( input ) }
      catch ( err ) { result.error = new ParserError( 'failed to parse serialized state',
        { context: { input }, cause: err }
      ) }
    }

    else this.parseInput( result, String( input ) );

    this.ctx.hook().run( 'core.parser.result', { result } );
    return result;
  }
}
