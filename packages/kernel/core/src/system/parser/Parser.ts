import type { IParser, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
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

  private parseInput ( result: ParserResult, input: string ) : void {
    try {
      Parser.log.debug( `parsing "${ input }" ...` );

      const tokens = this.tokenize.run( input );
      const resolved = this.resolve.run( tokens );
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
