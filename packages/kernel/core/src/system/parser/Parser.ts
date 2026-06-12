import type { IParser, ParsedFactor, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';
import { Factorize } from './Factorize';
import { Grammar } from './Grammar';
import { NodeBuilder } from './NodeBuilder';
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

  private pipeline ( input: string ) : ParsedFactor[] {
    const raw = this.tokenize.run( input );
    const resolved = this.resolve.run( raw );
    return this.factorize.run( resolved );
  }

  private parseString ( result: ParserResult, input: string ) : void {
    try {
      Parser.log.debug( `parsing "${ input }" ...` );
      const factors = this.pipeline( input );

      Parser.log.debug( `building nodes ...` );
      result.state.nodes = NodeBuilder.toNodes( factors );
    }

    catch ( err ) {
      Parser.log.error( `failed to parse input "${ input }"` );
      result.error = err instanceof ParserError ? err : new ParserError(
        `failed to parse input "${ input }"`,
        { context: { input }, cause: err }
      );
    }
  }

  public invalidateCache () : void {
    this.grammar.invalidate();
  }

  public parse ( input: unknown ) : ParserResult {
    input = this.ctx.hook().run( 'core.parser.input', {}, input );
    const result: ParserResult = { input, state: { nodes: [] } };

    if ( this.ctx.service.assert().isState( input ) ) result.state = input;

    else if ( this.ctx.service.assert().isSerializedState( input ) ) {
      try { result.state = this.ctx.service.serialize().toReferenceState( input ) }
      catch ( err ) { result.error = new ParserError(
        'failed to parse serialized state',
        { context: { input }, cause: err }
      ) }
    }

    else this.parseString( result, String( input ) );

    this.ctx.hook().run( 'core.parser.result', { result } );
    return result;
  }
}
