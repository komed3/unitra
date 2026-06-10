import type { IParser, ParserResult } from '@unitra/types/core/parser';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Parser implements IParser {
  private static log = Logging.createSource( 'parser' );
  constructor ( private readonly ctx: UnitraContext ) {}

  public parse ( input: unknown ) : ParserResult {
    input = this.ctx.hook().run( 'core.parser.input', {}, input );
    const result: ParserResult = { input, state: { nodes: [] } };

    if ( this.ctx.service.assert().isState( input ) ) result.state = input;

    this.ctx.hook().run( 'core.parser.result', { result } );
    return result;
  }
}
