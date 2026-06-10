import type { IParser, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Parser implements IParser {
  private static log = Logging.createSource( 'parser' );

  constructor ( private readonly ctx: UnitraContext ) {}

  private parseInput ( result: ParserResult, input: string ) : void {}

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
